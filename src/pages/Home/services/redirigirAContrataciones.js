import ROUTES from '@routes/routes';
import { emitEvent, EVENTS } from '@services/communication';

const redirigirAContrataciones = (proceso, goToAction) => {
    let parametros = {};
    if (proceso.respuestaCon) {
        parametros = proceso.respuestaCon;
    }

    if (proceso.url === 'oip-bandeja-tareas-listado') {
        const model = {
            identificadorInstanciaProceso: proceso.respuestaCon.identificadorInstanciaProceso,
            tarea: proceso.respuestaCon.codigoSiguienteTareaDocumentacion,
        };
        return goToAction(ROUTES.HOME, { datosSiguienteTarea: model });
        // $state.go('oip-bandeja-tareas-listado', { datosSiguienteTarea: model });
    }
    if (proceso.url === 'oip-descarga-conversaciones-mifid') {
        const modeloProcesoDescargaConversaciones = {
            idInstanciaProceso: proceso.respuestaCon.identificadorInstanciaProceso,
            nombreDocumento: proceso.respuestaCon.nombreDocumento,
            nombreProducto: proceso.nombreProducto,
        };
        return goToAction(ROUTES.MIFID, { proceso: modeloProcesoDescargaConversaciones });
        // $state.go('oip-descarga-conversaciones-mifid', { proceso: modeloProcesoDescargaConversaciones });
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
export default redirigirAContrataciones;
