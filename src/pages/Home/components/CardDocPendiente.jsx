import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Grid, Text } from '@bdt/components/dist';
import { useTranslate } from '@services/i18n';
import Tooltip from '@components/Tooltip/Tooltip';
import { formatImporteMonetario } from '@services/formatters';
import { StyledLeftIcon, StyledPaper, StyledUppercaseText, StyledWarning, StyledCardTitle } from './HomeCard.styles';
import { completarDocumentacion as completarDocumentacionAction } from '../Home.actions';
import capitalizeFirstLetter from '../services/capitalizeFirstLetter';

function DocPendienteCard({ process, completarDocumentacion, listaDivisas }) {
    const [translate] = useTranslate('home');
    const { importe, moneda } = formatImporteMonetario(process.importeOperacion, listaDivisas);
    const isSeguro = process.idInstanciaProceso.substring(0, 2) === 'SU';

    return (
        <StyledPaper type="normal" elevation>
            <Grid container height="100%">
                <Grid container item>
                    <StyledWarning item>
                        <Grid item width="30px">
                            <StyledLeftIcon type="alert" size="md" color="warning" />
                        </Grid>
                        <Grid fluidItem>
                            <StyledUppercaseText
                                value={process.procedenciaProceso === 'T' ? translate('tareas') : process.descripcionTareaEnCurso}
                                size="xs"
                                bold
                            />
                        </Grid>
                    </StyledWarning>
                    {process.nombreProducto.length > 24 ? (
                        <Tooltip tooltipData={process.nombreProducto}>
                            <Grid item>
                                <StyledCardTitle value={capitalizeFirstLetter(process.nombreProducto)} size="xl" bold />
                            </Grid>
                        </Tooltip>
                    ) : (
                        <Grid item>
                            <StyledCardTitle value={capitalizeFirstLetter(process.nombreProducto)} size="xl" bold />
                        </Grid>
                    )}
                    {process.mostrarContrato && isSeguro && (
                        <Grid item>
                            <Text value={`${translate('numeroContrato')} ${process.contrato}`} size="xs" />
                        </Grid>
                    )}
                    {process.importeOperacion && (
                        <Grid item>
                            <Text size="lg" value={`${importe} ${moneda}`} />
                        </Grid>
                    )}
                </Grid>
                <Grid item justifyContent="center" alignItems="flex-end">
                    <Button onClick={() => completarDocumentacion(process)} adaptWidth variant="solid" type="button">
                        {translate('continuar')}
                    </Button>
                </Grid>
            </Grid>
        </StyledPaper>
    );
}

export default connect(
    (store) => ({
        listaDivisas: store.currencies.data,
    }),
    (dispatch) => ({
        completarDocumentacion: (process) => dispatch(completarDocumentacionAction(process)),
    }),
)(DocPendienteCard);

DocPendienteCard.propTypes = {
    process: PropTypes.shape({
        nombreProducto: PropTypes.string.isRequired,
        descripcion: PropTypes.string,
        documentacionCompleta: PropTypes.bool.isRequired,
        importeOperacion: PropTypes.string.isRequired,
        contrato: PropTypes.string.isRequired,
        descripcionTareaEnCurso: PropTypes.string,
        procedenciaProceso: PropTypes.string.isRequired,
        idInstanciaProceso: PropTypes.string.isRequired,
        mostrarContrato: PropTypes.bool.isRequired,
    }).isRequired,
    completarDocumentacion: PropTypes.func.isRequired,
    listaDivisas: PropTypes.arrayOf(PropTypes.shape).isRequired,
};
