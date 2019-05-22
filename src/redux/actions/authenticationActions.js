import { Actions } from "../../values/actions";
import { Urls } from "../../values/urls";
import { MakeDefaultHeaders } from "../../values/headers";
import { Storage } from "../../values/storage";
import { loadProfileInfo } from "./profileActions";

export const login = (username, password, confirmPassword) => {
    return async (dispatch) => {
        dispatch({type: Actions.SendLogin});
        const body = JSON.stringify({ username, password })

        try {
            const response = await fetch(Urls.Login(), { method: 'POST', body: body, headers: MakeDefaultHeaders() })
            if (!response.ok) throw await response.text();
            const result = await response.json();

            console.log('Setting localStorage to', result.token)
            localStorage.setItem(Storage.UserTokenKey, result.token)

            dispatch(loadProfileInfo()) 

            dispatch({ type: Actions.ReceiveLogin, data: result.token })
        } catch (e) {
            dispatch({ type: Actions.WebRequestFailed, data: e, error: e.toString() })
        }
    }
}

export const register = (username, password, confirmPassword) => {
    return async (dispatch) => {
        dispatch({type: Actions.SendRegister});
        const body = JSON.stringify({ username, password, confirmPassword })

        try {
            const response = await fetch(Urls.Login(), { method: 'POST', body })
            if (!response.ok) throw await response.text();
            const result = await response.json();
        } catch (e) {
            dispatch({ type: Actions.WebRequestFailed, data: e, error: e.toString() })
        }
    }
}

export const logout = () => {
    localStorage.removeItem(Storage.UserTokenKey);
    return ({ type: Actions.Logout })
}