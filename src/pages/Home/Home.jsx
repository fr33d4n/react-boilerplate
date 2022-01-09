import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useTranslate } from '@services/i18n';
import { StyledGrid, StyledWrapper, StyledCollapse, StyledTitle, StyledText, StyledSpinnerContainer, StyledMessage } from './Home.styles';

import { homeAction1 } from './Home.actions';
import HomeCard from './components/HomeCard';

function Home({ fetchPendingProcesses, pendingProcesses, pendingProcessesLoading, avisos, avisosLoading }) {
    const [translate] = useTranslate('home');
    const isLoading = pendingProcessesLoading || avisosLoading;
    const topCards = orderAndFilterTopCards(pendingProcesses, avisos);
    const bottomCards = orderAndFilterBottomCards(pendingProcesses);
    useEffect(() => {
        fetchPendingProcesses();
    }, []);

    return (
        <>
            {isLoading && (
                <StyledSpinnerContainer>
                    <Spinner size="md" />
                </StyledSpinnerContainer>
            )}
            {!isLoading && topCards.length === 0 && bottomCards.length === 0 && (
                <Grid container alignItems="center">
                    <Grid item width="45px">
                        <Icon type="info" color="info" background />
                    </Grid>
                    <Grid fluidItem alignItems="center">
                        <StyledMessage value={translate('sinContenido')} size="xxl" bold />
                    </Grid>
                </Grid>
            )}
            {!isLoading && (topCards.length > 0 || bottomCards.length > 0) && (
                <StyledWrapper>
                    <StyledTitle value={translate('titulo')} size="xxl" bold />
                    <StyledText
                        /* eslint-disable-next-line max-len */
                        value={translate('descripcion')}
                        size="lg"
                    />

                    <StyledGrid container justifyContent="flex-start">
                        {topCards.map((item) => {
                            return (
                                <Grid key={item.aviso ? item.aviso.id : item.idInstanciaProceso} item width="auto" justifyContent="center">
                                    <HomeCard card={item} />
                                </Grid>
                            );
                        })}
                    </StyledGrid>
                    {bottomCards.length > 0 && (
                        <StyledCollapse text={translate('pendienteOtros')} textBold>
                            <StyledText
                                /* eslint-disable-next-line max-len */
                                value={translate('gestionesCurso')}
                                size="lg"
                            />
                            <StyledGrid container item justifyContent="flex-start">
                                {bottomCards.map((item) => {
                                    return (
                                        <Grid key={item.idInstanciaProceso} item width="auto" justifyContent="center">
                                            <HomeCard card={item} />
                                        </Grid>
                                    );
                                })}
                            </StyledGrid>
                        </StyledCollapse>
                    )}
                </StyledWrapper>
            )}
        </>
    );
}

Home.propTypes = {
    fetchPendingProcesses: PropTypes.func.isRequired,
    pendingProcesses: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    pendingProcessesLoading: PropTypes.bool.isRequired,
    avisos: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    avisosLoading: PropTypes.bool.isRequired,
};

export default connect(
    (store) => ({
        pendingProcesses: store.pendingProcesses.data,
        pendingProcessesLoading: store.pendingProcesses.loading,
        pendingProcessesError: store.pendingProcesses.error,
        avisos: store.avisos.data,
        avisosLoading: store.avisos.loading,
    }),
    (dispatch) => ({
        fetchPendingProcesses: () => dispatch(fetchPendingProcessesAction()),
    }),
)(Home);
