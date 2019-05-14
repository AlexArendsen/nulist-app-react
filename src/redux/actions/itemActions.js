import { Actions } from "../../values/actions";
import { Urls } from "../../values/urls";
import { MakeDefaultHeaders } from "../../values/headers";

// Sample Object
// checked: true
// created_at: "2019-04-24T23:20:57.289Z"
// description: "* Need tags↵* Recommend more artists at end↵* Need to embed YouTube videos / Spotify tracks↵↵Maybe I don't want a blog, maybe I just want a place where I can recommend music. It could just be a really simple WordPress blog↵↵* Music that I already know about↵  * If you like this about this music, you'd like this other music↵* New music I've found↵* Seasonal Playlists↵* Other stuff I love↵* Other thoughts and considerations↵↵Article Ideas:↵↵* Intro article about me intentions↵* You Can Go Back↵* Sufjan Stevens, the King of Indie"
// parent_id: "5cc0f4e4352498006b89fcb7"
// title: "Start music blog?"
// user_id: "5b82f656c84c100f860835fd"
// _id: "5cc0ef59352498006b89fcb4"

export const getAllItems = () => {
    return async (dispatch) => {
        dispatch({ type: Actions.SendGetAllItems })

        try {
            const response = await fetch(Urls.Item.GetAll(), { headers: MakeDefaultHeaders() })
            if (!response.ok) throw await response.text();
            const result = await response.json();
            dispatch({ type: Actions.ReceiveGetAllItems, data: result })
        } catch (e) {
            dispatch({ type: Actions.WebRequestFailed, data: e, error: e + "" })
        }
    }
}

export const selectItem = (itemId) => ({ type: Actions.SelectItem, data: itemId })

export const goUp = () => ({ type: Actions.GoUp })