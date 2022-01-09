/* eslint-disable no-restricted-syntax */
import {
    getDatosCliente,
    enviarMensajeGestor,
    actualizarEstadoVisualizacionAviso,
    uploadDni,
    enviarMensajeGestorConKIOI,
} from '@services/api';

import { zipFiles } from '@services/files';

const formatearAviso = (warn) => {
    const aux = {};
    for (const property in warn) {
        if (property !== 'aviso') {
            aux[property] = warn[property];
        }
    }
    return Object.assign(aux, warn.aviso);
};

const handleZipFiles = async (files) => {
    const zipedFiles = await zipFiles(files);
    return zipedFiles;
};

export const formatearAvisoActualizarEstadoEvento = (warn) => {
    const aviso = formatearAviso(warn);
    const avisoFormated = {
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
        importeOperacion: aviso.importeOperacion || '',
        procedenciaProceso: aviso.procedenciaProceso,
        agrupador: aviso.agrupador ? aviso.agrupador.avisos : '',
        descripcionAgrupador: aviso.agrupador ? aviso.agrupador.descripcion : '',
        codigoProceso: aviso.codigoProceso,
        idProceso: aviso.idProceso,
        descripcionProceso: aviso.descripcionProceso,
        estadoVisualizacion: 'NM',
        naturalezaEvento: aviso.naturalezaEvento,
    };
    return avisoFormated;
};

export const getOficina = () => {
    return getDatosCliente();
};

export const getOrdenCorta = (body) => {
    return enviarMensajeGestor(body);
};

export const sendMensajeGestor = (body, idOrden) => {
    return enviarMensajeGestorConKIOI(body, idOrden);
};

export const uploadFileTransmissionDni = (files) => {
    return handleZipFiles(files).then((zipedFiles) => {
        return uploadDni(zipedFiles);
    });
};

export const updateWarningViewState = (body) => {
    return actualizarEstadoVisualizacionAviso(body);
};

export const isDuplicatedFile = (file, lista) => {
    let isDuplicated = false;
    lista.forEach((item) => {
        if (item.lastModified === file['0'].lastModified) isDuplicated = true;
    });
    return isDuplicated;
};
