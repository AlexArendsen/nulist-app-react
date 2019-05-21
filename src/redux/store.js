import { createStore, applyMiddleware } from "redux";
import { rootReducer } from "./reducers";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

export const configureStore = () => {
    const logger = createLogger({
        collapsed: true
    })
    return createStore(rootReducer, applyMiddleware(thunk, logger))
}