import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Grid, Text, Modal } from '@bdt/components/dist';

import ROUTES from '@routes/routes';
import { goTo as gotToAction } from '@actions/router';
import FirmaUnica from '@components/Firma/FirmaUnica/Firma';
import InputFile from '@components/InputFile/InputFile';
import {
    goToCompletarDocumentacion as goToCompletarDocumentacionAction,
    goToContratacionFinalizada as goToContratacionFinalizadaAction,
    goToMifid as goToMifidAction,
} from './Demo.actions';

function Demo({ goTo, goToCompletarDocumentacion, goToContratacionFinalizada, goToMifid }) {
    const info = {
        error: 'MENSAJE DE ERROR ESPECÍFICO',
        desdeUrl: true,
    };
    const info2 = {
        codigoError: 'TAREA_NO_DISPONIBLE',
        desdeUrl: true,
    };
    const info3 = {
        error: 'MENSAJE DE ERROR ESPECÍFICO',
        desdeUrl: false,
    };
    // Para prueba oficina
    const model = {
        proceso: {
            nombreProducto: 'Bankia Gestión indexada online',
            contrato: '038600000000000734',
        },
    };

    const procesoFinalizacion = {
        idInstanciaProceso: 'PH000001200400297097',
        contrato: '20381731056000568535',
        documentacionCompleta: true,
        intervinientes: [],
        tareas: [
            {
                codigoFase: '',
                codigoTarea: 'SolicitarConfirmacionDeDatos',
                subTipo: 'OT',
                fechaVencimiento: '2020-10-02',
                idSubproceso: 'PH000001200400297097US000010',
            },
        ],
        titular: 'Menganito Pérez López',
        nombreProducto: 'CUENTA DOG FRIENDLY',
        fechaVencimiento: '2020-10-02',
        importeOperacion: '',
        procedenciaProceso: 'S',
        esTarjeta: false,
        indicadorExistenciaExpedienteDocumental: false,
        indicadorFinalizarProcesoSolicitud: false,
        indicadorTarjetaConPin: false,
        descripcion: 'Apertura de Captación',
        codigoProceso: 'PH000001',
        pdteSoloDocOpcional: false,
        tienePostAccionesPendientes: false,
        fondoValidarPostAccionesPdtes: false,
        identificadorProducto: '11663',
        porContratacion: false,
        verEstado: true,
        documentacionPendiente: {
            smsDocumentacion: 'DOC_PROCESOS_OFF',
            intervinientes: ['Maria Julia Alvaro Piqueras de todos los santos', 'Alvaro Piqueras Pérez'],
        },
        esProcesoVariasTareasDocumentacion: false,
        esProcesoConSBPFinalizacionEspecifico: false,
    };
    const procesoMifid = {
        nombreProducto: 'Comunicación Solicitada',
        nombreDocumento: 'Aragon.png',
        idInstanciaProceso: 'AQT00002201',
    };
    const handleOnChange = (e) => {
        console.log('LOL');
        console.log(e);
    };
    const procesoTarjetas = {
        idInstanciaProceso: 'PP000004201000622190',
        procedenciaProceso: 'S',
        esTarjeta: true,
        tareas: [
            {
                codigoFase: '',
                codigoTarea: 'GestionarDocumentacionTarjeta',
                fechaVencimiento: '2020-12-16',
                idSubproceso: 'PP000004201000622190US000001',
                subTipo: 'OT',
            },
        ],
        desdeUrl: true,
        identificadorTarjetaPropuesta: 'PP000004201000622190',
        indicadorTarjetaConPin: true,
        numeroTarjeta: '4857200011397439',
        codigoAccionGestionarSolicitudTarjeta: 'CS',
        indicadorExistenciaExpedienteDocumental: true,
        datosAbrirExpedienteDocumental: {
            agrupadorExpediente: ' ',
            codProceso: ' ',
            codPiloto: ' ',
            intervinientes: [
                {
                    codExpedienteInterviniente: '',
                    parametrosInterviniente: [
                        {
                            idParametroInterviniente: '',
                            valorParametroInterviniente: '',
                        },
                    ],
                    codTipoIntervencionInterviniente: '',
                    codTipoPersona: '',
                    indIntervinientePrincipal: false,
                },
            ],
            parametrosNegocios: [
                {
                    idParametroNegocio: '',
                    valorParametroNegocio: '',
                    nomParametroNegocio: '',
                },
            ],
            idInstanciaProceso: ' ',
            idContrato: ' ',
            codFamilia: ' ',
            codSubFamilia: ' ',
            codProducto: ' ',
        },
        porContratacion: true,
        documentacionPendiente: {
            smsDocumentacion: 'DOC_POSTACCIONES_BGE',
        },
        nombreProducto: 'DEBITO BANKIA SIN CONTACTOS 2.1 CONTACTLESS',
        intervinientes: [
            {
                codExpedienteInterviniente: '',
                parametrosInterviniente: [
                    {
                        idParametroInterviniente: '',
                        valorParametroInterviniente: '',
                    },
                ],
                codTipoIntervencionInterviniente: '',
                codTipoPersona: '',
                indIntervinientePrincipal: false,
            },
        ],
        codigoProceso: 'PP000004',
        esProcesoVariasTareasDocumentacion: false,
        esProcesoConSBPFinalizacionEspecifico: true,
        finalizar: true,
    };

    const [modalOpened, setModalOpened] = useState(false);

    return (
        <Grid container>
            <Button type="button" onClick={() => setModalOpened(true)}>
                Abrir Modal
            </Button>
            <Modal open={modalOpened} onClose={() => setModalOpened(false)}>
                <div style={{ width: '750px', height: '450px' }}>
                    <p>Modal de ejemplo.</p>
                    <p>Pulsa en la cruz de arriba a la derecha o en el botón de mas abajo para cerrar el modal</p>
                    <Button type="button" onClick={() => setModalOpened(false)}>
                        Cerrar Modal
                    </Button>
                </div>
            </Modal>
            <InputFile name="Adjuntar" id="adjuntar" onChange={handleOnChange} validMimeTypes={['.pdf', '.doc', '.docx']} />
            <Grid item>
                <Button type="button" onClick={() => goTo(ROUTES.HOME)}>
                    Ir a home
                </Button>
            </Grid>
            <Grid item>
                <Button type="button" onClick={() => goToCompletarDocumentacion('procesoTarjeta')}>
                    Completar Documentacion Proceso Tarjeta
                </Button>
            </Grid>
            <Grid item>
                <Button type="button" onClick={() => goToCompletarDocumentacion('procesoCuenta')}>
                    Completar Documentacion Proceso Cuenta
                </Button>
            </Grid>
            <Grid item>
                <Button type="button" onClick={() => goToCompletarDocumentacion('procesoCuentaDog')}>
                    Completar Documentacion Proceso Cuenta Dog
                </Button>
            </Grid>
            <Grid item>
                <Button type="button" onClick={() => goToCompletarDocumentacion('procesoHipotecaAdjuntar')}>
                    proceso Hipoteca Adjuntar
                </Button>
            </Grid>
            <div style={{ marginTop: '10px' }}>
                <Text value="Error lanzado sin parámetros" size="md" />
                <Grid item>
                    <Button type="button" onClick={() => goTo(ROUTES.ERROR)}>
                        Error sin parametros
                    </Button>
                </Grid>
                <Text value="Error parametros: error: mensaje de error, desdeUrl: true" size="md" />
                <Grid item>
                    <Button type="button" onClick={() => goTo(ROUTES.ERROR, { info })}>
                        Error pasando mensaje de error
                    </Button>
                </Grid>
                <Text value="Error parametros: codigoError: TAREA_NO_DISPONIBLE, desdeUrl: true" size="md" />
                <Grid item>
                    <Button type="button" onClick={() => goTo(ROUTES.ERROR, { info: info2 })}>
                        Error por codigo de Error TAREA_NO_DISPONIBLE
                    </Button>
                </Grid>
                <Text value="Error parametros: error: mensaje de error, desdeUrl: false" size="md" />
                <Grid item>
                    <Button type="button" onClick={() => goTo(ROUTES.ERROR, { info: info3 })}>
                        Error desdeUrl false
                    </Button>
                </Grid>
                <Text value="Error parametros: error: mensaje de error, desdeUrl: false sin info" size="md" />
                <Grid item>
                    <Button
                        type="button"
                        onClick={() =>
                            goTo(ROUTES.ERROR, {
                                error: 'MENSAJE DE ERROR ESPECÍFICO',
                                desdeUrl: false,
                            })
                        }
                    >
                        Error sin pasar objeto info
                    </Button>
                </Grid>
            </div>
            <Grid item>
                <Button type="button" onClick={() => goTo(ROUTES.OFICINA, { proceso: model })}>
                    Oficina
                </Button>
            </Grid>
            <Grid item>
                <Button type="button" onClick={() => goTo(ROUTES.OFICINA)}>
                    Oficina sin params
                </Button>
            </Grid>

            <Grid item>
                <Button type="button" onClick={() => goToMifid(procesoMifid)}>
                    MIFID
                </Button>
            </Grid>
            <Grid item>
                <Button type="button" onClick={() => goTo(ROUTES.MIFID)}>
                    MIFID sin params
                </Button>
            </Grid>
            <Grid item>
                <div style={{ maxWidth: '783px' }}>
                    <FirmaUnica orderId="KIOI-1604055803320" onSign={() => window.alert('Firma correcta')} />
                </div>
            </Grid>
            <Grid item>
                <Button type="button" onClick={() => goToContratacionFinalizada(procesoFinalizacion)}>
                    Contratación Finalizada
                </Button>
            </Grid>
            <Grid item>
                <Button type="button" onClick={() => goTo(ROUTES.TARJETAS, procesoTarjetas)}>
                    Tarjetas
                </Button>
            </Grid>
        </Grid>
    );
}

export default connect(
    (store) => ({
        listaDivisas: store.currencies.data,
    }),
    (dispatch) => ({
        goToCompletarDocumentacion: (proceso) => dispatch(goToCompletarDocumentacionAction(proceso)),
        goToContratacionFinalizada: (proceso) => dispatch(goToContratacionFinalizadaAction(proceso)),
        goToMifid: (proceso) => dispatch(goToMifidAction(proceso)),
        goTo: (where, state) => dispatch(gotToAction(where, state)),
    }),
)(Demo);

Demo.propTypes = {
    goTo: PropTypes.func.isRequired,
    goToCompletarDocumentacion: PropTypes.func.isRequired,
    goToContratacionFinalizada: PropTypes.func.isRequired,
};
