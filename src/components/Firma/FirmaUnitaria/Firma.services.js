import { JSEncrypt } from 'jsencrypt';
import { fetchClaveEncriptacion, getCodigoSeguridad, validarCodigoSeguridadSMS } from '@services/api';

async function getClaveEncriptacion() {
    const { response } = await fetchClaveEncriptacion();
    return response.claveEncriptacionFirmaElectronica;
}

function validateSignatureInput(firmaSinEncriptar) {
    if (!firmaSinEncriptar || firmaSinEncriptar.length < 5 || firmaSinEncriptar.length > 8) {
        return new Error();
    }

    return null;
}

function encriptarFirma(firmaSinEncriptar, claveEncriptacionFirmaElectronica) {
    const encryptionService = new JSEncrypt();
    encryptionService.setKey(claveEncriptacionFirmaElectronica);
    return encryptionService.encrypt(firmaSinEncriptar);
}

export async function firmar(firmaSinEncriptar) {
    const result = {
        firmaCorrecta: false,
        errorValidación: false,
        errorFirmaBloqueada: false,
        errorFirma: false,
    };

    const error = validateSignatureInput(firmaSinEncriptar);
    if (error) {
        result.errorValidación = true;
        return result;
    }

    try {
        const claveEncriptacionFirmaElectronica = await getClaveEncriptacion();
        return encriptarFirma(firmaSinEncriptar, claveEncriptacionFirmaElectronica);
    } catch (e) {
        result.errorFirma = true;
        return result;
    }
}

function manageEnviarSMSError(error) {
    const { operationMessage, mensajeResolucionOrden, operationResult } = error;

    if (operationMessage) {
        return { error: true, errorMsg: operationMessage };
    }

    if (mensajeResolucionOrden) {
        return { error: true, errorMsg: mensajeResolucionOrden };
    }

    if (operationResult === 'EGC0005' || operationResult === '00001055') {
        return { error: true, errorMobilNoInformado: true };
    }

    return { error: true };
}

export async function enviarSMS(idOrden, tipoOrden) {
    try {
        const { response } = await getCodigoSeguridad(idOrden, tipoOrden);
        if (response?.operationResult) {
            return manageEnviarSMSError(response);
        }

        return {};
    } catch (e) {
        return manageEnviarSMSError(e);
    }
}

export async function validarCodigoSMS(idOrden, tipoOrden, codigoSeguridadSinEncriptar, claveEncriptacionFirmaElectronica) {
    try {
        const codigoSeguridadEncriptado = encriptarFirma(codigoSeguridadSinEncriptar, claveEncriptacionFirmaElectronica);
        const { response } = await validarCodigoSeguridadSMS(idOrden, tipoOrden, codigoSeguridadEncriptado);
        const { firmaCorrecta, firmaBloqueada, firmaNoPuedeContinuar, errorAlRealizarTransferencia, mensajeResolucionOrden } = response;

        return {
            firmaCorrecta,
            errorFirmaBloqueada: firmaBloqueada,
            errorFirma: firmaNoPuedeContinuar || errorAlRealizarTransferencia,
            mensajeResolucionOrden,
        };
    } catch (e) {
        return {
            errorFirma: true,
        };
    }
}
