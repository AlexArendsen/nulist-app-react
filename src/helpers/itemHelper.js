const m = (v, d = {}) => v || d;

export const ItemHasProps = (item) => {
    console.error('ItemHasProps is deprecated! Use item.props');
    return !!item.props
}

export const GetItemProps = (item) => {
    console.error('GetItemProps is deprecated! Use item.props');
    return item.props
}

export const GetItemPropOrDefault = (item, prop, defaultValue = '') => m(m(item).props)[prop] || defaultValue

export const GetItemPropAsList = (item, prop) => GetItemPropOrDefault(item, prop).split(',').map(s => s.trim()).filter(s => !!s)

export const FirstItemWithPropValue = (allItems, prop, value) =>
    allItems.filter ? allItems.filter(i => !!i.props).find(i => GetItemPropOrDefault(i, prop) === value) : null

export const ItemsAreEquivalent = (item1, item2) => {
    const [ keys1, keys2 ] = [ item1, item2 ].map(m).map(i => m(i.props)).map(Object.keys)
    if (keys1.some(k => keys2.indexOf(k) === -1 || keys2[k] !== keys1[k])) return false
    return ['title', 'description'].every(field => item1[field] === item2[field])
}

export const ReverseChronological = (items) => {
    const latestDate = (i) => !!m(i.updated_at, {}).getTime ? i.updated_at : i.created_at
    return items.sort((a, b) => latestDate(b) - latestDate(a))
}

export const ObjectAsKeyValuePairs = (obj) => Object.keys(m(obj)).map(key => ({ key, value: obj[key] }))

export const KeyValuePairsAsObject = (pairs) => m(pairs || []).reduce((obj, next) => ({ ...obj, [next.key]: next.value }), {})