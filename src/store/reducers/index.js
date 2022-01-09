import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from '@services/history';

import sampleReducer from './sampleReducer';

/* Al añadir los reducers de este modo tendremos la store divida por conceptos.
 * Tendremos store.example1.XXX y store.example2.YYY. Lo cual es muy comodo para que accidentalmente
 * no sobreescrivamos ninguna clave de la store. Es MUY recomendable además prefijar las claves de
 * los reducers. Por ejemplo, si tubieramos la clave SUBMIT_FORM, es muy recomendable llamarla example1/SUBMIT_FORM
 */
export default combineReducers({
    router: connectRouter(history),
    samples: sampleReducer,
});
