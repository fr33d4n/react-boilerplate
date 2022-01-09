function getUrlDownload(localizador = '') {
    let url = localizador.replace('http://', 'https://');

    if (localizador.indexOf('http') !== 0) {
        url = `/api/1.0/sap/commons/transmission/get${localizador}?j_gid_cod_app=oi&x-j_gid_cod_app=oi&j_gid_cod_ds=oip`;
    }

    return url;
}

function descargarDocumentoDesdeUrl(url) {
    if (url.indexOf('http') === 0) {
        window.open(url, '_blank');
    } else {
        const save = document.createElement('a');
        save.href = url;
        save.target = '_blank';
        const filename = url.substring(url.lastIndexOf('/') + 1);
        save.download = filename;
        if (navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search('Chrome') < 0) {
            document.location = save.href;
        } else {
            const evt = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: false,
            });
            save.dispatchEvent(evt);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }
        // window.location.href = url;
    }
}

export function descarga(localizador) {
    const url = getUrlDownload(localizador);

    descargarDocumentoDesdeUrl(url);
}
