import { neutral, green, warm, blue } from './colors';
import checkboxCheck from './assets/checkbox_check.svg';
import checkboxUnchecked from './assets/checkbox_unchecked.svg';
import spinner from './assets/tabla-loading.svg';

export default {
    space: {
        xs: '0.32rem',
        sm: '0.8rem',
        md: '1.6rem',
        lg: '2.4rem',
        xl: '3.2rem',
        xxl: '5.6rem',
    },
    font: {
        primary: 'sourceSansProregular',
        primarySemibold: 'sourceSansSemibold',
    },
    typeScale: {
        header1: '2.4rem',
        header2: '2rem',
        bigBody: '1.8rem',
        body: '1.6rem',
        smallBody: '1.4rem',
        extraSmallBody: '1.2rem',
    },
    color: {
        neutralDark: neutral[800],
        neutralNormal: neutral[700],
        neutralExtraMedium: neutral[600],
        neutralMedium: neutral[500],
        neutralLight: neutral[400],
        neutralExtraLight: neutral[300],
        neutralXXLight: neutral[200],
        neutralInverse: neutral[100],
        primaryDark: green[400],
        primary: green[300],
        primaryLight: green[200],
        primaryExtraLight: green[100],
        secondaryDark: warm[400],
        secondary: warm[300],
        secondaryLight: warm[200],
        secondaryExtraLight: warm[200],
        tertiary: blue[300],
        tertiaryLight: blue[100],
        error: warm[500],
        errorLight: warm[100],
    },
    gradient: {
        primary: 'linear-gradient(228deg, #fffef8 100%, #fff6e9 37%)',
    },
    border: {
        primaryRadius: '5px',
        secondaryRadius: '3px',
        primaryWidth: '2px',
        primaryColor: warm[300],
    },
    shadow: {
        normal: '0 3px 11px 0 rgba(53, 38, 26, 0.05)',
        expand: '0 12px 24px 0 rgba(53, 38, 26, 0.2)',
    },
    iconSize: {
        xl: '40px',
        lg: '24px',
        md: '18px',
        sm: '14px',
        xs: '14px',
    },
    svg: {
        checkedCheckbox: checkboxCheck,
        uncheckedCheckbox: checkboxUnchecked,
        // eslint-disable-next-line object-shorthand
        spinner: spinner,
    },
    size: {
        content: '75%',
        home: '100%',
    },
};
