import {    getOrdenesPendientes as getOrdenesPendientesApi, 
            getDetalleOrendesPendientes as getDetalleOrendesPendientesApi } from '@services/api';
import { emitEvent as goToCommunication, EVENTS } from '@services/communication';

const buildDetalleModel = orden => {
    let tipoOrden = null;

    if(orden?.referencia) {
        tipoOrden = orden.referencia.tipoOrden;
    }else if(orden?.tipoOrden){
        tipoOrden = orden.tipoOrden;
    }else if(orden?.referenciaTransferencia){
        tipoOrden = orden.referenciaTransferencia.tipoOperacion;
    }
    // const referencia = {
    //     referenciaOrden: orden.referencia ? orden.referencia.referenciaOrden : orden.identificadorOrden,
        // tipoOrden: orden.referencia ? 
        //     orden.referencia.tipoOrden 
        //     : (orden.tipoOrden ? 
        //         orden.tipoOrden 
        //         : (orden.referenciaTransferencia ? 
        //             orden.referenciaTransferencia.tipoOperacion 
        //             : void 0))
    // }
    const referencia = {
        referenciaOrden: orden.referencia ? orden.referencia.referenciaOrden : orden.identificadorOrden,
        tipoOrden
    }
    return referencia;
}

const formatOrdenTransferenciaDia = orden => {
    const days = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];

    return {
        identificadorOperacion: orden.referenciaTransferencia.identificadorOperacion,
        fecha: {
            anyo: new Date(orden.fechaEmision.valor).getFullYear(),
            mes: new Date(orden.fechaEmision.valor).getMonth(),
            dia: new Date(orden.fechaEmision.valor).getDate(),
            diaSemana: days[new Date(orden.fechaEmision.valor).getDay()]
        },
        importe: orden.importeOperacion,
        desplegada: false,
        detalle: {
            cargado: false,
            fechaOrden: new Date()
        },
        referenciaTransferencia: orden.referenciaTransferencia,
        procedenciaTransferencia: orden.procedenciaTransferencia,
        subTipoProcedenciaTransferencia: orden.subTipoProcedenciaTransferencia,
        tipoTransferencia: 'emitidaHoy',
        objDate: new Date(orden.fechaEmision.valor),
        masDatos: { detalleOperacionHistorico: orden.detalleOrden },
        operacion: 'Anular',
        // descripcionTransferencia: $filter('formatDescriptionTransf')(orden.referenciaTransferencia.tipoOperacion)
        /** @todo no tenemos claro de donde sale el tipoOperacion, creemos que no viene en nuestra operativa */
        descripcionTransferencia: orden.referenciaTransferencia.tipoOperacion
    }
}

const ultimosCuatroCaracteres = (input)=>{
    return input.substring(input.length-4);
}

const formatOrdenTransferencia = orden => {
    const days = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
    if(orden.formatoOrden === 'PENDIENTE'){
        return (
            {
                identificadorOrden: orden.referencia.referenciaOrden,
                fecha: orden.fecha.valor,
                descripcion: orden.descripcion,
                importe: orden.importe,
                objDate: new Date(orden.fecha.valor),
                detalle: {
                    fechaOrden: orden.fecha.valor,
                    datosGenerales: orden.detalleOrden.transferencia.datosGenerales,
                    comisiones: orden.detalleOrden.transferencia.comisiones,
                    cuentaCargo: orden.detalleOrden.transferencia.ordenante.cuentaCargo.pais 
                                    + orden.detalleOrden.transferencia.ordenante.cuentaCargo.digitosDeControl 
                                    + orden.detalleOrden.transferencia.ordenante.cuentaCargo.identificador,
                    cuentaAbono: `${orden.detalleOrden.transferencia.beneficiario.nombreBanco 
                                     } * ${ 
                                     ultimosCuatroCaracteres(orden.detalleOrden.transferencia.beneficiario.cuentaAbono)}`,
                    beneficiario: orden.detalleOrden.transferencia.beneficiario,
                    concepto: orden.detalleOrden.transferencia.datosGenerales.concepto
                },
                estado: {
                    pendienteFirma: orden.indicadorPendienteFirma,
                    pendienteFirmaMovil: orden.indicadorPendienteFirmaMovil,
                    numeroFirmasPendientes: orden.numeroFirmasPendientes
                },
                referencia: orden.referencia,
                tipoTransferencia: 'pendiente',
                identificadorCuentaCargo: orden.identificadorCuentaCargo,
                descripcionTransferencia: orden.descripcion,
                fechaEmision: {
                    date: new Date(orden.fecha.valor)
                },
                operacion: orden.operacion === 'FIRMAR' ? 'Firmar' : 'Anular',
                avisoConfirmacion: orden.detalleOrden.aviso
            });
    }
    return ({
        identificadorOperacion: orden.identificadorOrden,
        fecha: {
            anyo: new Date(orden.fechaAltaOrden.valor).getFullYear(),
            mes: new Date(orden.fechaAltaOrden.valor).getMonth(),
            dia: new Date(orden.fechaAltaOrden.valor).getDate(),
            diaSemana: days[new Date(orden.fechaAltaOrden.valor).getDay()]
        },
        importe: orden.importeOrden,
        detalle: {
            fechaOrden: new Date(orden.fechaAltaOrden.valor)
        },
        referenciaTransferencia: {
            identificadorOperacion: orden.identificadorOrden,
            tipoOperacion: orden.tipoOrden
        },
        tipoTransferencia: 'emitidaHoy',
        objDate: new Date(orden.fechaAltaOrden.valor),
        descripcionTransferencia: orden.descripcionTipoOrden,
        operacion: orden.operacion === 'FIRMAR' ? 'Firmar' : 'Anular',
        masDatos: {
            detalleOrden: {
                referencia: {
                    referenciaOrden: orden.identificadorOrden,
                    tipoOrden: orden.tipoOrden
                },
                transferencia: orden.detalleOrden.transferencia,
                transferenciaPeriodica: orden.detalleOrden.transferenciaPeriodica,
                aviso: orden.detalleOrden.aviso,
                favorito: orden.detalleOrden.favorito,
                firmantes: orden.detalleOrden.firmantes
            }
        }
    });
    
}

const redirigirAvisosOp = (warning) => {
    console.log(warning);

    return getOrdenesPendientesApi({tiposOrden:[warning.aviso.referencia.tipoOrden]}).then((response) => {
        console.log(response.response);

        /** @desc esto equivale a orden = data[0] */
        const orden = response.response.ordenesPendientes.find( order => {
            const refOrdenFromParams = Number(warning.aviso.referencia.referenciaOrden);
            const refOrdenFromData = Number(order.referencia.referenciaOrden);
            // if (refOrdenFromData === refOrdenFromParams)
            // return order;
            return refOrdenFromData === refOrdenFromParams;
        });

        // const orden = response.response.ordenesPendientes[0];

        // const referencia = buildDetalleModel(orden);
        const model = { referencia: buildDetalleModel(orden) }; 

        getDetalleOrendesPendientesApi(model).then( res =>{
            const detalleOrden = res.response;
            console.log("Detalle Orden -->",detalleOrden);

            if(detalleOrden.detalleOrden){
                orden.detalleOrden = detalleOrden.detalleOrden;
            }else if(detalleOrden.detalleOperacionHistorico){
                orden.detalleOrden = detalleOrden.detalleOperacionHistorico;
            }else{
                orden.detalleOrden = detalleOrden;
            }

            // orden.detalleOrden = detalleOrden.detalleOrden ? 
            //     detalleOrden.detalleOrden 
            //     : (detalleOrden.detalleOperacionHistorico ? 
            //         detalleOrden.detalleOperacionHistorico 
            //         : detalleOrden);

            orden.operacion = 'FIRMAR';
            orden.formatoOrden = 'PENDIENTE';

            let ordenFormateada;

            /** @todo necesitamos saber si tenemos datos de uso con {orden.referenciaTransferencia.tipoOperacion}, 
             * creemos que esta lógica no es necesaria en nuestra operativa de tipoOperacion 
             *         case 'T0':
             *         case 'T1':
             *         case 'T2':
             *         case 'T3':
             *         case 'T4':
             *         case 'T5':
             *         case 'T6':
             *         case 'T7':
             */
            if(orden.referenciaTransferencia && orden.referenciaTransferencia.tipoOperacion){
                ordenFormateada = formatOrdenTransferenciaDia(orden)
            }else{
                ordenFormateada = formatOrdenTransferencia(orden)
            }
            
            goToCommunication(EVENTS.NAVEGACION, {state: 'oip-cuentas-transferencias-firma', params:{ transferencia: ordenFormateada }});

        }).catch( error => {
            console.trace(error);
        });
    }).catch( error => {
        console.trace(error);
    });
};

export default redirigirAvisosOp;
