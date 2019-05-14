
// Using relative URL, so leaving this blank
//const baseUrl = 'https://nulist-api-node-lgrzbjukna.now.sh/api';
const baseUrl = 'http://localhost:8080/api';

export const Urls = {
    Login: () => `${baseUrl}/login`,
    Logout: () => `${baseUrl}/logout`,
    Register: () => `${baseUrl}/register`,
    Item: {
        GetAll: () => `${baseUrl}/items`,
        Create: () => `${baseUrl}/item`,
        Update: () => `${baseUrl}/item`,
        Delete: (itemId) => `${baseUrl}/item/${itemId}`,
        Check: (itemId) => `${baseUrl}/item/${itemId}/check`,
        Uncheck: (itemId) => `${baseUrl}/item/${itemId}/uncheck`,
    }
}

// Auth / Reg
export const LoginUrl = () => `${baseUrl}/login`;
export const LogoutUrl = () => `${baseUrl}/logout`;
export const RegisterUrl = () => `${baseUrl}/register`;

// Items
export const AllItemsUrl = () => `${baseUrl}/items`;
export const CreateItemUrl = () => `${baseUrl}/login`;