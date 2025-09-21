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

export function addCartItemRedux(item) {
    store.dispatch({
        type: actionTypes.ADD_CART_ITEM,
        item
    });
}

export function updateCartItemRedux(itemGuid, quantity) {
    store.dispatch({
        type: actionTypes.UPDATE_CART_ITEM,
        itemGuid,
        quantity
    });
}

export function removeCartItemRedux(itemGuid) {
    store.dispatch({
        type: actionTypes.REMOVE_CART_ITEM,
        itemGuid
    });
}

export function clearCartRedux() {
    store.dispatch({
        type: actionTypes.CLEAR_CART
    });
}