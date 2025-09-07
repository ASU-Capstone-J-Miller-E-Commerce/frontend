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

        case actionTypes.ADD_CART_ITEM:
            const existingItemIndex = state.items.findIndex(
                item => item.itemGuid === action.item.itemGuid && item.itemType === action.item.itemType
            );
            
            let newItems;
            if (existingItemIndex > -1) {
                // Update existing item quantity
                newItems = state.items.map(item => 
                    item.itemGuid === action.item.itemGuid && item.itemType === action.item.itemType
                        ? { ...item, quantity: item.quantity + action.item.quantity }
                        : item
                );
            } else {
                // Add new item
                newItems = [...state.items, action.item];
            }
            
            const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            return {
                ...state,
                items: newItems,
                totalItems: newTotalItems
            };

        case actionTypes.UPDATE_CART_ITEM:
            const updatedItems = state.items.map(item => 
                item.itemGuid === action.itemGuid 
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
            const filteredItems = state.items.filter(item => item.itemGuid !== action.itemGuid);
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
