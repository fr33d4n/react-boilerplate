import styled from 'styled-components';
import { minSize } from '@services/breakpoints';
import { Paper, Text, Input as InputComponent, Button, Icon } from '@bdt/components/dist';

export const ContenedorPrincipal = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`;

export const CajaTituloFirmaElectronica = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`;

export const Input = styled(InputComponent)`
    letter-spacing: 0.3em;
    font-size: 2.4rem;
    box-sizing: border-box;
    height: 100%;
    margin-bottom: 0.8rem;
    width: 100%;
    @media (min-width: ${minSize.extraSmall}px) {
        width: 200px;
        min-width: 140px;
        margin-right: 0.8rem;
    }
    @media (min-width: ${minSize.medium}px) {
        width: 200px;
    }
`;

export const BotonSolicitar = styled(Button)`
    min-width: 100px !important;
    width: 200px;
`;

export const BotonFirmar = styled(Button)`
    min-width: 100px !important;
    max-width: 150px;
    margin-bottom: 0.8rem;
`;

export const LinkOlvidado = styled(Text)`
    cursor: pointer;
    color: ${({ color, theme }) => (color === 'active' ? theme.color.primary : 'inherit')};
`;

export const AvisoContainer = styled.div`
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 194px;
    padding: ${({ theme }) => theme.space.lg};
    background-color: ${({ theme }) => theme.color.errorLight};
`;

export const MensajeContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
`;

export const StyledIcon = styled(Icon)`
    padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm} 0  0`};
`;

export const StyledErrorText = styled(Text)`
    color: ${({ theme }) => theme.color.error};
    margin-bottom: ${({ theme }) => theme.space.md};
`;
export const StyledText = styled(Text)`
    margin-bottom: ${({ theme }) => theme.space.md};
`;

export const CajaExitoFirmaElectronica = styled.div`
    display: flex;
`;

export const CajaFirmaPrincipal = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    margin-left: ${({ invisibleIcon }) => (invisibleIcon ? '36px;' : '0')};
`;

export const IconSt = styled(Icon)`
    margin-top: 4.2rem;
    margin-right: 1.6rem;
    align-self: flex-start;
`;

export const SubtituloSMS = styled(Text)`
    margin-bottom: ${({ theme }) => theme.space.sm};
    color: ${({ disabled, theme }) => (disabled ? theme.color.neutralMedium : theme.color.neutralExtraMedium)};
`;

export const CajaInputYBoton = styled.div`
    display: flex;
    margin-bottom: 10px;
    flex-direction: column;

    @media (min-width: ${minSize.extraSmall}px) {
        flex-direction: row;
        flex-wrap: wrap;
    }
`;

export const CajaSubtituloExito = styled.div`
    display: flex;
    align-items: flex-end;
`;

export const IconExito = styled(Icon)`
    margin-right: 5px;
`;

export const ContenedorFirmas = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    @media (min-width: ${minSize.medium}px) {
        flex-direction: row;
    }
`;

const BloqueFirma = styled(Paper)`
    box-sizing: border-box;
    display: flex;
    flex-basis: 50%;
    flex-grow: 1;
    padding: ${({ theme }) => `${theme.space.lg} ${theme.space.lg} ${theme.space.md} ${theme.space.lg}`};
    box-shadow: 0 3px 11px 0 rgba(53, 38, 26, 0.05);
    @media (min-width: ${minSize.medium}px) {
        min-height: 194px;
        width: 50%;
    }
`;

export const ContenedorFirmaOTP = styled(BloqueFirma)`
    background-color: ${({ exito, theme }) => (exito ? theme.color.primaryExtraLight : 'inherit')};
    border-radius: 5px 5px 0 0;
    border: ${({ theme }) => `solid 1px ${theme.color.neutralXXLight}`};
    @media (min-width: ${minSize.medium}px) {
        border-radius: 5px 0 0 5px;
    }
`;
export const ContenedorFirmaElectronica = styled(BloqueFirma)`
    background-color: ${({ disabled, theme }) => (disabled ? theme.color.neutralXXLight : 'inherit')};
    color: ${({ theme }) => theme.color.neutralExtraMedium};
    border-radius: 0 0 5px 5px;
    @media (min-width: ${minSize.medium}px) {
        border-radius: 0 5px 5px 0;
    }
`;

export const Titulo = styled(Text)`
    margin-bottom: ${({ theme }) => theme.space.sm};
    color: ${({ disabled, theme }) => (disabled ? theme.color.neutralMedium : theme.color.neutralExtraMedium)};
`;
