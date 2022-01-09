import { ACTIONS } from '@store/reducers/currenciesReducer';
import { ACTIONS as PROCESS_ACTIONS } from '@store/reducers/procesoReducer';
import { ACTIONS as ERROR_ACTIONS } from '@store/reducers/errorReducer';
import {
    getCurrencies,
    processPendingTasks,
    manageCardRequest,
    getPendingProcesses,
    getEndPendingProcesses,
    getDetailProcess,
} from '@services/api';
import { goTo } from '@actions/router';
import routes from '@routes/routes';
import { emitEvent, EVENTS } from '@services/communication';
import { setAnalitica, limpiarIniciadoProcesoCompletarDoc, setInfoEventoFromRequest, setInicioProcesoBdT } from '@services/analytics';
import { gestionarErrores } from '../../services/error';

const constantes = {
    NOMBREPROCESOBANDEJA: 'gestiones curso',
    CODIGOPROCESOTARJETA: 'PP000004',
};

var datosAnalitica = {
    nombrePagina: constantes.NOMBREPROCESOBANDEJA,
    tipoContenido: 'web',
    tematicaContenido: 'Contactabilidad',
};

var datosGeneralesAnalitica = {
    tipoContenido: 'web',
    tematicaContenido: 'Contactabilidad',
    paso: 1,
};

var datosGeneralesEvento = {};

const setLoading = (loading) => ({
    type: ACTIONS.CURRENCIES_LOADING,
    payload: loading,
});
const setSuccess = (result) => ({
    type: ACTIONS.CURRENCIES_SUCCESS,
    payload: result,
});
const setError = (error) => ({
    type: ACTIONS.CURRENCIES_FAILURE,
    payload: error,
});
const setProceso = (proceso) => ({
    type: PROCESS_ACTIONS.SET_PROCESO,
    payload: proceso,
});
const setMessageError = (proceso) => ({
    type: ERROR_ACTIONS.SET_ERROR,
    payload: proceso,
});

function fetchPendingProcesses() {
    return getPendingProcesses().then(({ response }) => {
        const procesosArr = Object.keys(response?.data?.procesos).map((p) => response.data.procesos[p]);
        return {
            procesos: procesosArr,
            stateData: response.stateData,
            telefonoCliente: response?.data?.telefonoCliente,
            codCliente: response?.data?.codCliente,
        };
    });
}

function fetchEndPendingProcesses(url) {
    return getEndPendingProcesses(url).then(({ response }) => {
        return response;
    });
}

function fetchDetailProcess(body) {
    return getDetailProcess(body).then(({ response }) => {
        return response;
    });
}

function fetchProcessPendingTasks(modelo) {
    return processPendingTasks(modelo).then(({ response }) => {
        return response;
    });
}

export function fetchCurrencies() {
    return (dispatch, getState) => {
        if (getState().currencies.data.length) {
            return Promise.resolve();
        }

        dispatch(setLoading(true));
        return getCurrencies()
            .then(({ response }) => {
                dispatch(setSuccess(response.listaDivisas));
            })
            .catch((error) => {
                dispatch(setError(error));
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };
}

const inicializarProcesoFromTareas = (tareasPendientesProceso, procesoId) => {
    const familiaProceso = procesoId.substring(0, 8);
    const proceso = {};
    proceso.idInstanciaProceso = procesoId;
    proceso.procedenciaProceso = 'S';
    proceso.esTarjeta = familiaProceso === constantes.CODIGOPROCESOTARJETA;
    proceso.tareas = tareasPendientesProceso;

    return proceso;
};

const estableceSubtipoTarea = (_proceso, params) => {
    let subTipoDefecto = 'DO';
    if (params['tarea.subTipo']) {
        subTipoDefecto = params['tarea.subTipo'];
    }

    let i;
    const proceso = { ..._proceso };
    for (i = 0; i < _proceso.tareas.length; i += 1) {
        if (_proceso.tareas[i].codigoTarea === params['tarea.codigoTarea']) {
            proceso.tareas[i].subTipo = subTipoDefecto;
        }
    }
    return proceso;
};

const getConversacionesMIFIDFromParameters = ({ nombreDocumento, nombreProductoComercial }) => {
    let conversacionesMIFID = null;

    if (nombreDocumento || nombreProductoComercial) {
        conversacionesMIFID = {};
        if (nombreDocumento) {
            conversacionesMIFID.nombreDocumento = nombreDocumento;
        }
        if (nombreProductoComercial) {
            conversacionesMIFID.nombreProductoComercial = nombreProductoComercial;
        }
    }
    return conversacionesMIFID;
};

const getTareaFromParameters = (params) => {
    let tarea = null;

    if (params.tarea) {
        const { codigoFase, codigoTarea, subTipo, fechaVencimiento, idSubproceso } = params.tarea;
        if (codigoFase || codigoTarea || subTipo || fechaVencimiento || idSubproceso) {
            tarea = {};
            if (codigoFase) {
                tarea.codigoFase = codigoFase;
            }
            if (codigoTarea) {
                tarea.codigoTarea = codigoTarea;
            }
            if (subTipo) {
                tarea.subTipo = subTipo;
            }
            if (fechaVencimiento) {
                tarea.fechaVencimiento = fechaVencimiento;
            }
            if (idSubproceso) {
                tarea.idSubproceso = idSubproceso;
            }
        }
    }
    return tarea;
};

const prepararDatosSubproceso = (params) => {
    const paramsProcess = { ...params };
    if (params?.proceso) {
        paramsProcess.procesoContrataciones = params.proceso;
        paramsProcess.tareaContrataciones = getTareaFromParameters(paramsProcess);
        paramsProcess.descargaConversacionMifid = getConversacionesMIFIDFromParameters(paramsProcess);
        // datosGeneralesEvento.identificadorProceso = params.proceso;
        // let i;
        // for (i = 0; i < parametrosEventoCarrito.length; i += 1) {
        //     const obj = parametrosEventoCarrito[i];
        //     const valor = params.obj;
        //     if (valor != null && valor !== undefined && valor !== 'undefined') {
        //         datosGeneralesEvento[obj] = params.obj;
        //     }
        // }
        // ComunicacionFactory.setInfoEventoFromRequest(datosGeneralesEvento);
    }
    return { paramsProcess };
    // else {
    // ComunicacionFactory.setInfoEventoFromRequest(null);

    // delete datosGeneralesEvento.identificadorProceso;
    // delete datosGeneralesEvento.codigoURSUS
    // delete datosGeneralesEvento.codFamilia;
    // delete datosGeneralesEvento.codSubFamilia;
    // delete datosGeneralesEvento.codigoProductoCPP;
    // delete datosGeneralesEvento.descFamilia;
    // delete datosGeneralesEvento.descSubFamilia;
    // delete datosGeneralesEvento.descProductoComercial;
    // delete datosGeneralesEvento.tsIniProceso;
    // delete datosGeneralesEvento.importe;
    // delete datosGeneralesEvento.telefonoCliente;
    // delete datosGeneralesEvento.esTarjetaCredito;
    //   }
};

function redirigirAContrataciones(proceso, dispatch, params) {
    let parametros = {};
    if (proceso.respuestaCon) {
        parametros = proceso.respuestaCon;
    }

    if (proceso.url === 'oip-bandeja-tareas-listado') {
        return dispatch(goTo(routes.HOME));
    }
    if (proceso.url === 'oip-descarga-conversaciones-mifid') {
        const modeloProcesoDescargaConversaciones = {
            idInstanciaProceso: proceso.respuestaCon.identificadorInstanciaProceso,
            nombreDocumento: proceso.respuestaCon.nombreDocumento,
            nombreProducto: proceso.nombreProducto,
        };
        const { ocultarCabecera } = params;
        const newProceso = { ...proceso, ...modeloProcesoDescargaConversaciones, ocultarCabecera };
        dispatch(setProceso(newProceso));
        return dispatch(goTo(routes.MIFID));
    }

    let producto = {};
    if (proceso.url === 'oip-contratacion-seguros-autos-iframe') {
        producto = {
            datos: parametros,
        };
    } else {
        producto = {
            producto: parametros,
        };
    }

    /* Se abre el canal de comunicación con el padre del iframe */
    //   ComunicacionFactory.configChannel('navegacion');
    return emitEvent(EVENTS.NAVEGACION, { state: proceso.url, params: producto });
}

const completarDocumentacion = (_proceso, desdeUrl, params, dispatch) => {
    setInicioProcesoBdT(_proceso.idInstanciaProceso, _proceso.importeOperacion);
    if (_proceso.url) {
        return redirigirAContrataciones(_proceso, dispatch, params);
    }
    const proceso = { ..._proceso };
    proceso.desdeUrl = desdeUrl;
    // eslint-disable-next-line no-unneeded-ternary
    proceso.porContratacion = _proceso.url ? true : false;
    // proceso.porContratacion = params.procesoContrataciones ? true : false;
    proceso.ocultarCabecera = params.ocultarCabecera;

    if (_proceso.esTarjeta && !_proceso.documentacionCompleta) {
        dispatch(setProceso(proceso));
        return dispatch(goTo(routes.TARJETAS));
    }
    dispatch(setProceso(proceso));
    return dispatch(goTo(routes.COMPLETE_DOCUMENTATION));
};

export const iniciarSubproceso = (params) => {
    return async (dispatch, getState) => {
        setAnalitica(datosGeneralesAnalitica);
        limpiarIniciadoProcesoCompletarDoc();

        const { paramsProcess } = prepararDatosSubproceso(params, getState);
        // es necesario si se contempla carritoContratado y carrito abandonado
        // limpiarIniciadoProcesoCompletarDoc();
        if (paramsProcess?.proceso && paramsProcess['tarea.codigoTarea']) {
            try {
                const modelo = {
                    idInstanciaProceso: paramsProcess.proceso,
                    codigoTareaFiltroDisponibilidad: paramsProcess['tarea.codigoTarea'],
                };
                const response = await fetchProcessPendingTasks(modelo);
                let newProceso = { ...paramsProcess };
                if (
                    response &&
                    response.indicadorDisponibilidadTareaFiltro &&
                    response?.tareasPendientes &&
                    response?.tareasPendientes.length > 0
                ) {
                    setInfoEventoFromRequest(datosGeneralesEvento);
                    let proceso = inicializarProcesoFromTareas(response?.tareasPendientes, paramsProcess.proceso);
                    proceso.desdeUrl = true;
                    proceso = estableceSubtipoTarea(proceso, paramsProcess);

                    if (paramsProcess.origen) {
                        proceso.origen = paramsProcess.origen;
                    }

                    if (proceso.esTarjeta) {
                        const manageCardRequestModelo = {
                            identificadorTarjetaPropuesta: proceso.idInstanciaProceso,
                        };
                        const { response: solicitudTarjetaResponse, error: solicitudTarjetaError } = await manageCardRequest(
                            manageCardRequestModelo,
                        );

                        if (solicitudTarjetaError) gestionarErrores(dispatch, solicitudTarjetaError);
                        newProceso = { ...proceso, ...solicitudTarjetaResponse, ...manageCardRequestModelo };
                        completarDocumentacion(newProceso, true, paramsProcess, dispatch);
                    } else {
                        completarDocumentacion(proceso, true, paramsProcess, dispatch);
                    }
                } else {
                    dispatch(setMessageError({ codigoError: 'TAREA_NO_DISPONIBLE' }));
                    dispatch(goTo(routes.ERROR));
                }
            } catch (error) {
                if (error) gestionarErrores(dispatch, error);
            }
        } else {
            if (paramsProcess.proceso && paramsProcess.descargaConversacionMifid) {
                const modeloProcesoDescargaConversaciones = {
                    idInstanciaProceso: paramsProcess.proceso,
                    nombreDocumento: paramsProcess.descargaConversacionMifid.nombreDocumento,
                    nombreProducto: paramsProcess.descargaConversacionMifid.nombreProductoComercial,
                };
                const proceso = { ...paramsProcess, ...modeloProcesoDescargaConversaciones };
                dispatch(setProceso(proceso));
                dispatch(goTo(routes.MIFID));
            } else {
                if (paramsProcess.proceso) {
                    try {
                        const response = await fetchPendingProcesses();

                        if (!datosGeneralesEvento.telefonoCliente) {
                            datosGeneralesEvento.telefonoCliente = response.telefonoCliente;
                        }
                        if (!datosGeneralesEvento.codigoURSUS) {
                            datosGeneralesEvento.codigoURSUS = response.codCliente;
                        }
                        setInfoEventoFromRequest(datosGeneralesEvento);

                        const proceso = response.procesos.find((process) => process.idInstanciaProceso === paramsProcess.proceso);
                        const desdeUrl = true;
                        const urlEndPendingProcess = response.stateData.availableTransitions.end;
                        if (proceso) {
                            const body = {
                                idProceso: proceso.idInstanciaProceso,
                                procedencia: proceso.procedenciaProceso,
                                idProducto: proceso.identificadorProducto,
                            };
                            const { respuesta } = await fetchDetailProcess(body);
                            const procesosPendientesConDetalle = {
                                ...proceso,
                                respuestaCon: respuesta.respuestaCon,
                                url: respuesta.url,
                            };
                            await fetchEndPendingProcesses(urlEndPendingProcess);
                            return completarDocumentacion(procesosPendientesConDetalle, desdeUrl, paramsProcess, dispatch);
                        }

                        const err = 'Error al obtener el proceso indicado';
                        gestionarErrores(dispatch, err);
                    } catch (error) {
                        gestionarErrores(dispatch, error);
                    }
                }
                dispatch(goTo(routes.HOME));
            }

            gestionarErrores(dispatch);
        }
    };
};
