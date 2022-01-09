export const EVENTS = {
    TARJETAS: 'eventoTercerosPASCON',
    FINALIZAR: 'eventoTareaDocFinalizada',
    NAVEGACION: 'navegacion',
    ANALITICA: 'analitica',
    BIG_DATA: 'eventoBigDataBdt',
    ROUTING_BDT: 'routing_bdt',
};

function getEventBody(event, body) {
    switch (event) {
        case EVENTS.FINALIZAR:
        case EVENTS.NAVEGACION:
        case EVENTS.ANALITICA:
        case EVENTS.BIG_DATA:
        case EVENTS.ROUTING_BDT:
            return { scope: event, message: body };
        case EVENTS.TARJETAS:
            return { scope: event, message: { origen: 'pascon', estado: 'finalizado', pan: body } };
        default:
            return { scope: event };
    }
}

function getTrustedOrigins() {
    return window.location.origin;
}

export function transmit(body) {
    const trustedOrigins = getTrustedOrigins();
    window.postMessage(body, trustedOrigins);
}

export function emitEvent(event, _body) {
    const body = getEventBody(event, _body);
    transmit(body);
}
