import { updateUser } from "./actionCreators";
import * as actionTypes from "./actionTypes";

const initialState = {};

const userReducer = (state={}, action) => {
    switch(action.type) {
        case actionTypes.UPDATE_USER:
            return {
                ...state,
                ...action.user,
            }

        default:
            return state;
    }
}

export default userReducer;