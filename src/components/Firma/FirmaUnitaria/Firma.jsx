import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Text, Spinner } from '@bdt/components/dist';
import { useTranslate } from '@services/i18n';
import { emitEvent, EVENTS } from '@services/communication';

import {
    ContenedorFirmaElectronica,
    CajaTituloFirmaElectronica,
    Titulo,
    Input,
    BotonFirmar,
    LinkOlvidado,
    CajaFirmaPrincipal,
    IconSt,
    SubtituloSMS,
    CajaInputYBoton,
    ContenedorFirmas,
    MensajeContainer,
    StyledIcon,
    StyledErrorText,
    AvisoContainer,
} from './Firma.styles';
import { firmar } from './Firma.services';

export default function Firma({ errorGeneral, errorFirma, isLoading, configuracionFirma, onFirmaEncriptada }) {
    const [translate] = useTranslate('firma');

    const [isElectronicLoading, setIsElectronicLoading] = useState(isLoading);
    const [inputError, setInputError] = useState(errorFirma);
    const [valorFirmaSinEncriptar, setValorFirmaSinEncriptar] = useState('');
    const [isBotonFirmaBloqueado, setIsBotonFirmaBloqueado] = useState(true);

    const URL_SOLICITAR_NUEVA_CLAVE = 'oip-personalizacion-claves-firma-solicitar';

    useEffect(() => {
        setIsElectronicLoading(isLoading);
    }, [isLoading]);

    useEffect(() => {
        setInputError(errorFirma);
    }, [errorFirma]);

    const cambioValorInputFirma = useCallback((val) => {
        if (val?.length <= 8) {
            setValorFirmaSinEncriptar(val);
        }

        if (val?.length > 4) {
            setIsBotonFirmaBloqueado(false);
        }
    }, []);

    const firmarAction = useCallback(() => {
        (async () => {
            setIsElectronicLoading(true);
            const firmaEncriptada = await firmar(valorFirmaSinEncriptar);
            setIsElectronicLoading(false);
            onFirmaEncriptada(firmaEncriptada);
        })();
    }, [configuracionFirma, valorFirmaSinEncriptar]);

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

    function firmaDigitalRender() {
        if (isElectronicLoading) {
            return <ContenedorFirmaElectronica>{loadingSpinner()}</ContenedorFirmaElectronica>;
        }

        if (errorGeneral) {
            return (
                <AvisoContainer>
                    <MensajeContainer>
                        <StyledIcon color="error" type="alert" />
                        <StyledErrorText value={translate('generalError')} size="lg" />
                    </MensajeContainer>
                </AvisoContainer>
            );
        }

        return (
            <ContenedorFirmaElectronica>
                <IconSt size="xl" type="lock" color="active" />
                <CajaFirmaPrincipal>
                    <CajaTituloFirmaElectronica>
                        <Titulo value={translate('tituloFirmaDigital')} size="lg" bold />
                        <SubtituloSMS value={translate('subtituloFirmaDigital')} size="md" />
                    </CajaTituloFirmaElectronica>
                    <CajaInputYBoton>
                        <Input type="password" value={valorFirmaSinEncriptar} onChange={cambioValorInputFirma} />
                        <BotonFirmar type="submit" variant="solid" color="primary" onClick={firmarAction} disabled={isBotonFirmaBloqueado}>
                            <Text value={translate('botonFirmar')} bold />
                        </BotonFirmar>
                    </CajaInputYBoton>
                    {inputError && <StyledErrorText value={errorFirma} />}
                    <div onClick={noRecuerdoMiClave}>
                        <LinkOlvidado value={translate('olvidado')} bold color="active" />
                    </div>
                </CajaFirmaPrincipal>
            </ContenedorFirmaElectronica>
        );
    }

    return <ContenedorFirmas>{configuracionFirma.mostrarFirmaElectronica && firmaDigitalRender()}</ContenedorFirmas>;
}

Firma.propTypes = {
    errorGeneral: PropTypes.bool,
    errorFirma: PropTypes.string,
    isLoading: PropTypes.bool,
    configuracionFirma: PropTypes.shape({
        puedeDiferirFirmaMovil: PropTypes.bool,
        puedeDiferirFirmaElectronica: PropTypes.bool,
        mostrarFirmaMovil: PropTypes.bool,
        mostrarFirmaElectronica: PropTypes.bool,
        nivelOperativaElectronica: PropTypes.bool,
        numeroFirmantesRequeridos: PropTypes.number,
        mostrarRequiereFirmasAdicionales: PropTypes.bool,
    }),
    onFirmaEncriptada: PropTypes.func.isRequired,
};

Firma.defaultProps = {
    errorGeneral: false,
    errorFirma: '',
    isLoading: false,
    configuracionFirma: {
        puedeDiferirFirmaMovil: false,
        puedeDiferirFirmaElectronica: false,
        mostrarFirmaMovil: false,
        mostrarFirmaElectronica: true,
        nivelOperativaElectronica: true,
        numeroFirmantesRequeridos: 1,
        mostrarRequiereFirmasAdicionales: false,
    },
};
