import { createGlobalStyle } from 'styled-components';

import SourceProRegularWoff from './sourcesanspro-regular-webfont.woff';
import SourceProRegularWoff2 from './sourcesanspro-regular-webfont.woff2';
import SourceProSemiboldWoff from './sourcesanspro-semibold-webfont.woff';
import SourceProSemiboldWoff2 from './sourcesanspro-semibold-webfont.woff2';

export default createGlobalStyle`
  @font-face {
    font-family: 'sourceSansProregular';
    src: url(${SourceProRegularWoff2}) format('woff2'),
         url(${SourceProRegularWoff}) format('woff');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'sourceSansSemibold';
    src: url(${SourceProSemiboldWoff2}) format('woff2'),
        url(${SourceProSemiboldWoff}) format('woff');
    font-weight: normal;
    font-style: normal;
}

`;
