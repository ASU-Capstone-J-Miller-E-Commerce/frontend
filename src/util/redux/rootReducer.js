import userReducer from "./userReducer"
import cartReducer from "./cartReducer"
import featuredCuesReducer from "./featuredCuesReducer"
import { combineReducers } from "@reduxjs/toolkit/react";

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    featuredCues: featuredCuesReducer,
});

export default rootReducer;