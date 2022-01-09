import styled from 'styled-components';
import { Icon, Collapse, Grid, Text } from '@bdt/components/dist';
import { minSize } from '@services/breakpoints';

export const ContainerSt = styled.div`
    text-align: center;
`;

export const HeaderSt = styled.div`
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
`;

export const LogoSt = styled.img`
    height: 40vmin;
    pointer-events: none;
`;

export const LinkSt = styled.a`
    color: #61dafb;
`;
export const RightIcon = styled(Icon)`
    margin-left: ${({ theme }) => theme.space.sm};
`;
export const StyledLeftText = styled(Text)`
    margin-right: ${({ theme }) => theme.space.sm};
    text-transform: uppercase;
`;
export const StyledGrid = styled(Grid)`
    justify-content: center;
    padding-top: ${({ theme }) => theme.space.lg};
    padding-bottom: ${({ theme }) => theme.space.lg};
    width: inherit;
    @media (min-width: ${minSize.small}px) {
        justify-content: flex-start;
        margin-left: 0.75rem;
    }
`;
export const StyledWrapper = styled.div`
    width: 100%;
`;

export const StyledCollapse = styled(Collapse)`
    margin-left: ${({ theme }) => `${theme.space.md}`};
    margin-bottom: ${({ theme }) => `${theme.space.md}`};
    p,
    svg {
        color: ${({ theme }) => theme.color.primary};
        margin-left: 0;
        margin-bottom: 0;
    }
`;

export const StyledTitle = styled(Text)`
    margin-left: ${({ theme }) => `${theme.space.md}`};
    margin-right: ${({ theme }) => `${theme.space.md}`};
    margin-bottom: ${({ theme }) => `${theme.space.md}`};
`;
export const StyledText = styled(Text)`
    margin-left: ${({ theme }) => `${theme.space.md}`};
    margin-right: ${({ theme }) => `${theme.space.md}`};
`;
export const StyledSpinnerContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20vh;
`;

export const StyledMessage = styled(Text)`
    margin-left: ${({ theme }) => `${theme.space.md}`};
    margin-right: ${({ theme }) => `${theme.space.md}`};
`;
