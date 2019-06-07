import { Actions } from "../../values/actions";
import { FormStates } from "../../values/form-states";
import { Storage } from "../../values/storage";
import { DataStates } from "../../values/data-states";
import { StaticConfigValues } from "../../values/static-config";

const defaultState = {
    items: DataStates.Unloaded,
    error: {},
    recentItemIds: [],
    selectedItem: null,
    login: { status: FormStates.Ready },
    profile: DataStates.Unloaded,
    userToken: localStorage.getItem(Storage.UserTokenKey),
    config: StaticConfigValues
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
        const casted = withStats(withoutOrphans(action.data)).map((i, idx) => ({
            ...i,
            index: idx,
            saving: false,
            expanded: false,
            created_at: i.created_at ? new Date(i.created_at) : undefined,
            updated_at: i.updated_at ? new Date(i.updated_at) : undefined
        }))

        const mostRecentDate = (item) => item.updated_at || item.created_at
        const recent = casted.filter(i => !!i.created_at)
            .sort((a, b) => mostRecentDate(b) - mostRecentDate(a)).slice(0, 20).map(i => i._id)

        return { ...state, items: casted, recentItemIds: recent}
    },

    [Actions.WebRequestFailed]: (state, action) => ({ ...state, error: { ...state.error, major: action.data.toString() } }),
    [Actions.ClientError]: (state, action) => ({ ...state, error: { ...state.error, minor: action.data } }),

    [Actions.ClearMajorError]: (state, action) => ({ ...state, error: { ...state.error, major: undefined } }),
    [Actions.ClearMinorError]: (state, action) => ({ ...state, error: { ...state.error, minor: undefined } }),

    [Actions.SendCheckItem]: (state, action) => updateItem(state, action.data, { saving: true }),
    [Actions.SendUncheckItem]: (state, action) => updateItem(state, action.data, { saving: true }),

    [Actions.ReceiveCheckItem]: (state, action) => updateItem(state, action.data._id, { saving: false, checked: true }),
    [Actions.ReceiveUncheckItem]: (state, action) => updateItem(state, action.data._id, { saving: false, checked: false }),

    [Actions.SendCreateItem]: (state, action) => addItem(state, action.data),
    [Actions.ReceiveCreateItem]: (state, action) => updateItem(state, action.tmpId, { ...action.data, saving: false }),

    [Actions.SendDeleteItem]: (state, action) => updateItem(state, action.data, { saving: true }),
    [Actions.ReceiveDeleteItem]: (state, action) => removeItem(state, action.data),

    [Actions.SendDeleteManyItems]: (state, action) => updateManyItems(state, action.data.map(id => ({ _id: id, saving: true }))),
    [Actions.ReceiveDeleteManyItems]: (state, action) => removeManyItems(state, action.data.deleted),

    [Actions.SendMoveItem]: (state, action) => updateItem(state, action.data, { saving: true }),
    [Actions.ReceiveMoveItem]: (state, action) => updateItem({ ...state, ...pushRecentItem(state, action.data.parent_id) }, action.data._id, { ...action.data, saving: false }),

    [Actions.SendMoveManyItems]: (state, action) => updateManyItems(state, action.data.map(id => ({ _id: id, saving: true }))),
    [Actions.ReceiveMoveManyItems]: (state, action) => updateManyItems(state, action.data.moved.map(id => ({ _id: id, saving: false, parent_id: action.data.to }))),

    [Actions.SendUpdateItem]: (state, action) => updateItem(state, action.data, { saving: true }),
    [Actions.ReceiveUpdateItem]: (state, action) => updateItem(state, action.data._id, { ...action.data, saving: false }),

    [Actions.SendGetProfile]: (state, action) => ({ ...state, profile: DataStates.Loading }),
    [Actions.ReceiveGetProfile]: (state, action) => ({ ...state, profile: action.data }),

    [Actions.ExpandItem]: (state, action) => updateItem(state, action.data._id, { expanded: true }),
    [Actions.CollapseItem]: (state, action) => updateItem(state, action.data._id, { expanded: false }),

    [Actions.SelectItem]: (state, action) => ({ ...state, selectedItem: action.data._id })

}

const updateItem = (state, id, item) => {
    
    return { ...state, ...pushRecentItem(state, item._id), items: withStats([ ...state.items.filter(i => i._id !== id), { ...state.items.find(i => i._id === id), ...item } ]) }
}

const updateManyItems = (state, items) => {
        const ids = items.map(i => i._id)
        const unchangedItems = state.items.filter(i => ids.indexOf(i._id) < 0)
        const updatedItems = items.map(i => ({ ...state.items.find(t => t._id === i._id), ...i }))
        return { ...state, items: withStats([ ...unchangedItems, ...updatedItems ]) }
    }

const addItem = (state, item) => {
    return { ...state, items: withStats([ ...state.items, { ...item, index: state.items.length, saving: true } ]) }
}

const removeItem = (state, item) => {
    return { ...state, ...removeRecentItems(state, [item._id]), items: withStats([ ...state.items.filter(i => i._id !== item._id) ]) }
}

const removeManyItems = (state, itemIds) => {
    return { ...state, ...removeRecentItems(state, itemIds), items: withStats([ ...state.items.filter(i => itemIds.indexOf(i._id) < 0) ]) }
}

const pushRecentItem = (state, itemId) => ({
    recentItemIds: [ itemId, ...(state.recentItemIds || []).filter(r => r !== itemId) ]
})

const removeRecentItems = (state, itemIds) => ({
    recentItemIds: [ ...state.recentItemIds.filter(r => itemIds.indexOf(r) < 0) ]
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

const withoutOrphans = (items) => {
    const start = new Date()
    const found = {}
    const markAndMore = (subset) => {
        if (!subset.length) return
        const lookup = {}
        subset.forEach(i => found[i._id] = lookup[i._id] = true)
        markAndMore(items.filter(i => !!lookup[i.parent_id]))
    }
    markAndMore(items.filter(i => !i.parent_id))

    const end = new Date()
    console.log(`Found ${Object.keys(found).length} non-orphans (of ${items.length} total items) in ${end - start}ms`)
    return items.filter(i => !!found[i._id])
}

export const rootReducer = (state = defaultState, action) => {
    const noop = (s, a) => s;
    return (reducers[action.type] || noop)(state, action);
}