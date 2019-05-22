import { Actions } from "../../values/actions";
import { FormStates } from "../../values/form-states";
import { Storage } from "../../values/storage";
import { DataStates } from "../../values/data-states";

const defaultState = {
    items: DataStates.Unloaded,
    selectedItem: null,
    login: { status: FormStates.Ready },
    profile: DataStates.Unloaded,
    userToken: localStorage.getItem(Storage.UserTokenKey)
}

const reducers = {
    [Actions.SetConfig]: (state, action) => ({ ...state, config: { ...state.config, ...action.data } }),
    [Actions.AppReady]: (state, action) => ({ ...state, }),

    [Actions.SendLogin]: (state, action) => ({ ...state, login: { ...state.login, status: FormStates.Submitting } }),
    [Actions.ReceiveLogin]: (state, action) => ({
        ...state,
        login: { ...state.login, status: FormStates.Ready },
        userToken: action.data
    }),

    [Actions.Logout]: (state, action) => ({ ...state, ...defaultState }),

    [Actions.SendGetAllItems]: (state, actions) => ({ ...state, items: DataStates.Loading }),
    [Actions.ReceiveGetAllItems]: (state, action) => {
        const casted = withStats(action.data).map((i, idx) => ({
            ...i,
            index: idx,
            saving: false,
            expanded: false,
            created_at: i.created_at ? new Date(i.created_at) : undefined
        }))

        return { ...state, items: casted }
    },

    [Actions.WebRequestFailed]: (state, action) => ({ ...state, login: { status: FormStates.Ready } }),

    [Actions.SendCheckItem]: (state, action) => updateItem(state, action.data, { saving: true }),
    [Actions.SendUncheckItem]: (state, action) => updateItem(state, action.data, { saving: true }),

    [Actions.ReceiveCheckItem]: (state, action) => updateItem(state, action.data._id, { saving: false, checked: true }),
    [Actions.ReceiveUncheckItem]: (state, action) => updateItem(state, action.data._id, { saving: false, checked: false }),

    [Actions.SendCreateItem]: (state, action) => addItem(state, action.data),
    [Actions.ReceiveCreateItem]: (state, action) => updateItem(state, action.tmpId, { ...action.data, saving: false }),

    [Actions.SendDeleteItem]: (state, action) => updateItem(state, action.data, { saving: true }),
    [Actions.ReceiveDeleteItem]: (state, action) => removeItem(state, action.data),

    [Actions.SendMoveItem]: (state, action) => updateItem(state, action.data, { saving: true }),
    [Actions.ReceiveMoveItem]: (state, action) => updateItem(state, action.data._id, { ...action.data, saving: false }),

    [Actions.SendUpdateItem]: (state, action) => updateItem(state, action.data, { saving: true }),
    [Actions.ReceiveUpdateItem]: (state, action) => updateItem(state, action.data._id, { ...action.data, saving: false }),

    [Actions.SendGetProfile]: (state, action) => ({ ...state, profile: DataStates.Loading }),
    [Actions.ReceiveGetProfile]: (state, action) => ({ ...state, profile: action.data }),

    [Actions.ExpandItem]: (state, action) => updateItem(state, action.data._id, { expanded: true }),
    [Actions.CollapseItem]: (state, action) => updateItem(state, action.data._id, { expanded: false })

}

const updateItem = (state, id, item) => ({
        ...state, items: withStats([ ...state.items.filter(i => i._id !== id), { ...state.items.find(i => i._id === id), ...item } ])
    })

const addItem = (state, item) => ({
        ...state, items: withStats([ ...state.items, { ...item, index: state.items.length, saving: true } ])
    })

const removeItem = (state, item) => ({
        ...state, items: withStats([ ...state.items.filter(i => i._id !== item._id) ])
    })

const withStats = (items = []) => {

    const start = new Date();

    const statCache = {}
    const parents = {}
    items.forEach(i => {
        if(!parents[i.parent_id]) { parents[i.parent_id] = [] }
        parents[i.parent_id].push(i)
    });

    const sum = (nums) => nums.reduce((sum, next) => sum + next);
    const statsFor = (item) => {
        if (statCache[item._id]) return statCache[item._id]
        let output = {}
        const children = parents[item._id]
        if (!children) output = { descendants: 0, completed: 0 }
        else {
            const childStats = children.filter(c => !!c).map(c => ({ checked: c.checked, ...statsFor(c) }))
            output = {
                descendants: sum(childStats.map(c => c.descendants > 0 ? c.descendants : 1 )),
                completed: sum(childStats.map(c => c.checked ? (c.descendants || 1) : c.completed ))
            }
        }
        statCache[item._id] = output
        return output
    }

    try {
        const out = items.map(i => ({ ...i, ...statsFor(i) }));

        const end = new Date();

        console.log(`Calculated stats for ${items.length} items in ${end.getTime() - start.getTime()}ms`);

        return out
    } catch (e) { }

}

export const rootReducer = (state = defaultState, action) => {
    const noop = (s, a) => s;
    return (reducers[action.type] || noop)(state, action);
}