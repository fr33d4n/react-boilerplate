import ROUTES from '@routes/routes';
import { ACTIONS } from '@store/reducers/procesoReducer';
import { goTo } from '@actions/router';

const procesosMock = {
    procesoTarjeta: {
        idInstanciaProceso: 'PH000001200900346934',
        procedenciaProceso: 'S',
        esTarjeta: true,
        tareas: [
            {
                codigoFase: '',
                codigoTarea: 'RealizarDocumentacionYFirma',
                fechaVencimiento: '2020-09-22',
                idSubproceso: 'PH000001200900346934US000011',
                subTipo: 'DO',
            },
        ],
        desdeUrl: true,
        porContratacion: true,
    },
    procesoCuenta: {
        idInstanciaProceso: 'PH000001201000621233',
        contrato: '20388336136000003632',
        documentacionCompleta: false,
        intervinientes: [],
        tareas: [
            {
                codigoFase: '',
                codigoTarea: 'RealizarDocumentacionYFirma',
                subTipo: 'DP',
                fechaVencimiento: '2021-04-14',
                idSubproceso: 'PH000001201000621233US000011',
            },
        ],
        nombreProducto: 'CUENTA FÁCIL',
        fechaVencimiento: '2021-04-14',
        importeOperacion: '',
        procedenciaProceso: 'S',
        esTarjeta: false,
        indicadorExistenciaExpedienteDocumental: false,
        indicadorFinalizarProcesoSolicitud: false,
        indicadorTarjetaConPin: false,
        descripcion: 'Apertura de Captación',
        codigoProceso: 'PH000001',
        pdteSoloDocOpcional: false,
        tienePostAccionesPendientes: false,
        fondoValidarPostAccionesPdtes: false,
        identificadorProducto: '11364',
        porContratacion: false,
    },
    procesoCuentaDog: {
        idInstanciaProceso: 'PH000001201000360777',
        procedenciaProceso: 'S',
        esTarjeta: false,
        tareas: [
            {
                codigoFase: '',
                codigoTarea: 'RealizarDocumentacionYFirma',
                fechaVencimiento: '2020-10-28',
                idSubproceso: 'PH000001201000360777US000011',
                subTipo: 'DO',
            },
        ],
        desdeUrl: true,
        porContratacion: true,
    },
    procesoHipotecaAdjuntar: {
        idInstanciaProceso: 'TNALAPEX0002096152020-09-15000',
        contrato: '000000002254553983',
        documentacionCompleta: false,
        intervinientes: [],
        tareas: [
            {
                codigoFase: 'SOLICITUD',
                codigoTarea: 'TN045RD1OI',
                subTipo: 'DO',
                fechaVencimiento: '9999-12-31',
                idSubproceso: 'TNALAPEX0002096152020-09-15000TN045RD1OI',
            },
            {
                codigoFase: 'TRAMITACIÓN',
                codigoTarea: 'TN120RD2OI',
                subTipo: 'DO',
                fechaVencimiento: '9999-12-31',
                idSubproceso: 'TNALAPEX0002096152020-09-15000TN120RD2OI',
            },
            {
                codigoFase: 'RESOLUCIÓN',
                codigoTarea: '0000000022545539830510ZMTN999AOE',
                subTipo: 'OT',
                fechaVencimiento: '9999-12-31',
                idSubproceso: '0000000022545539830510ZMTN999AOE',
            },
        ],
        nombreProducto: 'LA HIPOTECA BASICA',
        fechaVencimiento: '',
        importeOperacion: '+00000001500000028112',
        procedenciaProceso: 'T',
        esTarjeta: false,
        indicadorExistenciaExpedienteDocumental: false,
        indicadorFinalizarProcesoSolicitud: false,
        indicadorTarjetaConPin: false,
        descripcion: 'PRUEBA MULTIARCHIVO RAFA',
        codigoProceso: '0000100000112232640510ZM',
        pdteSoloDocOpcional: false,
        tienePostAccionesPendientes: false,
        fondoValidarPostAccionesPdtes: false,
        identificadorProducto: '013005',
        desdeUrl: true,
        porContratacion: true,
        esProcesoVariasTareasDocumentacion: false,
        esProcesoConSBPFinalizacionEspecifico: false,
    },
};

const setProceso = (result) => ({
    type: ACTIONS.SET_PROCESO,
    payload: result,
});

export function goToCompletarDocumentacion(proceso) {
    return function (dispatch) {
        dispatch(setProceso(procesosMock[proceso]));
        dispatch(goTo(ROUTES.COMPLETE_DOCUMENTATION));
    };
}

export function goToContratacionFinalizada(procesoFinalizado) {
    return function (dispatch) {
        dispatch(setProceso(procesoFinalizado));
        dispatch(goTo(ROUTES.CONTRATACION_FINALIZADA));
    };
}

export function goToMifid(procesoMifid) {
    return function (dispatch) {
        dispatch(setProceso(procesoMifid));
        dispatch(goTo(ROUTES.MIFID));
    };
}
