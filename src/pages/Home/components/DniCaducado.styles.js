import styled from 'styled-components';
import { Icon, Paper, Grid, Text, Button, Modal } from '@bdt/components/dist';
import { minSize } from '@services/breakpoints';
import InputFile from '@components/InputFile/InputFile';

export const WrapperDni = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 84vw;
    @media (min-width: ${minSize.small}px) {
        padding: ${({ theme }) => `${theme.space.md} ${theme.space.lg}`};
        width: 70vw;
        min-height: 300px;
    }
    @media (min-width: ${minSize.medium}px) {
        width: 60vw;
        max-width: 700px;
    }
`;

export const WrapperLeft = styled.div`
    align-self: flex-start;
`;

export const StyledInputFileDni = styled(InputFile)`
    width: auto;
    label {
        width: 94px;
        border-radius: 3px;
        display: block;
        border: 1px solid #35261a;
        padding: 14px 0;
        position: relative;
        margin: 4px auto;
        cursor: pointer;
        color: #35261a;
        span:first-child {
            width: 0px;
            height: 0px;
        }
        span {
            display: flex;
            justify-content: center;
            width: 100%;
        }
    }
    svg {
        display: none;
    }
`;
export const StyledButton = styled(Button)`
    padding: 0;
`;

export const StyledFileItem = styled.div`
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #c8d444;
    border-radius: 4px;
    text-align: center;
    padding: 6px 10px;
    cursor: pointer;
    margin-bottom: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
        font-size: ${({ theme }) => theme.typeScale.body};
    }
    span {
        font-size: ${({ theme }) => theme.typeScale.body};
        display: inline-flex;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    :first-child {
        margin-top: ${({ theme }) => theme.space.sm};
    }
`;

export const StyledIcon = styled(Icon)`
    margin-left: ${({ theme }) => theme.space.sm};
    display: inline-block;
`;
export const StyledBorderButton = styled(Button)`
    &[class*='outlined'],
    &[class*='outlined']:hover {
        border-color: transparent;
    }
    margin-right: ${({ theme }) => theme.space.sm};
`;

export const StyledTitle = styled(Text)`
    margin-bottom: ${({ theme }) => theme.space.sm};
`;
export const StyledText = styled(Text)`
    margin: ${({ theme }) => `${theme.space.sm} 0`};
`;
export const FilesWrapper = styled.div`
    width: 100%;
    box-sizing: border-box;
    @media (min-width: ${minSize.small}px) {
        width: 300px;
    }
`;
export const StyledDisable = styled.div`
    width: 65px;
    font-size: ${({ theme }) => theme.typeScale.body};
    margin: ${({ theme }) => `${theme.space.xs} 0`};
    padding: ${({ theme }) => theme.space.sm};
    text-align: center;
    background-color: #eee;
    border: 1px solid #99928c;
    cursor: default;
    border-radius: 5px;
    color: ${({ theme }) => theme.color.neutralLight};
    font-weight: bold;
`;
export const WrapperSpinner = styled.div`
    min-height: 300px;
    display: flex;
    align-self: center;
    justify-content: center;
`;
