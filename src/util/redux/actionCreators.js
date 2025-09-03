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

/*==============================================================
# Cart
==============================================================*/
export function setCartItems(items) {
    store.dispatch({
        type: actionTypes.SET_CART_ITEMS,
        items
    });
}

export function updateCartItemRedux(cartItemId, quantity) {
    store.dispatch({
        type: actionTypes.UPDATE_CART_ITEM,
        cartItemId,
        quantity
    });
}

export function removeCartItemRedux(cartItemId) {
    store.dispatch({
        type: actionTypes.REMOVE_CART_ITEM,
        cartItemId
    });
}

export function clearCartRedux() {
    store.dispatch({
        type: actionTypes.CLEAR_CART
    });
}