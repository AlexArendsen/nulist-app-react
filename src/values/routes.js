export const Routes = {
    Login: () => `/login`,
    Items: () => `/items`,
    Item: (itemId = ':itemId') => itemId === null ? `/items` : `/item/${itemId}`,
    Outline: () => `/outline`
}