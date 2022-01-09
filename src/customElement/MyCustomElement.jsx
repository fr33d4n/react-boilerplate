import React from 'react';
import ReactDOM from 'react-dom';

import App from '@pages/App/App';

export class MyCustomElement extends HTMLElement {
    constructor() {
        super();
        this.webComponentElement = document.querySelector('my-custom-element');
    }

    disconnectedCallback() {
        ReactDOM.unmountComponentAtNode(this.webComponentElement);
    }

    connectedCallback() {
        const params = this.getAttribute('params') || '{}';
        ReactDOM.render(<App params={JSON.parse(params)} />, this.webComponentElement);
    }
}

window.customElements.define('my-custom-element', MyCustomElement);
