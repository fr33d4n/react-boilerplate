import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Grid, Text } from '@bdt/components/dist';
import { useTranslate } from '@services/i18n';
import Tooltip from '@components/Tooltip/Tooltip';
import { formatImporteMonetario } from '@services/formatters';
import {
    StyledLeftIcon,
    StyledPaper,
    StyledRightIcon,
    StyledCardTitle,
    StyledUppercaseText,
    StyledTooltipContainer,
    StyledWarning,
    StyledInterviniente,
} from './HomeCard.styles';
import { verDocumentacion as verDocumentacionAction } from '../Home.actions';
import capitalizeFirstLetter from '../services/capitalizeFirstLetter';

function IntervinientesCard({ process, verDocumentacion, listaDivisas }) {
    const [translate] = useTranslate('home');
    const { importe, moneda } = formatImporteMonetario(process.importeOperacion, listaDivisas);
    const withIntervinientes = process.intervinientes.length > 0;
    const isSeguro = process.idInstanciaProceso.substring(0, 2) === 'SU';
    return (
        <StyledPaper type="info" elevation>
            <Grid container height="100%">
                <Grid container item>
                    <Grid container item justifyContent="space-between">
                        <StyledWarning item width="unset">
                            <StyledLeftIcon type={withIntervinientes ? 'user' : 'eye'} size="md" />
                            <StyledUppercaseText
                                value={withIntervinientes ? translate('pendienteTitulares') : translate('docRevision')}
                                size="xs"
                                bold
                            />
                        </StyledWarning>
                        {withIntervinientes && (
                            <StyledTooltipContainer>
                                <Tooltip
                                    tooltipData={process.intervinientes.map((i) => (
                                        <StyledInterviniente>{i}</StyledInterviniente>
                                    ))}
                                    info
                                    side="left"
                                >
                                    <StyledRightIcon type="alert" size="md" color="info" />
                                </Tooltip>
                            </StyledTooltipContainer>
                        )}
                    </Grid>
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
                    <Button onClick={() => verDocumentacion(process)} adaptWidth variant="outlined" type="button">
                        {translate('verDocs')}
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
        verDocumentacion: (process) => dispatch(verDocumentacionAction(process)),
    }),
)(IntervinientesCard);

IntervinientesCard.propTypes = {
    verDocumentacion: PropTypes.func.isRequired,
    process: PropTypes.shape({
        nombreProducto: PropTypes.string.isRequired,
        descripcion: PropTypes.string,
        documentacionCompleta: PropTypes.bool.isRequired,
        importeOperacion: PropTypes.string.isRequired,
        contrato: PropTypes.string.isRequired,
        intervinientes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
        idInstanciaProceso: PropTypes.string.isRequired,
        mostrarContrato: PropTypes.bool.isRequired,
    }).isRequired,
    listaDivisas: PropTypes.arrayOf(PropTypes.shape).isRequired,
};
