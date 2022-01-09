import ROUTES from '@routes/routes';
import { goTo } from '@actions/router';
import { ACTIONS as ERROR_ACTIONS } from '@store/reducers/errorReducer';

const setMessageError = (proceso, callback) => ({
    type: ERROR_ACTIONS.SET_ERROR,
    payload: proceso,
    callback,
});

export const gestionarErrores = (dispatch, e, handlerCallBack) => {
    if (e || (e && e.response)) {
        const error = e.response ? e.response : e;
        const infoError = {
            error: error.operationMessage,
            codigoError: error.operationResult,
        };

        dispatch(setMessageError(infoError, handlerCallBack));
        dispatch(goTo(ROUTES.ERROR));
    }
};
