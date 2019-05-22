
// Using relative URL, so leaving this blank
const baseUrl = 'https://nulist-api-node-etnpweqvdw.now.sh/api';

export const Urls = {
    Login: () => `${baseUrl}/login`,
    Logout: () => `${baseUrl}/logout`,
    Register: () => `${baseUrl}/register`,
    Item: {
        GetAll: () => `${baseUrl}/items`,
        Create: () => `${baseUrl}/item`,
        Move: () => `${baseUrl}/item`,
        Update: () => `${baseUrl}/item`,
        Delete: (itemId) => `${baseUrl}/item/${itemId}`,
        Check: (itemId) => `${baseUrl}/item/${itemId}/check`,
        Uncheck: (itemId) => `${baseUrl}/item/${itemId}/uncheck`,
    },
    Profile: {
        Me: () => `${baseUrl}/me`
    }
}
