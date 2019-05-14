import { Views } from "../../values/view";
import { Actions } from "../../values/actions";
import { FormStates } from "../../values/form-states";
import { Storage } from "../../values/storage";

const defaultState = {
    items: [],
    selectedItem: null,
    view: Views.Initializing,
    login: { username: null, password: null, status: FormStates.Ready },
    userToken: localStorage.getItem(Storage.UserTokenKey)
}

const reducers = {
    [Actions.AppReady]: (state, action) => ({
        ...state,
        view: (!!localStorage.getItem(Storage.UserTokenKey)) ? Views.Item : Views.Login
    }),

    [Actions.SendLogin]: (state, action) => ({ ...state, login: { ...state.login, status: FormStates.Submitting } }),
    [Actions.ReceiveLogin]: (state, action) => ({
        ...state,
        login: { ...state.login, status: FormStates.Ready },
        userToken: action.data,
        view: Views.Item
    }),

    [Actions.Logout]: (state, action) => ({ ...state, view: Views.Login, userToken: null }),

    [Actions.ReceiveGetAllItems]: (state, action) => {
        const itemDictionary = {}
        const parentDictionary = {}
        action.data.forEach(i => {
            itemDictionary[i._id] = i;
            if (!parentDictionary[i.parent_id]) parentDictionary[i.parent_id] = []
            parentDictionary[i.parent_id].push(i)
        });
        return { ...state, items: itemDictionary, parents: parentDictionary}
    },

    [Actions.WebRequestFailed]: (state, action) => ({ ...state,  }),

    [Actions.SelectItem]: (state, action) => ({ ...state, selectedItem: state.items[action.data] }),
    [Actions.GoUp]: (state, action) => ({ ...state, selectedItem: state.items[state.selectedItem.parent_id] }),
}

export const rootReducer = (state = defaultState, action) => {
    const noop = (s, a) => s;
    return (reducers[action.type] || noop)(state, action);
}