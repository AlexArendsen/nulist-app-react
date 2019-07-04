const m = (v, d = {}) => v || d;

export const ItemHasProps = (item) => m(m(item).description, ' ')[0] === '-'

export const GetItemProps = (item) => m(m(item).description, '').split('\n')
    .filter(line => m(line, ' ')[0] === '-')
    .map(line => line.replace(/^-\s+/, '').split(':').map(op => op.trim()))
    .reduce((props, next) => ({ ...props, [next[0]]: next[1] }), {})

export const GetItemPropOrDefault = (item, prop, defaultValue = '') => m(GetItemProps(item), {})[prop] || defaultValue

export const GetItemPropAsList = (item, prop) => GetItemPropOrDefault(item, prop).split(',').map(s => s.trim()).filter(s => !!s)

export const FirstItemWithPropValue = (allItems, prop, value) =>
    allItems.filter ? allItems.filter(ItemHasProps).find(i => GetItemProps(i)[prop] === value) : null