import { emitEvent as goToCommunication, EVENTS } from '@services/communication';

function crearAvisoActualizarEstadoEvento(aviso) {
    return {
        identificador: aviso.id,
        codigo: aviso.codigo,
        nombre: aviso.nombre,
        descripcion: aviso.descripcion,
        tipo: aviso.tipo,
        subtipo: aviso.subtipo,
        estado: aviso.estado,
        momentoCreacion: aviso.fechaCreacion,
        fechaVencimiento: aviso.fechaVencimientoImpl.codigo,
        canalIniciador: aviso.canalIniciador,
        cantidadClientesAsignados: aviso.intervinientes ? aviso.intervinientes.cantidad : '0',
        codigosCliente: aviso.intervinientes ? aviso.intervinientes.ids : [],
        identificadorProductoComercial: aviso.producto ? aviso.producto.id : '',
        nombreProductoComercial: aviso.producto ? aviso.producto.nombre : '',
        identificadorExpediente: aviso.idExpediente,
        importeOperacion: aviso.importeOperacion,
        procedenciaProceso: aviso.procedenciaProceso,
        agrupador: aviso.agrupador ? aviso.agrupador.avisos : '',
        descripcionAgrupador: aviso.agrupador ? aviso.agrupador.descripcion : '',
        codigoProceso: aviso.codigoProceso,
        idProceso: aviso.idProceso,
        descripcionProceso: aviso.descripcionProceso,
        estadoVisualizacion: 'NM',
        naturalezaEvento: aviso.naturalezaEvento,
    };
}

const redirigirAvisosNoOp = (warning) => {
    const { aviso } = warning;

    if (aviso.id.includes('EV0000000062')) {
        sessionStorage.setItem('datosAvisoBT', JSON.stringify(crearAvisoActualizarEstadoEvento(aviso)));
        goToCommunication(EVENTS.NAVEGACION, { state: 'oip-gestion-mis-datos-residencia-fiscal' });
    } else if (aviso.id.includes('EV0000000061') || aviso.id.includes('EV0000000084') || aviso.id.includes('EV0000000068')) {
        sessionStorage.setItem('datosAvisoBT', JSON.stringify(crearAvisoActualizarEstadoEvento(aviso)));
        goToCommunication(EVENTS.NAVEGACION, { state: 'oip-muro-gestion-documentos-aportacion-aportar', params: { tipoDocumento: '2' } });
    } else if (aviso.id.includes('EV0000000060')) {
        const contrato = {
            contrato: warning.aviso.contratoTarjeta,
        };
        goToCommunication(EVENTS.NAVEGACION, { state: 'oip-tarjetas-pin-firma', params: { contrato } });
    } else if (aviso.id.includes('EV0000000070') || aviso.id.includes('EV0000000071') || aviso.id.includes('EV0000000083')) {
        goToCommunication(EVENTS.NAVEGACION, { state: 'oip-gestion-mis-datos-datos-personales' });
    } else if (aviso.id.includes('EV0000000063') || aviso.id.includes('EV0000000064')) {
        return 'openModal';
    } else if (aviso.id.includes('EV0000000072')) {
        console.warning('No redirige');
    }
    return '';
};

export default redirigirAvisosNoOp;
