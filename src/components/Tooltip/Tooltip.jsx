import React from 'react';
import PropTypes from 'prop-types';

import { StyledContainer, StyledTooltip } from './Tooltip.styles';

const Tooltip = ({ children, tooltipData, side, info, customClass }) => {
    return (
        <StyledContainer className={customClass}>
            {children}
            <StyledTooltip side={side} info={info}>
                {tooltipData}
            </StyledTooltip>
        </StyledContainer>
    );
};

Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    tooltipData: PropTypes.node.isRequired,
    side: PropTypes.string,
    info: PropTypes.bool,
    customClass: PropTypes.string,
};

Tooltip.defaultProps = {
    side: 'bottom',
    info: false,
    customClass: '',
};

export default Tooltip;
