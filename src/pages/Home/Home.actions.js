import { ACTIONS as PP_ACTIONS } from '@store/reducers/pendingProcessesReducer';
import { ACTIONS as A_ACTIONS } from '@store/reducers/avisosReducer';
import { ACTIONS as PROCESS_ACTIONS } from '@store/reducers/procesoReducer';
import { goTo } from '@actions/router';
import { push } from 'connected-react-router';
import PAGE_ROUTES from '@routes/routes';
import { emitEvent, EVENTS } from '@services/communication';

import {
    getPendingProcesses,
    getEndPendingProcesses,
    getAvisos as getAvisosApi,
    getDetailProcess as getDetailProcessApi,
    getEscenarioCliente as getEscenarioClienteApi,
} from '@services/api';
import { gestionarErrores } from '../../services/error';

// import redirigirAContrataciones from './services/redirigirAContrataciones';
// import redirigirAvisosNoOp from './services/redirigirAvisosNoOp';
import redirigirAvisosOp from './services/redirigirAvisosOp';
import processesWithShowContract, { processAvisos } from './services/filters';

const setPendingProcesLoading = (loading) => ({
    type: PP_ACTIONS.PENDING_PROCESSES_LOADING,
    payload: loading,
});
const setPendingProcesSuccess = (result) => ({
    type: PP_ACTIONS.PENDING_PROCESSES_SUCCESS,
    payload: result,
});
const setPendingProcesError = (error) => ({
    type: PP_ACTIONS.PENDING_PROCESSES_FAILURE,
    payload: error,
});

function fetchEndPendingProcesses(url) {
    return getEndPendingProcesses(url).then(({ response }) => {
        return response;
    });
}

const setAvisosLoading = (loading) => ({
    type: A_ACTIONS.AVISOS_LOADING,
    payload: loading,
});
const setAvisosSuccess = (result) => ({
    type: A_ACTIONS.AVISOS_SUCCESS,
    payload: result,
});
const setAvisosError = (error) => ({
    type: A_ACTIONS.AVISOS_FAILURE,
    payload: error,
});

const setProceso = (proceso) => ({
    type: PROCESS_ACTIONS.SET_PROCESO,
    payload: proceso,
});

function getDetalleProcesosPendientes(dispatch, procesosPendientes) {
    const peticionesAlDetalle = procesosPendientes.map((p) => {
        const body = {
            idProceso: p.idInstanciaProceso,
            procedencia: p.procedenciaProceso,
            idProducto: p.identificadorProducto,
        };
        return getDetailProcessApi(body);
    });
    return Promise.all(peticionesAlDetalle).then((responseArray) => {
        const procesosPendientesConDetalle = procesosPendientes.map((p, index) => ({
            ...p,
            respuestaCon: { ...responseArray[index].response.respuesta },
            url: responseArray[index].response.respuesta.url,
        }));
        dispatch(setPendingProcesSuccess(procesosPendientesConDetalle));
        dispatch(setPendingProcesLoading(false));
    });
}

function fetchPendingProcessDetail(process) {
    return getPendingProcesses(process).then(({ response }) => {
        const data = Object.keys(response.data.procesos).map((p) => response.data.procesos[p]);
        return { response: data, stateData: response.stateData };
    });
}

function fetchAvisos(process) {
    return getAvisosApi(process).then(({ response }) => {
        return response.avisos;
    });
}

function fetchContratos() {
    const FAMILIA_TARJETAS = '0009';
    return getEscenarioClienteApi().then(({ response }) => {
        return response.contratos.filter((contrato) => {
            if (contrato && contrato.familia && contrato.familia.idFamilia) {
                return FAMILIA_TARJETAS === contrato.familia.idFamilia;
            }
            return false;
        });
    });
}

export function fetchPendingProcesses() {
    return (dispatch) => {
        dispatch(setPendingProcesLoading(true));
        dispatch(setAvisosLoading(true));

        return Promise.all([fetchPendingProcessDetail(), fetchAvisos(), fetchContratos()])
            .then((response) => {
                const getPendingProcessResponse = response[0].response;
                const getAvisosResponse = response[1];
                const getContratos = response[2];
                const digestedProcesses = processesWithShowContract(getPendingProcessResponse);
                const digestedAvisos = processAvisos(getAvisosResponse, getContratos);
                const urlEndPendingProcess = response[0].stateData.availableTransitions.end;
                dispatch(setAvisosSuccess(digestedAvisos));
                fetchEndPendingProcesses(urlEndPendingProcess);
                return getDetalleProcesosPendientes(dispatch, digestedProcesses);
            })
            .catch((err) => {
                dispatch(setPendingProcesError(err.toString()));
                dispatch(setAvisosError(err.toString()));
                if (err) gestionarErrores(dispatch, err);
            })
            .finally(() => {
                dispatch(setPendingProcesLoading(false));
                dispatch(setAvisosLoading(false));
            });
    };
}

export function goToCompleteDocumentation() {
    return (dispatch) => {
        dispatch(push(PAGE_ROUTES.COMPLETAR_DOCUMENTACION));
    };
}
// eslint-disable-next-line consistent-return
const redirigirAContrataciones = (proceso, dispatch) => {
    let parametros = {};
    if (proceso.respuestaCon) {
        parametros = proceso.respuestaCon;
    }

    // if (proceso.url === 'oip-bandeja-tareas-listado') {

    //     const model = {
    //         identificadorInstanciaProceso: proceso.respuestaCon.identificadorInstanciaProceso,
    //         tarea: proceso.respuestaCon.codigoSiguienteTareaDocumentacion,
    //     };
    //     dispatch(iniciarSubproceso(model));
    //     // $state.go('oip-bandeja-tareas-listado', { datosSiguienteTarea: model });
    // }
    if (proceso.url === 'oip-descarga-conversaciones-mifid') {
        const modeloProcesoDescargaConversaciones = {
            idInstanciaProceso: proceso.respuestaCon.identificadorInstanciaProceso,
            nombreDocumento: proceso.respuestaCon.nombreDocumento,
            nombreProducto: proceso.nombreProducto,
        };
        const newProcess = { ...proceso, ...modeloProcesoDescargaConversaciones };
        dispatch(setProceso(newProcess));
        return dispatch(goTo(PAGE_ROUTES.MIFID));
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

    /* ESTO ES IMPRESCINDIBLE: Se abre el canal de comunicación con el padre del iframe */
    // ComunicacionFactory.configChannel('navegacion');
    emitEvent(EVENTS.NAVEGACION, { state: proceso.url, params: producto });
};

export const completarDocumentacion = (process, fromUrl) => {
    // eslint-disable-next-line consistent-return
    return (dispatch) => {
        const newProcess = { ...process };
        if (process.url) {
            return redirigirAContrataciones(process, dispatch);
        }
        newProcess.desdeUrl = fromUrl;
        newProcess.porContratacion = false;
        if (process.esTarjeta && !process.documentacionCompleta) {
            dispatch(setProceso(newProcess));
            dispatch(goTo(PAGE_ROUTES.TARJETAS));
        } else {
            dispatch(setProceso(newProcess));
            dispatch(goTo(PAGE_ROUTES.COMPLETE_DOCUMENTATION));
        }
    };
};

export const verDocumentacion = (process) => {
    return (dispatch) => {
        const newProcess = { ...process };
        if (process.url) {
            redirigirAContrataciones(process, dispatch);
        } else {
            // Rediseñar newProcess para pasarle las propiedades que vayamos a necesitar en cada caso.
            // Hay que ver desde dónde llega procesoContrataciones
            newProcess.porContratacion = false;
            dispatch(setProceso(newProcess));
            dispatch(goTo(PAGE_ROUTES.COMPLETE_DOCUMENTATION));
        }
    };
};

// export const redirigirAvisosNoOpService = (aviso) =>{
//     return redirigirAvisosNoOp(aviso);
// };

export const redirigirAvisosOpService = (aviso) => {
    return redirigirAvisosOp(aviso);
};

export const eliminarAviso = (aviso) => {
    return (dispatch, getState) => {
        const avisos = getState().avisos.data;
        const idAvisosAEliminar = aviso.aviso.id;
        const nuevosAvisos = avisos.filter((a) => a.aviso.id !== idAvisosAEliminar);
        dispatch(setAvisosSuccess(nuevosAvisos));
    };
};
