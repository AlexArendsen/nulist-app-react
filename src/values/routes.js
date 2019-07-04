export const Routes = {
    Login: () => `/`,
    Items: () => `/?view=items`,
    Item: (itemId = ':itemId') => itemId === null ? `/?view=items` : `/?view=items&item=${itemId}`,
    Outline: () => `/?view=outline`,
    Search: () => `/?view=search`
}