import { Actions } from "../../values/actions";

export const InitializeApp = () => {
    return (dispatch) => {
        dispatch({ type: Actions.AppReady })
    }
}