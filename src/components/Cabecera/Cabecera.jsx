import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@bdt/components/dist';
import { StyledContainer } from './Cabecera.styles';

function Cabecera({ value, size, children }) {
    /* eslint-disable-next-line no-unneeded-ternary */
    const mensajeCabecera = value ? value : children;
    return (
        <StyledContainer>
            <Text value={mensajeCabecera} size={size || 'xl'} />
        </StyledContainer>
    );
}

export default Cabecera;

Cabecera.propTypes = {
    value: PropTypes.string,
    size: PropTypes.string,
    children: PropTypes.string,
};

Cabecera.defaultProps = {
    value: '',
    size: '',
    children: '',
};
