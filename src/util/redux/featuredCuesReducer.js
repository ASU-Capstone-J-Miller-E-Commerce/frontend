import * as actionTypes from "./actionTypes";

const initialState = {
    items: [],
    loading: false,
    lastFetched: null
};

export default function featuredCuesReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_FEATURED_CUES:
            return {
                ...state,
                items: action.items,
                loading: false,
                lastFetched: Date.now()
            };
        case actionTypes.SET_FEATURED_CUES_LOADING:
            return {
                ...state,
                loading: action.loading
            };
        default:
            return state;
    }
}