/* eslint-disable prefer-template */

import { emitEvent, EVENTS } from '@services/communication';
import { enviarEventoHttp } from '@services/api';

let analiticaBase;
export function getAnalitica() {
    if (!analiticaBase) {
        analiticaBase = {};
    }

    return analiticaBase;
}

export function setAnalitica(body) {
    analiticaBase = body;
}

let infoEventoFromRequest;
export function getInfoEventoFromRequest() {
    if (!infoEventoFromRequest) {
        infoEventoFromRequest = {};
    }

    return infoEventoFromRequest;
}

export function setInfoEventoFromRequest(body) {
    infoEventoFromRequest = body;
}

const infoEventoBase = { enProcesoCompletarDoc: false };
const infoEventoCarritoContratadoBase = {
    plantilla: 'BGEN0012',
    numeroEvento: '0000000012',
};

export function getPasoAnalitica(offset) {
    try {
        return parseInt(analiticaBase.paso, 10) + offset - 1;
    } catch (e) {
        return 0;
    }
}

export function isIniciadoProcesoCompletarDoc() {
    return infoEventoBase.enProcesoCompletarDoc;
}

function getCampoDatoEventoFormateado(valorCampo, longitudCampo) {
    const valorRelleno = ' ';
    let datoFormateado = '';
    if (valorCampo) {
        datoFormateado = valorCampo;
        datoFormateado = valorRelleno.repeat(longitudCampo) + datoFormateado;
        datoFormateado = datoFormateado.slice(-1 * longitudCampo);
    } else {
        datoFormateado = valorRelleno.repeat(longitudCampo);
    }
    return datoFormateado;
}

function limpiarProcesoCompletarDoc() {
    infoEventoBase.enProcesoCompletarDoc = false;
    delete infoEventoBase.identificadorProcesoNoLineal;
    delete infoEventoBase.identificadorProceso;
    delete infoEventoBase.codigoURSUS;
    delete infoEventoBase.codFamilia;
    delete infoEventoBase.codSubFamilia;
    delete infoEventoBase.codigoProductoCPP;
    delete infoEventoBase.descFamilia;
    delete infoEventoBase.descSubFamilia;
    delete infoEventoBase.descProductoComercial;
    delete infoEventoBase.tsIniProceso;
    delete infoEventoBase.importe;
    delete infoEventoBase.telefonoCliente;
    delete infoEventoBase.esTarjetaCredito;
}

export function emitirEventoAnalitica(_body) {
    const body = { ..._body };

    if (body.nombrePagina === 'documentacion completa' && !body.solopagina) {
        body.proceso = 'docu y firma';
    }

    if (body.funnel) {
        if (body.tipoProceso) {
            body.funnel = `${body.funnel} ${body.tipoProceso}`;
            body.proceso = 'contratacion';
        } else {
            body.funnel += ' bdt';
            body.proceso = 'docu y firma';
        }

        body.funnel = body.funnel.replace('bdt bdt', 'bdt');
    }

    if (body.estado && body.mifid) {
        body.estado = `${body.estado}${body.mifid}`;
    }

    if (body.tipoProceso && body.nombrePagina) {
        body.nombrePagina = `${body.nombrePagina} ${body.tipoProceso}`;
    }

    if (body.lineal && !body.paso) {
        delete body.funnel;
    }

    delete body.paso;
    delete body.lineal;

    if (body.solopagina) {
        delete body.solopagina;
        delete body.funnel;
        delete body.solopagina;
        delete body.estado;
        delete body.tipoProceso;
        delete body.producto;
        delete body.orderId;
        delete body.proceso;
        delete body.tematicaContenido;
    }

    emitEvent(EVENTS.ANALITICA, body);
}

export function emitirEventoBigData(_body) {
    let body = { enProcesoCompletarDoc: false };
    if (_body) {
        body = { ..._body };
        body.identificadorProceso = body.identificadorProceso || body.identificadorProcesoNoLineal;
    }

    emitEvent(EVENTS.BIG_DATA, { bigDataEventBdt: body });
}

export function limpiarIniciadoProcesoCompletarDoc() {
    limpiarProcesoCompletarDoc();
    emitirEventoBigData(null);
}

const BASE_EVENTO_HTTP = {
    tipoEvento: 'EV',
    versionEvento: '01',
    versionCabeceraEvento: '01',
    codigoProceso: '',
    tipoEmisor: 'PRO',
    codigoEmisor: 'OI',
    idEmisor: 'OI3',
};

export function emitirEventoViaHttp(_body) {
    const body = { ...BASE_EVENTO_HTTP, ..._body };
    enviarEventoHttp(body);
}

export function getInfoCarritoContratado() {
    const infoEvento = { ...infoEventoCarritoContratadoBase };
    let datosEvento = '';

    let { identificadorProceso } = infoEventoBase;
    if (!infoEventoBase.identificadorProceso) {
        identificadorProceso = infoEventoBase.identificadorProcesoNoLineal;
    }

    datosEvento += getCampoDatoEventoFormateado(identificadorProceso, 40);
    datosEvento += getCampoDatoEventoFormateado(infoEventoBase.codigoURSUS);
    if (infoEventoBase.tsIniProceso) {
        datosEvento += infoEventoBase.tsIniProceso;
    } else {
        datosEvento += infoEventoBase.fechaInicioProcesoBdt;
    }
    datosEvento += getCampoDatoEventoFormateado(infoEventoBase.codFamilia, 5);
    datosEvento += getCampoDatoEventoFormateado(infoEventoBase.codSubFamilia, 5);
    datosEvento += getCampoDatoEventoFormateado(infoEventoBase.codigoProductoCPP, 15);
    datosEvento += getCampoDatoEventoFormateado(infoEventoBase.descFamilia, 70);
    datosEvento += getCampoDatoEventoFormateado(infoEventoBase.descSubFamilia, 120);
    datosEvento += getCampoDatoEventoFormateado(infoEventoBase.descProductoComercial, 120);
    datosEvento += getCampoDatoEventoFormateado(infoEventoBase.importe, 21);
    infoEvento.datosEvento = datosEvento;

    limpiarProcesoCompletarDoc();
    emitirEventoBigData(null);

    return infoEvento;
}

function getFechaActualFormateadaEvento() {
    const today = new Date();
    const date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
    const currentHours = ('0' + today.getHours()).substr(-2);
    const currentMins = ('0' + today.getMinutes()).substr(-2);
    const currentSecs = ('0' + today.getSeconds()).substr(-2);
    const currentMiliSecs = ('000000' + today.getMilliseconds()).substr(-6);
    const time = currentHours + '.' + currentMins + '.' + currentSecs + '.' + currentMiliSecs;
    const dateTime = date + '.' + time;
    return dateTime;
}

export function setInicioProcesoBdT(idProceso, importeOperacion) {
    infoEventoBase.fechaInicioProcesoBdt = getFechaActualFormateadaEvento();
    infoEventoBase.enProcesoCompletarDoc = true;
    if (!infoEventoBase.identificadorProceso) {
        infoEventoBase.identificadorProcesoNoLineal = idProceso;
    }
    if (!infoEventoBase.importe) {
        infoEventoBase.importe = importeOperacion;
    }

    emitirEventoBigData(infoEventoBase);
}
