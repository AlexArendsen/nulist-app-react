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

// Add in by app
// saving: bool
// descendents: number
// completed: number

const Send = async (verb, dispatch, url, successAction = undefined, body = {}, failureAction = Actions.WebRequestFailed) => {
    const options = {
        headers: MakeDefaultHeaders(),
        method: verb
    }
    if (verb !== 'GET') options.body = (typeof(body) === 'string') ? body : JSON.stringify(body);
    try {
        const response = await fetch(url, options)
        if (!response.ok) throw await response.text();
        const result = await response.json();
        if (!!successAction) dispatch({ type: successAction, data: result })
        return result
    } catch(e) {
        console.error(e)
        dispatch({ type: failureAction, data: e, error: e + "" })
    }
}

const Get = async (dispatch, url, successAction, body = '', failureAction = Actions.WebRequestFailed) => Send('GET', dispatch, url, successAction, body, failureAction);
const Post = async (dispatch, url, successAction, body = '', failureAction = Actions.WebRequestFailed) => Send('POST', dispatch, url, successAction, body, failureAction);
const Put = async (dispatch, url, successAction, body = '', failureAction = Actions.WebRequestFailed) => Send('PUT', dispatch, url, successAction, body, failureAction);
const Delete = async (dispatch, url, successAction, body = '', failureAction = Actions.WebRequestFailed) => Send('DELETE', dispatch, url, successAction, body, failureAction);

let NewItemIdSalt = 0

export const getAllItems = () => {
    return async (dispatch) => {
        const tmpKey = 'nulist-temp-item-list'
        const bypass = true
        if (!bypass && localStorage.getItem(tmpKey)) {
            const items = JSON.parse(localStorage.getItem(tmpKey))
            dispatch({ type: Actions.ReceiveGetAllItems, data: items})
            return
        }
        dispatch({ type: Actions.SendGetAllItems })
        const result = await Get(dispatch, Urls.Item.GetAll(), Actions.ReceiveGetAllItems);
        localStorage.setItem(tmpKey, JSON.stringify(result))
    }
}

export const checkItem = (itemId) => {
    return async (dispatch) => {
        dispatch({ type: Actions.SendCheckItem, data: itemId })
        await Put(dispatch, Urls.Item.Check(itemId), Actions.ReceiveCheckItem)
    }
}

export const uncheckItem = (itemId) => {
    return async (dispatch) => {
        dispatch({ type: Actions.SendUncheckItem, data: itemId })
        await Put(dispatch, Urls.Item.Uncheck(itemId), Actions.ReceiveUncheckItem)
    }
}

export const deleteItem = (itemId) => {
    return async (dispatch) => {
        dispatch({ type: Actions.SendDeleteItem, data: itemId })
        await Delete(dispatch, Urls.Item.Delete(itemId), Actions.ReceiveDeleteItem)
    }
}

export const deleteManyItems = (itemIds) => {
    return async (dispatch) => {
        dispatch({ type: Actions.SendDeleteManyItems, data: itemIds })
        await Delete(dispatch, Urls.Item.DeleteMany(), Actions.ReceiveDeleteManyItems, { ids: itemIds })
    }
}

export const moveItem = (item, newParentId) => {
    if (item._id === newParentId) return { type: Actions.ClientError, data: 'Item cannot be a parent of itself' }
    return async (dispatch) => {
        dispatch({ type: Actions.SendMoveItem, data: item._id })
        await Put(dispatch, Urls.Item.Move(item._id), Actions.ReceiveMoveItem, { ...item, parent_id: newParentId })
    }
}

export const moveManyItems = (itemIds, newParentId) => {
    return async (dispatch) => {
        dispatch({ type: Actions.SendMoveManyItems, data: itemIds })
        await Put(dispatch, Urls.Item.MoveMany(), Actions.ReceiveMoveManyItems, { ids: itemIds, new_parent: newParentId })
    }
}


export const updateItem = (item) => {
    return async (dispatch) => {
        dispatch({ type: Actions.SendUpdateItem, data: item._id })
        await Put(dispatch, Urls.Item.Update(item._id), Actions.ReceiveUpdateItem, item)
    }
}

export const addItem = (title, parent_id) => {
    return async (dispatch) => {

        const tmpId = `tmp_${new Date().getTime()}-${++NewItemIdSalt}`
        const newItem = { title: title, parent_id, _id: tmpId }

        dispatch({ type: Actions.SendCreateItem, data: newItem })
        const result = await Post(dispatch, Urls.Item.Create(), undefined, newItem)

        dispatch({ type: Actions.ReceiveCreateItem, data: result, tmpId: tmpId })
    }
}
