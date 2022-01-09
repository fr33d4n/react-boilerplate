import styled from 'styled-components';
import { Icon, Spinner } from '@bdt/components/dist';

export const StyledHiddenInput = styled.input`
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    width: 1px;
    overflow: hidden;
    padding: 0;
    position: absolute !important;
    white-space: nowrap;
`;

export const StyledLabel = styled.label`
    display: flex;
    color: ${({ theme }) => theme.color.primaryDark};
    font-weight: bold;
    font-size: ${({ theme }) => theme.typeScale.body};
    svg {
        color: ${({ theme }) => theme.color.primaryDark};
    }
`;

export const StyledLabelFake = styled.div`
    display: flex;
    color: ${({ theme }) => theme.color.primaryDark};
    font-weight: bold;
    font-size: ${({ theme }) => theme.typeScale.body};
    svg {
        color: ${({ theme }) => theme.color.primaryDark};
    }
`;

export const StyledIcon = styled(Icon)`
    margin-right: ${({ theme }) => theme.space.sm};
`;

export const SpinnerSt = styled(Spinner)`
    position: relative;
    left: 5px;
`;

export const ErrorSt = styled.span`
    color: red;
`;
