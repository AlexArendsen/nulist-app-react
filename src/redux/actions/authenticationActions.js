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
            localStorage.setItem(Storage.UserTokenKey, result.token)

            dispatch(loadProfileInfo()) 

            dispatch({ type: Actions.ReceiveLogin, data: result.token })
            return true;
        } catch (e) {
            dispatch({ type: Actions.WebRequestFailed, data: e, error: e.toString() })
            return false;
        }
    }
}

export const register = (username, password, confirmPassword, recaptcha) => {
    return async (dispatch) => {
        dispatch({type: Actions.SendRegister});

        if (!recaptcha) {
            dispatch({ type: Actions.ClientError, data: 'Please click the robot button' })
            return false;
        }

        const body = JSON.stringify({ username, password, confirmPassword, recaptcha })

        try {
            const response = await fetch(Urls.Register(), { method: 'POST', body, headers: MakeDefaultHeaders() })
            if (!response.ok) throw await response.text();
            const result = await response.json();
            dispatch({ type: Actions.ReceiveRegister, data: result })
            return true;
        } catch (e) {
            dispatch({ type: Actions.WebRequestFailed, data: e, error: e.toString() })
            return false;
        }
    }
}

export const logout = () => {
    localStorage.removeItem(Storage.UserTokenKey);
    return ({ type: Actions.Logout })
}