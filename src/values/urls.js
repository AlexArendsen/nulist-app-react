//const baseUrl = 'https://nulist-api-node-kqjkqvukad.now.sh/api';
const baseUrl = 'https://nulist.app/api';

export const Urls = {
    Login: () => `${baseUrl}/login`,
    Logout: () => `${baseUrl}/logout`,
    Register: () => `${baseUrl}/register`,
    Item: {
        GetAll: () => `${baseUrl}/items`,
        Create: () => `${baseUrl}/item`,
        Move: () => `${baseUrl}/item`,
        Update: () => `${baseUrl}/item`,
        MoveMany: () => `${baseUrl}/items/move`,
        Delete: (itemId) => `${baseUrl}/item/${itemId}`,
        DeleteMany: () => `${baseUrl}/items`,
        Check: (itemId) => `${baseUrl}/item/${itemId}/check`,
        Uncheck: (itemId) => `${baseUrl}/item/${itemId}/uncheck`,
    },
    Profile: {
        Me: () => `${baseUrl}/me`
    }
}
