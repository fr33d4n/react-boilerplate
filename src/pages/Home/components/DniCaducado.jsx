/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Spinner, Text, Grid } from '@bdt/components/dist';
import { useTranslate } from '@services/i18n';
import {
    StyledInputFileDni,
    StyledButton,
    StyledFileItem,
    StyledIcon,
    WrapperDni,
    StyledDisable,
    StyledBorderButton,
    WrapperLeft,
    FilesWrapper,
    StyledTitle,
    StyledText,
    WrapperSpinner,
} from './DniCaducado.styles';

import {
    getOficina,
    getOrdenCorta,
    sendMensajeGestor,
    updateWarningViewState,
    formatearAvisoActualizarEstadoEvento,
    isDuplicatedFile,
    uploadFileTransmissionDni,
} from '../services/dniCaducado';

import FirmaUnica from '../../../components/Firma/FirmaUnica/Firma';

function DniCaducado({ warning, onSuccess, onCancel }) {
    const [showSpinner, setShowSpinner] = useState(false);
    const [showSpinnerInicial, setShowSpinnerInicial] = useState(false);
    const [translate] = useTranslate('home');

    const [oficina, setOficina] = useState('');
    const [error, setError] = useState('');
    const [idOrdenCorta, setIdOrdenCorta] = useState('');
    const [adjuntarDocumento, setAdjuntarDocumento] = useState();
    const arrayExtensions = ['png', 'jpeg', 'jpg'];

    const [listaFicheros, setListaFicheros] = useState([]);

    useEffect(() => {
        setShowSpinnerInicial(true);
        getOficina().then(
            (respuesta) => {
                const aux = respuesta.response.informacionCliente.oficinaComercial;
                setOficina(aux);
                setShowSpinnerInicial(false);
            },
            (err) => {
                setError(err);
                setShowSpinnerInicial(false);
            },
        );
    }, []);

    const handleInputFile = (archivos) => {
        if (archivos) {
            if (!isDuplicatedFile(archivos, listaFicheros)) {
                setListaFicheros((lista) => [...lista, archivos['0']]);
            } else console.log('Archivo duplicado.');
        }
    };

    const deteleFile = useCallback(
        // eslint-disable-next-line consistent-return
        (e) => {
            if (idOrdenCorta) return null;
            const listaNueva = listaFicheros.filter((fichero) => {
                return fichero.lastModified !== e.lastModified;
            });
            setListaFicheros(listaNueva);
        },
        [listaFicheros, idOrdenCorta],
    );

    const formatoArchivo = (idFichero) => {
        const idFicheroSinExtension = idFichero.replace('.zip', '');
        const modeloAdjuntar = {
            extensionFichero: 'zip',
            tipoDocumento: 'DNI',
            tipoDocumentoIdentificacion: 'DNI',
            indicadorEnviarAdjunto: '1',
            firma: true,
            identificadorFichero: idFicheroSinExtension,
        };
        return modeloAdjuntar;
    };

    const handleOnSign = useCallback(() => {
        setShowSpinner(true);
        uploadFileTransmissionDni(listaFicheros).then((result) => {
            const modelo = formatoArchivo(result.response.operationMessage);
            setAdjuntarDocumento(modelo);
            getOrdenCorta({ adjuntarDocumento: modelo })
                .then(
                    (resp) => {
                        setIdOrdenCorta(resp.response.idOrdenCorta);
                        setShowSpinner(false);
                    },
                    (e) => {
                        if (e?.response?.idOrdenCorta) {
                            setIdOrdenCorta(e.response.idOrdenCorta);
                        }
                        setShowSpinner(false);
                    },
                )
                .catch(() => setShowSpinner(false));
        });
    }, [listaFicheros]);

    const handleFirmaUnica = useCallback(() => {
        setShowSpinner(true);
        sendMensajeGestor({ adjuntarDocumento }, idOrdenCorta).then(() => {
            const avisoFormated = formatearAvisoActualizarEstadoEvento(warning);

            updateWarningViewState(avisoFormated)
                .then(() => {
                    setShowSpinner(false);
                    onCancel();
                    onSuccess(warning);
                })
                .catch(() => {
                    setShowSpinner(false);
                    onCancel();
                });
        });
    });

    return (
        <WrapperDni>
            <>
                {showSpinnerInicial && (
                    <WrapperSpinner>
                        <Spinner />
                    </WrapperSpinner>
                )}
                {!showSpinnerInicial && (
                    <>
                        <WrapperLeft>
                            <StyledTitle value={translate('aportarDoc')} size="xxl" bold />
                            <Text value={translate('oficina')} bold />
                            <StyledDisable>{oficina}</StyledDisable>
                            <Text value={translate('adjuntarFicheros')} bold />
                        </WrapperLeft>

                        <FilesWrapper>
                            {listaFicheros &&
                                listaFicheros.length > 0 &&
                                listaFicheros.map((fichero) => {
                                    return (
                                        <StyledFileItem className={StyledFileItem} key={fichero.lastModified}>
                                            <span> {fichero.name} </span>
                                            {!idOrdenCorta && (
                                                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                                <div
                                                    onClick={() => {
                                                        deteleFile(fichero);
                                                    }}
                                                >
                                                    <StyledIcon type="delete" size="lg" color="normal" />
                                                </div>
                                            )}
                                        </StyledFileItem>
                                    );
                                })}
                        </FilesWrapper>

                        {(!listaFicheros && !idOrdenCorta) ||
                            (listaFicheros?.length < 2 && !idOrdenCorta && (
                                <StyledInputFileDni
                                    label={translate('adjuntar')}
                                    id="adjuntar"
                                    onLoaded={handleInputFile}
                                    validMimeTypes={arrayExtensions}
                                    uploadFileType="readAsDataURL"
                                />
                            ))}
                        <StyledText value={translate('instruccionesDni')} />
                        {showSpinner && <Spinner />}
                        {idOrdenCorta && !showSpinner && (
                            <>
                                {/* <Text value={translate('firmaOperacion')} size="xxl" bold /> */}
                                <FirmaUnica orderId={idOrdenCorta} onSign={handleFirmaUnica} />
                            </>
                        )}
                        {!idOrdenCorta && !showSpinner && (
                            <Grid item justifyContent="center" alignItems="flex-end">
                                <StyledBorderButton type="button" variant="outlined" reverse onClick={onCancel}>
                                    {translate('cancelar')}
                                </StyledBorderButton>
                                <StyledButton
                                    type="button"
                                    variant="solid"
                                    reverse
                                    disabled={listaFicheros?.length === 0}
                                    onClick={handleOnSign}
                                >
                                    {translate('firmar')}
                                </StyledButton>
                            </Grid>
                        )}
                    </>
                )}
            </>
            {!showSpinnerInicial && error && <span>{error}</span>}
        </WrapperDni>
    );
}

DniCaducado.propTypes = {
    warning: PropTypes.shape({
        aviso: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
            descripcion: PropTypes.string,
            codigo: PropTypes.string.isRequired,
            importancia: PropTypes.bool.isRequired,
        }),
    }).isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default DniCaducado;
