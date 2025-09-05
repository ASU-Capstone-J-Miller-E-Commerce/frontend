import * as actionTypes from "./actionTypes";

const initialState = {
    items: [],
    totalItems: 0
};

const cartReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_CART_ITEMS:
            const totalItems = action.items.reduce((sum, item) => sum + item.quantity, 0);
            return {
                ...state,
                items: action.items,
                totalItems
            };

        case actionTypes.UPDATE_CART_ITEM:
            const updatedItems = state.items.map(item => 
                item.cartItemId === action.cartItemId 
                    ? { ...item, quantity: action.quantity }
                    : item
            );
            const updatedTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            return {
                ...state,
                items: updatedItems,
                totalItems: updatedTotalItems
            };

        case actionTypes.REMOVE_CART_ITEM:
            const filteredItems = state.items.filter(item => item.cartItemId !== action.cartItemId);
            const filteredTotalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
            return {
                ...state,
                items: filteredItems,
                totalItems: filteredTotalItems
            };

        case actionTypes.CLEAR_CART:
            return {
                ...state,
                items: [],
                totalItems: 0
            };

        default:
            return state;
    }
};

export default cartReducer;
