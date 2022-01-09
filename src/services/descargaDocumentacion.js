import { descarga } from './descarga';

export function descargaDocumentacion(datos, _documento, _fichero, esDescarga) {
    const documento = _documento;
    const fichero = _fichero;
    if (documento.indicadorMultiArchivo !== 'S') {
        if (!datos.codigoError) {
            documento.leido = true;
            documento.isError = false;
            documento.isSuccess = esDescarga;
            const { localizador } = datos;
            descarga(localizador);
        } else {
            documento.isError = true;
            documento.isSuccess = esDescarga;
            documento.errorData = {
                operationResult: datos.codigoError,
                operationMessage: datos.resolucion,
            };
        }
        documento.showLoading = false;
    }

    if (documento.indicadorMultiArchivo === 'S') {
        let objetoDescarga;
        if (fichero) {
            objetoDescarga = fichero;
        } else {
            objetoDescarga = documento;
        }

        if (!datos.codigoError) {
            documento.leido = true;
            const { ficheros } = datos.documento;
            documento.isError = false;
            fichero.isSuccess = esDescarga;
            for (let i = 0; i < ficheros.length; i = +1) {
                const localizador = ficheros[i].localizadorFichero;
                descarga(localizador);
            }
        } else {
            documento.isError = true;
            fichero.isSuccess = esDescarga;
            documento.errorData = {
                operationResult: datos.codigoError,
                operationMessage: datos.resolucion,
            };
        }
        objetoDescarga.showLoading = false;
    }
}
