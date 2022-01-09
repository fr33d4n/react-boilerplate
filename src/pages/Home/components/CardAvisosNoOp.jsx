import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Grid, Modal } from '@bdt/components/dist';
import { useTranslate } from '@services/i18n';
import Tooltip from '@components/Tooltip/Tooltip';
import { StyledLeftIcon, StyledPaper, StyledUppercaseText, StyledWarning, StyledCardTitle, StyledDescription } from './HomeCard.styles';
import redirigirAvisosNoOp from '../services/redirigirAvisosNoOp';
import DniCaducado from './DniCaducado';
import { eliminarAviso as eliminarAvisoAction } from '../Home.actions';

function AvisosNoOpCard({ warning, eliminarAviso }) {
    const [translate] = useTranslate('home');
    const { aviso } = warning;
    const [modalOpened, setModalOpened] = useState(false);

    const handleRedirect = useCallback(() => {
        const action = redirigirAvisosNoOp(warning);
        if (action === 'openModal') {
            setModalOpened(true);
        }
    }, [redirigirAvisosNoOp, warning]);

    const handleSuccess = useCallback((tarjeta) => {
        setModalOpened(false);
        eliminarAviso(tarjeta);
    }, []);

    return (
        <>
            <StyledPaper type="warning" elevation>
                <Grid container height="100%">
                    <Grid container item>
                        <StyledWarning item>
                            <Grid width="30px">
                                <StyledLeftIcon type="alert" size="md" color={aviso.importancia ? 'error' : 'warning'} />
                            </Grid>
                            <Grid fluidItem>
                                <StyledUppercaseText
                                    value={aviso.importancia ? translate('importante') : translate('pendiente')}
                                    size="xs"
                                    bold
                                />
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
                        {aviso.descripcion && aviso.importancia && (
                            <Tooltip tooltipData={aviso.descripcion}>
                                <Grid item>
                                    <StyledDescription size="md" value={aviso.descripcion} />
                                </Grid>
                            </Tooltip>
                        )}
                    </Grid>
                    {aviso.codigo !== 'EV0000000072' && (
                        <Grid item justifyContent="center" alignItems="flex-end">
                            <Button onClick={handleRedirect} adaptWidth variant="solid" type="button">
                                {translate('resolver')}
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </StyledPaper>
            <Modal open={modalOpened} onClose={() => setModalOpened(false)}>
                <DniCaducado warning={warning} onSuccess={handleSuccess} onCancel={() => setModalOpened(false)} />
            </Modal>
        </>
    );
}
export default connect(
    () => ({}),
    (dispatch) => ({
        eliminarAviso: (aviso) => dispatch(eliminarAvisoAction(aviso)),
    }),
)(AvisosNoOpCard);

AvisosNoOpCard.propTypes = {
    // actualizarAvisos: PropTypes.func.isRequired,
    warning: PropTypes.shape({
        aviso: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
            descripcion: PropTypes.string,
            codigo: PropTypes.string.isRequired,
            importancia: PropTypes.bool.isRequired,
        }),
    }).isRequired,
    eliminarAviso: PropTypes.func.isRequired,
};
