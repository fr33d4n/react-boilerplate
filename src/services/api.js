import { getHttpClient } from '@bdt/core';
import getAllMocks from '@services/mocks';
import { prepareFileToSend, prepareDniToSend } from '@services/files';

export const API_ROUTES = {
    CURRENCIES: '/api/1.0/servicios/divisas/2.0/divisas',
    PENDING_PROCESSES: '/api/1.0/servicios-bdt/bandejatareas.consultarprocesos/9.0/bandejatareas/consultarprocesos',
    DETAIL_PROCESS: '/api/1.0/servicios-bdt/contratacion.consultarenlacecontratacion/8.0/contratacion/consultarenlacecontratacion',
    AVISOS: '/api/1.0/servicios-bdt/ObtenerAvisosEnCursoCliente/1.0/ObtenerAvisosEnCursoCliente',
    USUARIO_SERVICE: '/api/1.0/servicios/cliente.datos/7.0/cliente/datos',
    MANAGE_DOCUMENTATION: '/api/1.0/servicios-bdt/bandejatareas.gestionardocumentacion/19.0/bandejatareas/gestionardocumentacion',
    MANAGE_FINALIZAR:
        // eslint-disable-next-line max-len
        '/api/1.0/servicios-bdt/bandejatareas.gestionardocumentacion/19.0/bandejatareas/gestionardocumentacion?_eventId=consultarNuevasTareas',
    MANAGE_ELIMINAR:
        '/api/1.0/servicios-bdt/bandejatareas.gestionardocumentacion/19.0/bandejatareas/gestionardocumentacion?_eventId=eliminar',
    REGISTRAR_DERECHO_PARCOL: '/api/1.0/servicios/registrar.derecho/1.0/registrar/derecho',
    PROCESS_PENDING_TASKS:
        // eslint-disable-next-line max-len
        '/api/1.0/servicios-bdt/bandejatareas.consultarTareasPendientesInstanciaProceso/2.0/bandejatareas/consultarTareasPendientesInstanciaProceso',
    MANAGE_CARD_REQUEST: '/api/1.0/servicios-bdt/bandejatareas.gestionarSolicitudTarjeta/1.0/bandejatareas/gestionarSolicitudTarjeta',
    ORDENES_PENDIENTES: '/api/1.0/servicios/transferencias.consultarOrdenesPendientes/2.0/transferencias/consultarOrdenesPendientes',
    DETALLE_ORDENES_PENDIENTES: '/api/1.0/operativas/1.0/transferencias/consultarDetalleOrdenesPendientes',
    DESCARGA_CONVERSACION:
        // eslint-disable-next-line max-len
        '/api/1.0/servicios-bdt/bandejatareas.ConsultarLocalizadorConversacionesMifid/1.0/bandejatareas/ConsultarLocalizadorConversacionesMifid',
    FINALIZAR_PROCESO_DESCARGA_CONVERSACION:
        // eslint-disable-next-line max-len
        '/api/1.0/servicios-bdt/bandejatareas.ConsultarLocalizadorConversacionesMifid/1.0/bandejatareas/FinalizarLocalizadorConversacionesMifid',
    DOWNLOAD_URL_PRE: '/sap/commons/transmission/get',
    DOWNLOAD_URL_FIN: '?j_gid_cod_app=oi&x-j_gid_cod_app=oi&j_gid_cod_ds=oip',
    FIRMA_CONSULTAR_ORDEN: {
        endpoint: '/api/1.0/operativas/1.0/ordenes/{ORDER_ID}/?identificadorOrden={ORDER_ID}',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi', 'Content-type': 'application/json' },
    },
    FIRMA_VALIDAR_FIRMA: {
        endpoint: '/api/1.0/operativas/1.0/ordenes/{ORDER_ID}/firma-digital?identificadorOrden={ORDER_ID}',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi', 'Content-type': 'application/json' },
    },
    ESCENARIO_CLIENTE: '/api/1.0/servicios/contexto.escenariocliente/13.0/contexto/escenariocliente',
    BLOQUEAR_DOC_FIRMA_UNICA: {
        endpoint:
            // eslint-disable-next-line max-len
            '/api/1.0/servicios-bdt/bandejatareas.BloquearDocumentoFirmaUnicaCanalDesatendido/1.0/bandejatareas/BloquearDocumentoFirmaUnicaCanalDesatendido',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi', 'Content-type': 'application/json' },
    },

    DESBLOQUEAR_DOC_FIRMA_UNICA: {
        endpoint:
            // eslint-disable-next-line max-len
            '/api/1.0/servicios-bdt/bandejatareas.DesbloquearDocsFirmaUnicaCanalDesatendido/1.0/bandejatareas/DesbloquearDocsFirmaUnicaCanalDesatendido',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi', 'Content-type': 'application/json' },
    },

    SOLICITUD_FIRMA_UNICA: {
        endpoint:
            // eslint-disable-next-line max-len
            '/api/1.0/servicios-bdt/bandejatareas.SolicitarFirmaUnicaDocCanalDesatendido/1.0/bandejatareas/SolicitarFirmaUnicaDocCanalDesatendido',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi', 'Content-type': 'application/json' },
    },

    DATOS_CLIENTE: '/api/1.0/servicios/cliente.datos/6.0/cliente/datos?_ts1605537349628',
    MENSAJE_GESTOR: '/api/1.0/servicios/contratacion.EnviarMensajeGestor/6.0/contratacion/EnviarMensajeGestor',
    ESTADO_AVISO: '/api/1.0/servicios-bdt/ActualizarEstadoVisualizacionAvisoSBP/1.0/ActualizarEstadoVisualizacionAvisoSBP',

    REALIZAR_FIRMA_UNICA:
        // eslint-disable-next-line max-len
        '/api/1.0/servicios-bdt/bandejatareas.RealizarFirmaUnicaDocumentacionCanalDesatendido/1.0/bandejatareas/RealizarFirmaUnicaDocumentacionCanalDesatendido',
    ENTREGAR_DOC_FIRMA_DEBIL:
        // eslint-disable-next-line max-len
        '/api/1.0/servicios-bdt/bandejatareas.SolicitarFirmaUnicaDocCanalDesatendido/1.0/bandejatareas/SolicitarFirmaUnicaDocumentacionDebil',
    FIRMA_CODIGO_SEGURIDAD_SMS: {
        endpoint: '/api/1.0/operativas/1.0/ordenes/{ORDER_ID}/firma-movil?identificadorOrden={ORDER_ID}&tipoOrden={TIPO_ORDEN}',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi', 'Content-type': 'application/json' },
    },
    FIRMA_VALIDAR_CODIGO_SEGURIDAD_SMS: {
        endpoint: '/api/1.0/servicios/ordenes.Id.firma-movil/4.0/ordenes/{ORDER_ID}/firma-movil?identificadorOrden={ORDER_ID}',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi', 'Content-type': 'application/json' },
    },
    FINALIZACION: '/api/1.0/operativas/FinalizarContratacionProductoCaptacionSBP/1.0',
    REDIRIGIR_FINALIZACION: '/api/1.0/servicios-bdt/contratacion.consultarenlacecontratacion/8.0/contratacion/consultarenlacecontratacion',
    UPLOAD_FILE_TRANSMISSION: {
        endpoint: '/api/1.0/sap/commons/transmission/put/{FILE_STORE}',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi' },
    },
    UPLOAD_DNI: {
        endpoint: '/api/1.0/sap/commons/transmission/put/filenet',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi' },
    },
    FETCH_CLAVE_ENCRIPTACION: {
        endpoint: '/api/1.0/servicios/clave-encriptacion/2.0/clave-encriptacion',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi', 'Content-type': 'application/json' },
    },
    PROCESS_CARDS: '/api/1.0/servicios-bdt/bandejatareas.gestionardocumentaciontarjeta/5.0/bandejatareas/gestionardocumentaciontarjeta',
    PROCESS_CARDS_CREATE_PIN:
        /* eslint-disable-next-line max-len */
        '/api/1.0/servicios-bdt/bandejatareas.gestionardocumentaciontarjeta/5.0/bandejatareas/gestionardocumentaciontarjeta?_eventId=crearPin',
    ENVIAR_EVENTO_HTTP: {
        endpoint: '/api/1.0/servicios/EmisorEventosSBP/3.0/EmisorEventosSBP',
        headers: { j_gid_cod_app: 'oi', j_gid_cod_ds: 'oip', 'x-j_gid_cod_app': 'oi', 'Content-type': 'application/json' },
    },
};

const bolHeaders = {
    j_gid_cod_app: 'o3',
    j_gid_cod_ds: 'oip',
    'x-j_gid_cod_app': 'o3',
};
const httpClient = getHttpClient(process.env.MOCKS, bolHeaders, getAllMocks());

export function getCurrencies() {
    return httpClient.get(API_ROUTES.CURRENCIES);
}

export function getDatosCliente() {
    return httpClient.get(API_ROUTES.DATOS_CLIENTE);
}
export function postSubirFichero(body) {
    return httpClient.post(API_ROUTES.UPLOAD_FILE, { body });
}
export function enviarMensajeGestor(body) {
    return httpClient.post(API_ROUTES.MENSAJE_GESTOR, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function enviarMensajeGestorConKIOI(body, idOrden) {
    const ruta = `${API_ROUTES.MENSAJE_GESTOR}?idOrden=${idOrden}`;
    return httpClient.post(ruta, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function actualizarEstadoVisualizacionAviso(body) {
    return httpClient.post(API_ROUTES.ESTADO_AVISO, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function getPendingProcesses() {
    return httpClient.get(API_ROUTES.PENDING_PROCESSES);
}
export function getEndPendingProcesses(url) {
    return httpClient.get(url);
}
export function getDetailProcess(body) {
    return httpClient.post(API_ROUTES.DETAIL_PROCESS, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}
export function getAvisos() {
    return httpClient.get(API_ROUTES.AVISOS);
}

export function usuarioService() {
    return httpClient.get(API_ROUTES.USUARIO_SERVICE);
}

export function manageDocumentation(model) {
    return httpClient.post(API_ROUTES.MANAGE_DOCUMENTATION, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function removeDocumentation(model) {
    return httpClient.post(API_ROUTES.MANAGE_ELIMINAR, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function manageFinalizarSbp(url, model) {
    return httpClient.post(url, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function finalizarSbpParcol(model) {
    return httpClient.post(API_ROUTES.REGISTRAR_DERECHO_PARCOL, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function manageAportarDocumentacion(url, model) {
    return httpClient.post(url, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function manageDescargarPlantilla(url, model) {
    return httpClient.post(url, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function processPendingTasks(model) {
    return httpClient.post(API_ROUTES.PROCESS_PENDING_TASKS, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function manageCardRequest(model) {
    return httpClient.post(API_ROUTES.MANAGE_CARD_REQUEST, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function getOrdenesPendientes(body) {
    return httpClient.post(API_ROUTES.ORDENES_PENDIENTES, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function getEscenarioCliente() {
    return httpClient.get(API_ROUTES.ESCENARIO_CLIENTE);
}

export function getDetalleOrendesPendientes(body) {
    return httpClient.post(API_ROUTES.DETALLE_ORDENES_PENDIENTES, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function solicitarOrdenDescargaConversacion(body) {
    return httpClient.post(API_ROUTES.DESCARGA_CONVERSACION, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}
export function bloquearDocFirmaUnica(model) {
    const { endpoint, headers } = API_ROUTES.BLOQUEAR_DOC_FIRMA_UNICA;
    return httpClient.post(endpoint, {
        body: model,
        headers,
    });
}

export function firmarDescargaConversacion(idOrden, body) {
    const ruta = `${API_ROUTES.DESCARGA_CONVERSACION}?idOrden=${idOrden}`;
    return httpClient.post(ruta, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function desbloquearDocFirmaUnica(model) {
    const { endpoint, headers } = API_ROUTES.DESBLOQUEAR_DOC_FIRMA_UNICA;
    return httpClient.post(endpoint, {
        body: model,
        headers,
    });
}

export function obtenerDocumento(localizador) {
    const ruta = API_ROUTES.DOWNLOAD_URL_PRE + localizador + API_ROUTES.DOWNLOAD_URL_FIN;
    return httpClient.get(ruta);
}

export function finalizarProcesoDescargaConversacion(body) {
    return httpClient.post(API_ROUTES.FINALIZAR_PROCESO_DESCARGA_CONVERSACION, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function solicitarFirmaUnica(model) {
    const { headers, endpoint } = API_ROUTES.SOLICITUD_FIRMA_UNICA;
    return httpClient.post(endpoint, {
        body: model,
        headers,
    });
}

export function firmarSolicitudFirmaUnica(idOrden, model) {
    const { headers, endpoint } = API_ROUTES.SOLICITUD_FIRMA_UNICA;
    return httpClient.post(`${endpoint}?idOrden=${idOrden}`, {
        body: model,
        headers,
    });
}

export function manageSalidaObtener(url, model) {
    return httpClient.post(url, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function realizarFirmaUnica(model) {
    return httpClient.post(API_ROUTES.REALIZAR_FIRMA_UNICA, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function manageSalidaDescargar(url, model) {
    return httpClient.post(url, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function fetchConsultarOrdenFirma(orderId) {
    const endpoint = API_ROUTES.FIRMA_CONSULTAR_ORDEN.endpoint.replace(/\{ORDER_ID\}/g, orderId);
    return httpClient.get(endpoint, {}, { headers: API_ROUTES.FIRMA_CONSULTAR_ORDEN.headers });
}

export function validarFirma(orderId, firmaEncriptada, tipoOrden) {
    const endpoint = API_ROUTES.FIRMA_VALIDAR_FIRMA.endpoint.replace(/\{ORDER_ID\}/g, orderId);
    const body = {
        firma: firmaEncriptada,
        tipoOrden,
    };
    return httpClient.post(endpoint, { body, headers: API_ROUTES.FIRMA_CONSULTAR_ORDEN.headers });
}

export function entregarDocFirmaDebil(model) {
    return httpClient.post(API_ROUTES.ENTREGAR_DOC_FIRMA_DEBIL, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function getCodigoSeguridad(idOrden, tipoOrden) {
    const { headers, endpoint } = API_ROUTES.FIRMA_CODIGO_SEGURIDAD_SMS;

    const procesedEndpoint = endpoint.replace(/\{ORDER_ID\}/g, idOrden).replace(/\{TIPO_ORDEN\}/g, tipoOrden);
    return httpClient.get(
        procesedEndpoint,
        {},
        {
            headers,
        },
    );
}

export function validarCodigoSeguridadSMS(idOrden, tipoOrden, codigoSMSEncriptado) {
    const { headers, endpoint } = API_ROUTES.FIRMA_VALIDAR_CODIGO_SEGURIDAD_SMS;

    const procesedEndpoint = endpoint.replace(/\{ORDER_ID\}/g, idOrden);
    return httpClient.post(procesedEndpoint, {
        body: {
            codigoSeguridad: codigoSMSEncriptado,
            tipoOrden,
        },
        headers,
    });
}
export function getFinalizacion(body) {
    return httpClient.post(API_ROUTES.FINALIZACION, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function getRedirigirFinalizacion(body) {
    return httpClient.post(API_ROUTES.REDIRIGIR_FINALIZACION, {
        body,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

// export function executeUrl(url, body) {
//     if (body) {
//         return httpClient.post(url, { body });
//     }
//     return httpClient.get(url);
// }
export function uploadFileTransmission(file, fileName, fileStore) {
    const { endpoint, headers } = API_ROUTES.UPLOAD_FILE_TRANSMISSION;

    // return httpClient.post(endpoint.replace('{FILE_STORE}', fileStore), {
    //     body: prepareFileToSend(file, fileName),
    //     headers,
    // });
    return new Promise((r) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint.replace('{FILE_STORE}', fileStore), true);
        Object.keys(headers).forEach((h) => xhr.setRequestHeader(h, headers[h]));
        xhr.send(prepareFileToSend(file, fileName));

        xhr.onload = () => {
            r({ response: JSON.parse(xhr.response) });
        };
    });
}

export function uploadDni(file) {
    const { endpoint, headers } = API_ROUTES.UPLOAD_DNI;

    // return httpClient.post(endpoint, {
    //     body: prepareDniToSend(file),
    //     headers,
    // });
    return new Promise((r) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint, true);
        Object.keys(headers).forEach((h) => xhr.setRequestHeader(h, headers[h]));
        xhr.send(prepareDniToSend(file));

        xhr.onload = () => {
            r({ response: JSON.parse(xhr.response) });
        };
    });
}

export function fetchClaveEncriptacion() {
    const { headers, endpoint } = API_ROUTES.FETCH_CLAVE_ENCRIPTACION;

    return httpClient.get(
        endpoint,
        {},
        {
            headers,
        },
    );
}

export function processesCards(body) {
    return httpClient.post(API_ROUTES.PROCESS_CARDS, { body });
}

export function processesCardsCreatePin(url, model) {
    return httpClient.post(url, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function manageSalidaFirmarDocumentacionUnitaria(url, model) {
    return httpClient.post(url, {
        body: model,
        headers: {
            'Content-type': 'application/json',
        },
    });
}

export function enviarEventoHttp(body) {
    const { headers, endpoint } = API_ROUTES.ENVIAR_EVENTO_HTTP;
    return httpClient.post(endpoint, { body, headers });
}
