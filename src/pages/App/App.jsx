import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { Provider, ReactReduxContext } from 'react-redux';

import configureStore from '@store/configureStore';
import theme from '../../themes/myCustomElement/theme';
import GlobalFonts from '../../themes/myCustomElement/fonts/fonts';
import GlobalStyle from '../../themes/myCustomElement/global';

import Layout from './Layout';

function App({ params = {} }) {
    return (
        <React.StrictMode>
            <Provider store={configureStore()} context={ReactReduxContext}>
                <GlobalFonts />
                <ThemeProvider theme={theme}>
                    <GlobalStyle />
                    <Layout params={params} />
                </ThemeProvider>
            </Provider>
        </React.StrictMode>
    );
}

App.propTypes = {
    params: PropTypes.shape({
        param1: PropTypes.string,
        param2: PropTypes.number,
    }),
};

App.defaultProps = {
    params: {},
};

export default App;
