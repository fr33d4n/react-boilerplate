import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle(({ theme }) => {
    if (process.env.NODE_ENV === 'production') {
        return {
            'my-custom-element': {
                boxSizing: 'border-box',
                margin: 0,
                fontFamily: theme.font.primary,
            },
        };
    }

    return {
        html: {
            fontSize: '10px',
        },

        'my-custom-element': {
            boxSizing: 'border-box',
            margin: 0,
            fontFamily: theme.font.primary,
        },
    };
});
