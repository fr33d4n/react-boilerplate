import styled from 'styled-components';
import { Icon, Paper, Grid, Text, Button } from '@bdt/components/dist';
import { minSize } from '@services/breakpoints';
import InputFile from '@components/InputFile/InputFile';

export const StyledLeftIcon = styled(Icon)`
    margin-right: ${({ theme }) => theme.space.sm};
`;
export const StyledRightIcon = styled(Icon)`
    margin-left: ${({ theme }) => theme.space.sm};
`;
export const StyledTooltipContainer = styled.div`
    width: auto;
`;
export const StyledInterviniente = styled.span`
    display: inline-flex;
    width: 100%;
    text-align: left;
    justify-content: flex-start;
    &:not(:last-child) {
        border-bottom: ${({ theme }) => `1px solid ${theme.color.neutralInverse}`};
        padding-bottom: ${({ theme }) => `${theme.space.xs}`};
        margin-bottom: ${({ theme }) => `${theme.space.xs}`};
    }
`;
export const StyledUppercaseText = styled(Text)`
    text-transform: uppercase;
`;

export const StyledPaper = styled(Paper)`
    box-sizing: border-box;
    width: 270px;
    height: 224px;
    padding: ${({ theme }) => theme.space.md};
    margin-bottom: ${({ theme }) => theme.space.md};
    margin-right: 0;
    margin-left: 0;
    @media (min-width: ${minSize.small}px) {
        margin-right: 0.75rem;
        margin-left: 0.75rem;
    }
`;
export const Container = styled.div`
    background-color: ${({ theme }) => theme.color.neutraExtraLight};
`;
export const StyledWarning = styled(Grid)`
    margin-bottom: ${({ theme }) => theme.space.sm};
`;
export const StyledCardTitle = styled(Text)`
    line-height: 2.4rem;
    margin-bottom: 0.8rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
`;
export const StyledDescription = styled(Text)`
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-height: 1.8rem;
`;
export const StyledInputFile = styled(InputFile)`
    label,
    svg {
        transition: color 0.3s ease-in-out;
    }
    label:hover,
    label:hover svg {
        color: ${({ theme }) => theme.color.neutralNormal};
    }
`;

export const StyledButton = styled(Button)`
    padding: 0;
`;

export const StyledIcon = styled(Icon)`
    margin-left: ${({ theme }) => theme.space.sm};
    display: inline-block;
`;
