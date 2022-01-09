import styled from 'styled-components';

export const StyledContainer = styled.div`
    position: relative;
    display: inline-block;
    width: inherit;

    :hover span {
        visibility: visible;
    }
`;

export const StyledTooltip = styled.span`
    width: max-content;
    max-width: 200px;
    visibility: hidden;
    background-color: ${({ theme, info }) => {
        if (info) {
            return theme.color.tertiary;
        }
        return theme.color.neutralInverse;
    }};
    color: ${({ theme, info }) => {
        if (info) {
            return theme.color.neutralInverse;
        }
        return theme.color.neutralDark;
    }};
    text-align: start;
    border-radius: 3px;
    padding: 12px;
    position: absolute;
    z-index: 1;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    border-top-color: 150%;
    font-size: ${({ theme }) => theme.typeScale.body};
    word-break: break-word;
    bottom: ${({ side }) => side === 'top' && '100%'};
    top: ${({ side }) => {
        if (side === 'bottom') {
            return '100%';
        }
        if (side === 'right' || side === 'left') {
            return '-5%';
        }
        return '';
    }};
    left: ${({ side }) => side === 'right' && '105%'};
    right: ${({ side }) => side === 'left' && '105%'};

    ::after {
        content: '';
        position: absolute;
        border-width: 5px;
        border-style: solid;
        border-color: ${({ side, theme, info }) => {
            if (side === 'top') {
                return `${info ? theme.color.tertiary : theme.color.neutralInverse} transparent transparent transparent`;
            }
            if (side === 'bottom') {
                return `transparent transparent ${info ? theme.color.tertiary : theme.color.neutralInverse} transparent`;
            }
            if (side === 'right') {
                return `transparent ${info ? theme.color.tertiary : theme.color.neutralInverse} transparent transparent`;
            }
            if (side === 'left') {
                return `transparent transparent transparent ${info ? theme.color.tertiary : theme.color.neutralInverse}`;
            }
            return '';
        }};
        bottom: ${({ side }) => side === 'bottom' && '100%'};
        top: ${({ side }) => {
            if (side === 'top') {
                return '100%';
            }
            if (side === 'right' || side === 'left') {
                return '5%';
            }
            return '';
        }};
        left: ${({ side }) => {
            if (side === 'left') {
                return '100%';
            }
            if (side === 'top' || side === 'bottom') {
                return '5%';
            }
            return '';
        }};
        right: ${({ side }) => side === 'right' && '100%'};
    }
`;
