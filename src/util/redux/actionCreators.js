import * as actionTypes from "./actionTypes";
import { store } from "./store";

/*==============================================================
# User
==============================================================*/
export function updateUser(user={}) {
    store.dispatch({
        type: actionTypes.UPDATE_USER,
        user
    });
}