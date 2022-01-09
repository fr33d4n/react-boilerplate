import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Text, Spinner } from '@bdt/components/dist';
import { useTranslate } from '@services/i18n';
import { emitEvent, EVENTS } from '@services/communication';

import {
    ContenedorPrincipal,
    ContenedorFirmaElectronica,
    CajaTituloFirmaElectronica,
    Input,
    BotonFirmar,
    BotonSolicitar,
    LinkOlvidado,
    AvisoContainer,
    MensajeContainer,
    StyledErrorText,
    StyledText,
    StyledIcon,
    CajaFirmaPrincipal,
    IconSt,
    Titulo,
    SubtituloSMS,
    CajaInputYBoton,
    CajaSubtituloExito,
    IconExito,
    ContenedorFirmas,
    ContenedorFirmaOTP,
} from './Firma.styles';
import { enviarSMS, fetchConfiguracionFirma, firmar, validarCodigoSMS } from './Firma.services';

const URL_SOLICITAR_NUEVA_CLAVE = 'oip-personalizacion-claves-firma-solicitar';
export default function Firma({ orderId, onSign }) {
    const [translate] = useTranslate('firma');

    // GENERAL
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [configuracionFirma, setConfiguracionFirma] = useState(null);
    // OTP
    const [pasoFirmaOTP, setPasoFirmaOTP] = useState(0);
    const [isOTPLoading, setIsOTPLoading] = useState(false);
    const [OTPErrorMsg, setOTPErrorMsg] = useState('');
    const [mobilNoInformado, setMobilNoInformado] = useState(false);
    const [OTPErrorDebilMsg, setOTPErrorDebilMsg] = useState('');
    const [valorFirmaOTPSinEncriptar, setValorFirmaOTPSinEncriptar] = useState('');
    const [hasFirmaOTPBloqueada, setHasFirmaOTPBloqueada] = useState(false);
    const [hasFirmaOTPError, setHasFirmaOTPError] = useState(false);
    const [isBotonFirmaOTPBloqueado, setIsBotonFirmaOTPBloqueado] = useState(true);
    // DIGITAL
    const [isElectronicLoading, setIsElectronicLoading] = useState(false);
    const [hasFirmaBloqueada, setHasFirmaBloqueada] = useState(false);
    const [hasFirmaError, setHasFirmaError] = useState(false);
    const [inputError, setInputError] = useState('');
    const [valorFirmaSinEncriptar, setValorFirmaSinEncriptar] = useState('');
    const [isBotonFirmaBloqueado, setIsBotonFirmaBloqueado] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data, error } = await fetchConfiguracionFirma(orderId);
            if (error) {
                setHasError(true);
            } else {
                setConfiguracionFirma(data);
                if (data.ordenNecesitaFirmaMovil) {
                    setPasoFirmaOTP(1);
                }
            }

            setIsLoading(false);
        })();
    }, []);

    const cambioValorInputFirma = useCallback((val) => {
        if (val?.length <= 8) {
            setValorFirmaSinEncriptar(val);
        }

        if (val?.length > 4) {
            setIsBotonFirmaBloqueado(false);
        }
    }, []);

    const cambioValorInputFirmaOTP = useCallback((val) => {
        setValorFirmaOTPSinEncriptar(val);

        if (val?.length > 0) {
            setIsBotonFirmaOTPBloqueado(false);
        }
    }, []);

    const firmarAction = useCallback(() => {
        (async () => {
            setIsElectronicLoading(true);
            const resultadoFirma = await firmar(
                orderId,
                configuracionFirma.tipoOrden,
                valorFirmaSinEncriptar,
                configuracionFirma.claveEncriptacionFirmaElectronica,
            );

            const { firmaCorrecta, errorValidación, errorFirmaBloqueada, errorFirma } = resultadoFirma;
            if (errorFirmaBloqueada) {
                setHasFirmaBloqueada(true);
            }

            if (errorFirma) {
                setHasFirmaError(true);
            }

            if (errorValidación) {
                setInputError(translate('errorInputFirma'));
            }

            if (firmaCorrecta) {
                onSign();
            }
            setIsElectronicLoading(false);
        })();
    }, [configuracionFirma, valorFirmaSinEncriptar]);

    const enviarSMSAction = useCallback(() => {
        (async () => {
            setIsOTPLoading(true);
            const { error, errorMsg, errorMobilNoInformado } = await enviarSMS(orderId, configuracionFirma.tipoOrden);
            if (error) {
                if (errorMsg) {
                    setOTPErrorMsg(errorMsg);
                } else {
                    setOTPErrorMsg(translate('errorOTPResolicitar'));
                }

                if (errorMobilNoInformado) {
                    setMobilNoInformado(true);
                }

                setIsOTPLoading(false);
                return;
            }

            setPasoFirmaOTP(2);
            setIsOTPLoading(false);
        })();
    }, [configuracionFirma]);

    const firmarCodigoSMS = useCallback(() => {
        (async () => {
            setIsOTPLoading(true);
            const resultadoFirma = await validarCodigoSMS(
                orderId,
                configuracionFirma.tipoOrden,
                valorFirmaOTPSinEncriptar,
                configuracionFirma.claveEncriptacionFirmaElectronica,
            );

            const { firmaCorrecta, errorFirmaBloqueada, errorFirma, mensajeResolucionOrden } = resultadoFirma;

            if (errorFirmaBloqueada) {
                setHasFirmaOTPBloqueada(true);
            }

            if (errorFirma) {
                setHasFirmaOTPError(true);
            }

            if (!firmaCorrecta) {
                setOTPErrorDebilMsg(mensajeResolucionOrden);
            }

            if (firmaCorrecta) {
                setOTPErrorDebilMsg('');
                setPasoFirmaOTP(3);
            }

            setIsOTPLoading(false);
        })();
    }, [configuracionFirma, valorFirmaOTPSinEncriptar]);

    const solicitarNuevaClave = useCallback(() => {
        emitEvent(EVENTS.NAVEGACION, { state: URL_SOLICITAR_NUEVA_CLAVE });
    }, []);

    const noRecuerdoMiClave = useCallback(() => {
        emitEvent(EVENTS.NAVEGACION, {
            state: URL_SOLICITAR_NUEVA_CLAVE,
            params: {
                indicadorEmisionNuevaFirma: true,
            },
        });
    }, []);

    function loadingSpinner() {
        return <Spinner size="md" />;
    }

    function firmaOTPError() {
        return (
            <AvisoContainer>
                <MensajeContainer>
                    <StyledIcon color="error" type="alert" />
                    <StyledErrorText value={OTPErrorMsg} />
                </MensajeContainer>
                {!mobilNoInformado && (
                    <BotonSolicitar type="submit" variant="solid" color="primary" onClick={enviarSMSAction}>
                        {translate('botonEnviarSMS')}
                    </BotonSolicitar>
                )}
            </AvisoContainer>
        );
    }

    function errorGeneralRender() {
        return (
            <AvisoContainer>
                <MensajeContainer>
                    <StyledIcon color="error" type="alert" />
                    <StyledErrorText value={translate('generalError')} size="lg" />
                </MensajeContainer>
            </AvisoContainer>
        );
    }

    function firmaDigitalBloqueadaRender() {
        return (
            <>
                <StyledErrorText value={translate('firmaBloqueada')} size="md" />
                <StyledText value={translate('firmaBloqueada2')} size="md" />
                <BotonSolicitar type="submit" variant="solid" color="primary" onClick={solicitarNuevaClave}>
                    {translate('botonSolicitarNuevaFirma')}
                </BotonSolicitar>
            </>
        );
    }

    function firmaOTPBloqueadaRender() {
        return (
            <>
                <StyledErrorText value={translate('firmaBloqueada')} size="md" />
                <StyledText value={translate('firmaBloqueada2')} size="md" />
                <BotonSolicitar type="submit" variant="solid" color="primary" onClick={solicitarNuevaClave}>
                    {translate('botonSolicitarNuevaFirma')}
                </BotonSolicitar>
            </>
        );
    }

    function firmaOTPPaso1() {
        return (
            <>
                <IconSt size="xl" type="phone" color="active" />
                <CajaFirmaPrincipal>
                    <CajaTituloFirmaElectronica>
                        <Titulo value={translate('tituloFirmaOTP')} size="xxl" bold />
                        <SubtituloSMS
                            value={`${translate('subtituloFirmaOTP')} ${configuracionFirma.telefono} ${translate('subtituloFirmaOTP2')}`}
                            size="md"
                        />
                    </CajaTituloFirmaElectronica>
                    {OTPErrorDebilMsg && <StyledErrorText value={OTPErrorDebilMsg} />}
                    <BotonSolicitar type="submit" variant="solid" color="primary" onClick={enviarSMSAction}>
                        {translate('botonEnviarSMS')}
                    </BotonSolicitar>
                </CajaFirmaPrincipal>
            </>
        );
    }

    function firmaOTPPaso2() {
        // if (hasFirmaOTPBloqueada) {
        //     return firmaOTPBloqueadaRender();
        // }

        if (hasFirmaOTPError) {
            return errorGeneralRender();
        }

        return (
            <>
                <IconSt size="xl" type="phone" color="active" />
                <CajaFirmaPrincipal>
                    <CajaTituloFirmaElectronica>
                        <Titulo value={translate('tituloFirmaOTP')} size="xxl" bold />
                        {!hasFirmaOTPBloqueada && <SubtituloSMS value={translate('subtituloFirmaOTPPaso2')} size="md" />}
                    </CajaTituloFirmaElectronica>
                    {hasFirmaOTPBloqueada && firmaOTPBloqueadaRender()}
                    {!hasFirmaOTPBloqueada && (
                        <CajaInputYBoton>
                            <Input
                                type="password"
                                value={valorFirmaOTPSinEncriptar}
                                onChange={cambioValorInputFirmaOTP}
                                error={inputError}
                            />
                            <BotonFirmar
                                type="submit"
                                variant="solid"
                                color="primary"
                                onClick={firmarCodigoSMS}
                                disabled={isBotonFirmaOTPBloqueado}
                            >
                                {translate('botonFirmar')}
                            </BotonFirmar>
                        </CajaInputYBoton>
                    )}
                    {OTPErrorDebilMsg && <StyledErrorText value={OTPErrorDebilMsg} />}
                    {!hasFirmaOTPBloqueada && <Text value={translate('instruccionesSMSInput')} color="grey" />}
                </CajaFirmaPrincipal>
            </>
        );
    }

    function firmaOTPSuccess() {
        return (
            <>
                <CajaFirmaPrincipal invisibleIcon>
                    <CajaTituloFirmaElectronica>
                        <Titulo value={translate('tituloFirmaOTP')} size="xxl" bold />
                        <CajaSubtituloExito>
                            <IconExito type="square-check" size="lg" color="active" />
                            <SubtituloSMS value={translate('claveSMSValidada')} size="md" color="active" />
                        </CajaSubtituloExito>
                    </CajaTituloFirmaElectronica>
                </CajaFirmaPrincipal>
            </>
        );
    }

    function firmaOTPRender() {
        if (isOTPLoading) {
            return <ContenedorFirmaOTP>{loadingSpinner()}</ContenedorFirmaOTP>;
        }

        if (OTPErrorMsg) {
            return <ContenedorFirmaOTP>{firmaOTPError()}</ContenedorFirmaOTP>;
        }

        return (
            <ContenedorFirmaOTP exito={pasoFirmaOTP === 3}>
                {pasoFirmaOTP === 1 && firmaOTPPaso1()}
                {pasoFirmaOTP === 2 && firmaOTPPaso2()}
                {pasoFirmaOTP === 3 && firmaOTPSuccess()}
            </ContenedorFirmaOTP>
        );
    }

    function firmaDigitalDisabled() {
        return (
            <>
                <IconSt size="xl" type="lock" color="normal" />
                <CajaFirmaPrincipal>
                    <CajaTituloFirmaElectronica>
                        <Titulo disabled value={translate('tituloFirmaDigital')} size="xxl" bold />
                        <SubtituloSMS disabled value={translate('subtituloFirmaDigitalDisabled')} size="md" />
                    </CajaTituloFirmaElectronica>
                </CajaFirmaPrincipal>
            </>
        );
    }

    function firmaDigitalRender() {
        if (isElectronicLoading) {
            return <ContenedorFirmaElectronica>{loadingSpinner()}</ContenedorFirmaElectronica>;
        }

        const isCurrentlyInOTP = pasoFirmaOTP > 0 && pasoFirmaOTP < 3;
        if (isCurrentlyInOTP) return <ContenedorFirmaElectronica disabled>{firmaDigitalDisabled()}</ContenedorFirmaElectronica>;

        // if (hasFirmaBloqueada) {
        //     return firmaDigitalBloqueadaRender();
        // }

        if (hasFirmaError) {
            return errorGeneralRender();
        }

        return (
            <ContenedorFirmaElectronica>
                <IconSt size="xl" type="lock" color="active" />
                <CajaFirmaPrincipal>
                    <CajaTituloFirmaElectronica>
                        <Titulo value={translate('tituloFirmaDigital')} size="xxl" bold />
                        {!hasFirmaBloqueada && <SubtituloSMS value={translate('subtituloFirmaDigital')} size="md" />}
                    </CajaTituloFirmaElectronica>
                    {hasFirmaBloqueada && firmaDigitalBloqueadaRender()}
                    {!hasFirmaBloqueada && (
                        <>
                            <CajaInputYBoton>
                                <Input type="password" value={valorFirmaSinEncriptar} onChange={cambioValorInputFirma} error={inputError} />
                                <BotonFirmar
                                    type="submit"
                                    variant="solid"
                                    color="primary"
                                    onClick={firmarAction}
                                    disabled={isBotonFirmaBloqueado}
                                >
                                    {translate('botonFirmar')}
                                </BotonFirmar>
                            </CajaInputYBoton>
                            <div onClick={noRecuerdoMiClave}>
                                <LinkOlvidado value={translate('olvidado')} bold color="active" />
                            </div>
                        </>
                    )}
                </CajaFirmaPrincipal>
            </ContenedorFirmaElectronica>
        );
    }

    if (isLoading) {
        return <ContenedorPrincipal>{loadingSpinner()}</ContenedorPrincipal>;
    }

    return (
        // <ContenedorPrincipal>
        <>
            {/* <ContenedorTitulo item container>
                    <Text value={translate('titulo')} size="lg" bold />
                </ContenedorTitulo> */}
            {hasError && errorGeneralRender()}
            <ContenedorFirmas>
                {!hasError && configuracionFirma.ordenNecesitaFirmaMovil && firmaOTPRender()}
                {!hasError && configuracionFirma.ordenNecesitaFirma && firmaDigitalRender()}
            </ContenedorFirmas>
        </>
        // </ContenedorPrincipal>
    );
}

Firma.propTypes = {
    orderId: PropTypes.string.isRequired,
    onSign: PropTypes.func.isRequired,
};
