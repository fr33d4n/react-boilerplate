export const obtenerDocumentosContractualesPost = (vectorDocumentos) => {
    const documentosContractualesPost = [];
    for (let i = 0; i < vectorDocumentos.length; i += 1) {
        if (vectorDocumentos[i].codOrdenDocumento !== '01') {
            documentosContractualesPost.push(vectorDocumentos[i]);
        }
    }
    return documentosContractualesPost;
};

export const establecerPrimerObligatorio = (_documentosOrdenadosObligatoriedad) => {
    let esPrimerOpcional = true;
    const documentosOrdenadosObligatoriedad = [..._documentosOrdenadosObligatoriedad];
    for (let i = 0; i < documentosOrdenadosObligatoriedad.length; i += 1) {
        if (documentosOrdenadosObligatoriedad[i].esObligatorio) {
            documentosOrdenadosObligatoriedad[i].esPrimerOpcional = false;
        } else if (esPrimerOpcional) {
            documentosOrdenadosObligatoriedad[i].esPrimerOpcional = true;
            esPrimerOpcional = false;
        } else {
            documentosOrdenadosObligatoriedad[i].esPrimerOpcional = false;
        }
    }
    return documentosOrdenadosObligatoriedad;
};

export const ordenarObligatoriedad = (array, esFirmaUnica) => {
    let documentosOrdenadosObligatoriedad;

    if (esFirmaUnica) {
        const documentosPrecontractuales = array.filter((doc) => doc.codOrdenDocumento === '01');
        const documentosContractualesPost = obtenerDocumentosContractualesPost(array);
        let documentosPrecontractualesOrdenados = documentosPrecontractuales.reverse();
        let documentosContractualesPostOrdenados = documentosContractualesPost.reverse();

        documentosPrecontractualesOrdenados = establecerPrimerObligatorio(documentosPrecontractualesOrdenados);
        documentosContractualesPostOrdenados = establecerPrimerObligatorio(documentosContractualesPostOrdenados);

        documentosOrdenadosObligatoriedad = [].concat(documentosPrecontractualesOrdenados).concat(documentosContractualesPostOrdenados);
    } else {
        documentosOrdenadosObligatoriedad = array.reverse();
        documentosOrdenadosObligatoriedad = establecerPrimerObligatorio(documentosOrdenadosObligatoriedad);
    }
    return documentosOrdenadosObligatoriedad;
};

export const ampliarFichero = (_fichero) => {
    const fichero = { ..._fichero };
    fichero.name = fichero.nombreFichero;
    fichero.id = 'file';
    fichero.title = fichero.nombreFichero;
    fichero.target = '_blank';
    fichero.contentType = 'pdf';
    fichero.isSuccess = false;
    fichero.idDocGestorDoc = fichero.idDocGestorDoc === '' ? ' ' : fichero.idDocGestorDoc;
    return fichero;
};

// -------------- FILTROS -----------------
export const filtroPorCodigoAgrupacionDocPrecontractualEntregada = (documentacion) => {
    return (
        !!documentacion.codEcvAgrupDocumento && (documentacion.codEcvAgrupDocumento === 'C' || documentacion.codEcvAgrupDocumento === 'F')
    );
};

export const filtroPorCodigoAgrupacion = (documentacion) => {
    return !!documentacion.codEcvAgrupDocumento && documentacion.codEcvAgrupDocumento === 'C';
};

export const filtroEstadoPorAccionPrincipal = (documento, estadoFiltro) => {
    let cumpleFiltro = false;
    if (documento.acciones && documento.acciones.length > 0) {
        cumpleFiltro = documento.acciones[0] === estadoFiltro;
    }
    return cumpleFiltro;
};

export const documentoEnEstadoRechazado = (documento) => {
    return documento.estado === 'NV' || documento.estado === 'DA';
};

export const filtroAportar = (documentacion, filtrarPorCodigoAgrupacion) => {
    const esAccionPrincipalAD = filtroEstadoPorAccionPrincipal(documentacion, 'AD');
    const esAccionPrincipalDP = filtroEstadoPorAccionPrincipal(documentacion, 'DP');
    const documentoRechazado = documentoEnEstadoRechazado(documentacion);
    let documentoCumpleFiltroAportar =
        (esAccionPrincipalAD || esAccionPrincipalDP) && !documentoRechazado && !documentacion.indRequiereFirma;
    if (filtrarPorCodigoAgrupacion) {
        documentoCumpleFiltroAportar = documentoCumpleFiltroAportar && filtroPorCodigoAgrupacion(documentacion);
    }
    return documentoCumpleFiltroAportar;
};

export const ampliarDocumento = (_documento) => {
    const documento = { ..._documento };
    documento.name = documento.nombre;
    documento.id = 'file';
    documento.title = documento.nombre;
    documento.target = '_blank';
    documento.isSuccess = false;
    documento.contentType = filtroAportar(documento) ? ' ' : 'pdf';
    documento.idDocGestorDoc = documento.idDocGestorDoc === '' ? ' ' : documento.idDocGestorDoc;
    documento.structFirmaElectronica = {
        actionsSignature: 'firmar',
        requiereFirmasAdicionales: false,
        firmaElectronica: '',
    };

    if (documento.indicadorMultiArchivo === 'S' && documento.ficheros) {
        documento.ficheros = documento.ficheros.map((fichero) => ampliarFichero(fichero));
    }
    return documento;
};

export const filtroDescargar = (documentacion) => {
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        (filtroEstadoPorAccionPrincipal(documentacion, 'VI') ||
            filtroEstadoPorAccionPrincipal(documentacion, 'EN') ||
            filtroEstadoPorAccionPrincipal(documentacion, 'DE'))
    );
};

export const filtroFirmar = (documentacion) => {
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        filtroEstadoPorAccionPrincipal(documentacion, 'FD') &&
        (typeof documentacion.codNaturaleza === 'undefined' ||
            (typeof documentacion.codNaturaleza !== 'undefined' && documentacion.codNaturaleza.trim() !== '01'))
    );
};

export const filtroRevisar = (documentacion) => {
    const esAccionPrincipalAD = filtroEstadoPorAccionPrincipal(documentacion, 'AD');
    const documentoRechazado = documentoEnEstadoRechazado(documentacion);
    return filtroPorCodigoAgrupacion(documentacion) && esAccionPrincipalAD && documentoRechazado;
};

export const filtroAportarBloqueFirma = (documentacion) => {
    const esAccionPrincipalAD = filtroEstadoPorAccionPrincipal(documentacion, 'AD');
    const esAccionPrincipalDP = filtroEstadoPorAccionPrincipal(documentacion, 'DP');
    const documentoRechazado = documentoEnEstadoRechazado(documentacion);
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        (esAccionPrincipalAD || esAccionPrincipalDP) &&
        !documentoRechazado &&
        documentacion.indRequiereFirma
    );
};

export const filtroDocNaturalezaPrecontractualEntregada = (documento) => {
    return (
        filtroPorCodigoAgrupacionDocPrecontractualEntregada(documento) &&
        typeof documento.codNaturaleza !== 'undefined' &&
        documento.codNaturaleza === '01' &&
        !filtroEstadoPorAccionPrincipal(documento, 'FD')
    );
};

export const filtroDocNaturalezaPrecontractual = (documento) => {
    return (
        filtroPorCodigoAgrupacion(documento) &&
        filtroEstadoPorAccionPrincipal(documento, 'FD') &&
        typeof documento.codNaturaleza !== 'undefined' &&
        documento.codNaturaleza === '01'
    );
};

export const filtroAportarDocPrecontractual = (documentacion) => {
    const esAccionPrincipalAD = filtroEstadoPorAccionPrincipal(documentacion, 'AD');
    const esAccionPrincipalDP = filtroEstadoPorAccionPrincipal(documentacion, 'DP');
    const documentoRechazado = documentoEnEstadoRechazado(documentacion);
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        (esAccionPrincipalAD || esAccionPrincipalDP) &&
        !documentoRechazado &&
        !documentacion.indRequiereFirma &&
        typeof documentacion.codOrdenDocumento !== 'undefined' &&
        documentacion.codOrdenDocumento === '01' &&
        (typeof documentacion.codNaturaleza === 'undefined' ||
            (typeof documentacion.codNaturaleza !== 'undefined' && documentacion.codNaturaleza.trim() === ''))
    );
};

export const filtroAportarDocContractualPostContractual = (documentacion) => {
    const esAccionPrincipalAD = filtroEstadoPorAccionPrincipal(documentacion, 'AD');
    const esAccionPrincipalDP = filtroEstadoPorAccionPrincipal(documentacion, 'DP');
    const documentoRechazado = documentoEnEstadoRechazado(documentacion);
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        (esAccionPrincipalAD || esAccionPrincipalDP) &&
        !documentoRechazado &&
        !documentacion.indRequiereFirma &&
        ((typeof documentacion.codOrdenDocumento !== 'undefined' && documentacion.codOrdenDocumento !== '01') ||
            (typeof documentacion.codNaturaleza !== 'undefined' &&
                documentacion.codNaturaleza.trim() !== '' &&
                documentacion.codNaturaleza !== '01'))
    );
};

export const filtroDescargarDocPrecontractual = (documentacion) => {
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        (filtroEstadoPorAccionPrincipal(documentacion, 'VI') ||
            filtroEstadoPorAccionPrincipal(documentacion, 'EN') ||
            filtroEstadoPorAccionPrincipal(documentacion, 'DE')) &&
        typeof documentacion.codOrdenDocumento !== 'undefined' &&
        documentacion.codOrdenDocumento === '01' &&
        (typeof documentacion.codNaturaleza === 'undefined' ||
            (typeof documentacion.codNaturaleza !== 'undefined' && documentacion.codNaturaleza.trim() === ''))
    );
};

export const filtroDescargarDocContractualPostContractual = (documentacion) => {
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        (filtroEstadoPorAccionPrincipal(documentacion, 'VI') ||
            filtroEstadoPorAccionPrincipal(documentacion, 'EN') ||
            filtroEstadoPorAccionPrincipal(documentacion, 'DE')) &&
        ((typeof documentacion.codOrdenDocumento !== 'undefined' && documentacion.codOrdenDocumento !== '01') ||
            (typeof documentacion.codNaturaleza !== 'undefined' &&
                documentacion.codNaturaleza.trim() !== '' &&
                documentacion.codNaturaleza !== '01'))
    );
};

export const filtroFirmaUnicaDocPrecontractual = (documentacion) => {
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        filtroEstadoPorAccionPrincipal(documentacion, 'FD') &&
        typeof documentacion.codOrdenDocumento !== 'undefined' &&
        documentacion.codOrdenDocumento === '01' &&
        (typeof documentacion.codNaturaleza === 'undefined' ||
            (typeof documentacion.codNaturaleza !== 'undefined' && documentacion.codNaturaleza.trim() === ''))
    );
};

export const filtroFirmaUnicaDocContractualPostContractual = (documentacion) => {
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        filtroEstadoPorAccionPrincipal(documentacion, 'FD') &&
        ((typeof documentacion.codOrdenDocumento !== 'undefined' && documentacion.codOrdenDocumento !== '01') ||
            (typeof documentacion.codNaturaleza !== 'undefined' &&
                documentacion.codNaturaleza.trim() !== '' &&
                documentacion.codNaturaleza !== '01'))
    );
};

export const filtroAportarBloqueFirmaDocPrecontractual = (documentacion) => {
    const esAccionPrincipalAD = filtroEstadoPorAccionPrincipal(documentacion, 'AD');
    const esAccionPrincipalDP = filtroEstadoPorAccionPrincipal(documentacion, 'DP');
    const documentoRechazado = documentoEnEstadoRechazado(documentacion);
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        (esAccionPrincipalAD || esAccionPrincipalDP) &&
        !documentoRechazado &&
        documentacion.indRequiereFirma &&
        typeof documentacion.codOrdenDocumento !== 'undefined' &&
        documentacion.codOrdenDocumento === '01' &&
        (typeof documentacion.codNaturaleza === 'undefined' ||
            (typeof documentacion.codNaturaleza !== 'undefined' && documentacion.codNaturaleza.trim() === ''))
    );
};

export const filtroAportarBloqueFirmaDocContractualPostContractual = (documentacion) => {
    const esAccionPrincipalAD = filtroEstadoPorAccionPrincipal(documentacion, 'AD');
    const esAccionPrincipalDP = filtroEstadoPorAccionPrincipal(documentacion, 'DP');
    const documentoRechazado = documentoEnEstadoRechazado(documentacion);
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        (esAccionPrincipalAD || esAccionPrincipalDP) &&
        !documentoRechazado &&
        documentacion.indRequiereFirma &&
        ((typeof documentacion.codOrdenDocumento !== 'undefined' && documentacion.codOrdenDocumento !== '01') ||
            (typeof documentacion.codNaturaleza !== 'undefined' &&
                documentacion.codNaturaleza.trim() !== '' &&
                documentacion.codNaturaleza !== '01'))
    );
};

export const filtroRevisarDocContractualPostContractual = (documentacion) => {
    const esAccionPrincipalAD = filtroEstadoPorAccionPrincipal(documentacion, 'AD');
    const documentoRechazado = documentoEnEstadoRechazado(documentacion);
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        esAccionPrincipalAD &&
        documentoRechazado &&
        ((typeof documentacion.codOrdenDocumento !== 'undefined' && documentacion.codOrdenDocumento !== '01') ||
            (typeof documentacion.codNaturaleza !== 'undefined' &&
                documentacion.codNaturaleza.trim() !== '' &&
                documentacion.codNaturaleza !== '01'))
    );
};

export const filtroRevisarDocPrecontractual = (documentacion) => {
    const esAccionPrincipalAD = filtroEstadoPorAccionPrincipal(documentacion, 'AD');
    const documentoRechazado = documentoEnEstadoRechazado(documentacion);
    return (
        filtroPorCodigoAgrupacion(documentacion) &&
        esAccionPrincipalAD &&
        documentoRechazado &&
        typeof documentacion.codOrdenDocumento !== 'undefined' &&
        documentacion.codOrdenDocumento === '01' &&
        (typeof documentacion.codNaturaleza === 'undefined' ||
            (typeof documentacion.codNaturaleza !== 'undefined' && documentacion.codNaturaleza.trim() === ''))
    );
};
