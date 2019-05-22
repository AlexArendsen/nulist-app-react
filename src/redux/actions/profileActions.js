import { Storage } from "../../values/storage";
import { Actions } from "../../values/actions";
import { Urls } from "../../values/urls";
import { MakeDefaultHeaders } from "../../values/headers";

export const loadProfileInfo = () => {
    return async (dispatch) => {
        dispatch({ type: Actions.SendGetProfile })
        const response = await fetch(Urls.Profile.Me(), { headers: MakeDefaultHeaders() })
        try { return dispatch({ type: Actions.ReceiveGetProfile, data: await response.json() }) }
        catch (e) { return dispatch({ type: Actions.WebRequestFailed, data: e }) }
    }
}