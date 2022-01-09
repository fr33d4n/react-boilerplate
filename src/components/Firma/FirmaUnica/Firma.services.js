import { JSEncrypt } from 'jsencrypt';
import { fetchConsultarOrdenFirma, validarFirma, getCodigoSeguridad, validarCodigoSeguridadSMS } from '@services/api';

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

export async function fetchConfiguracionFirma(orderId) {
    const result = {
        data: null,
        error: null,
    };
    try {
        const { response } = await fetchConsultarOrdenFirma(orderId);
        result.data = response;
    } catch (e) {
        result.error = e;
    }

    return result;
}

export async function firmar(orderId, tipoOrden, firmaSinEncriptar, claveEncriptacionFirmaElectronica) {
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

    const firmaEncriptada = encriptarFirma(firmaSinEncriptar, claveEncriptacionFirmaElectronica);
    try {
        const { response } = await validarFirma(orderId, firmaEncriptada, tipoOrden);
        const { firmaCorrecta, firmaBloqueada, firmaNoPuedeContinuar, errorAlRealizarTransferencia } = response;

        return {
            ...result,
            firmaCorrecta,
            errorValidación: !firmaCorrecta,
            errorFirmaBloqueada: firmaBloqueada,
            errorFirma: firmaNoPuedeContinuar || errorAlRealizarTransferencia,
        };
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
