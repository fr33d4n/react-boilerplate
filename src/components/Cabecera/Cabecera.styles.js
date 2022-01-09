import styled from 'styled-components';
import { minSize } from '@services/breakpoints';

export const StyledContainer = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: ${({ theme }) => theme.space.md};
    background-color: ${({ theme }) => theme.color.neutralXXLight};
    border-top: 0.4rem solid ${({ theme }) => theme.color.primaryLight};
    @media (min-width: ${minSize.medium}px) {
        padding: ${({ theme }) => `${theme.space.md} ${theme.space.xl}`};
    }
`;
