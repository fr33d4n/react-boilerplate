import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Grid, Text } from '@bdt/components/dist';
import { useTranslate } from '@services/i18n';
import Tooltip from '@components/Tooltip/Tooltip';
import { formatImporteMonetario } from '@services/formatters';
import ROUTES from '@routes/routes';
import { goTo as goToAction } from '@actions/router';
import { StyledLeftIcon, StyledPaper, StyledUppercaseText, StyledWarning, StyledCardTitle } from './HomeCard.styles';
import { redirigirAvisosOpService as redirigirAvisosOpServiceAction } from '../Home.actions';
// import redirigirAvisos from '../services/redirigirAvisos';
function AvisosOpCard({ warning, goTo, listaDivisas }) {
    const [translate] = useTranslate('home');
    const { importe, moneda } = formatImporteMonetario(warning.importeOperacion, listaDivisas);
    const { aviso } = warning;
    return (
        <StyledPaper type="normal" elevation>
            <Grid container height="100%">
                <Grid container item>
                    <StyledWarning item>
                        <Grid width="30px">
                            <StyledLeftIcon type="alert" size="md" color="warning" />
                        </Grid>
                        <Grid fluidItem>
                            <StyledUppercaseText value={translate('firmaPendiente')} size="xs" bold />
                        </Grid>
                    </StyledWarning>
                    {aviso.nombre.length > 24 ? (
                        <Tooltip tooltipData={aviso.nombre}>
                            <Grid item>
                                <StyledCardTitle value={aviso.nombre} size="xl" bold />
                            </Grid>
                        </Tooltip>
                    ) : (
                        <Grid item>
                            <StyledCardTitle value={aviso.nombre} size="xl" bold />
                        </Grid>
                    )}
                    {warning.importeOperacion && (
                        <Grid item>
                            <Text size="lg" value={`${importe} ${moneda}`} />
                        </Grid>
                    )}
                    {aviso.descripcion && (
                        <Grid item>
                            <Text size="sm" value={aviso.descripcion} />
                        </Grid>
                    )}
                </Grid>
                <Grid item justifyContent="center" alignItems="flex-end">
                    <Button onClick={() => goTo(warning)} adaptWidth variant="solid" type="button">
                        {translate('firmar')}
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
        goTo: (warning) => redirigirAvisosOpServiceAction(warning),
    }),
)(AvisosOpCard);

AvisosOpCard.propTypes = {
    goTo: PropTypes.func.isRequired,
    warning: PropTypes.shape({
        aviso: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
            descripcion: PropTypes.string,
            codigo: PropTypes.string.isRequired,
            importancia: PropTypes.bool.isRequired,
        }),
        importeOperacion: PropTypes.shape({}),
    }).isRequired,
    listaDivisas: PropTypes.arrayOf(PropTypes.shape).isRequired,
};
