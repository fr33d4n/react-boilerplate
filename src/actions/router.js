import { push } from 'connected-react-router';
import { stringify } from 'qs';
import { emitEvent, EVENTS } from '@services/communication';

export function goTo(where, state) {
    let queryParams = '';
    if (state) {
        queryParams = `?${stringify(state)}`;
    }
    emitEvent(EVENTS.ROUTING_BDT, { state: where });
    const url = `${where}${queryParams}`;
    return (dispatch) => {
        dispatch(push(url));
    };
}
