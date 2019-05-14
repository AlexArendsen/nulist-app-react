import { createStore, applyMiddleware } from "redux";
import { rootReducer } from "./reducers";
import thunk from "redux-thunk";
import logger from "redux-logger";

export const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(logger, thunk))
}