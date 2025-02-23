import userReducer from "./userReducer"
import { combineReducers } from "@reduxjs/toolkit/react";

const rootReducer = combineReducers({
    user: userReducer,
});

export default rootReducer;