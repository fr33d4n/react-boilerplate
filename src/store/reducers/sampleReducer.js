export const ACTIONS = {
    SAMPLE_LOADING: '@sample/setLoading',
    SAMPLE_SUCCESS: '@sample/setSuccess',
    SAMPLE_FAILURE: '@sample/setError',
};

const INITIAL_STATE = {
    data: [],
    loading: false,
    error: null,
};

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ACTIONS.SAMPLE_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case ACTIONS.SAMPLE_SUCCESS:
            return {
                ...state,
                data: action.payload,
            };
        case ACTIONS.SAMPLE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}
