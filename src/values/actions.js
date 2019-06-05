export const Actions = {
    SetConfig: 'SET_CONFIG',
    AppReady: 'APP_READY',

    SendLogin: 'SEND_LOGIN', ReceiveLogin: 'RECV_LOGIN',
    SendRegister: 'SEND_REGSITER', ReceiveRegister: 'RECV_REGSITER',
    SendGetAllItems: 'SEND_ALL_ITEMS', ReceiveGetAllItems: 'RECV_ALL_ITEMS',
    SendCreateItem: 'SEND_CREATE_ITEM', ReceiveCreateItem: 'RECV_CREATE_ITEM',
    SendUpdateItem: 'SEND_UPDATE_ITEM', ReceiveUpdateItem: 'RECV_UPDATE_ITEM',
    SendMoveItem: 'SEND_MOVE_ITEM', ReceiveMoveItem: 'RECV_MOVE_ITEM',
    SendMoveManyItems: 'SEND_MOVE_MANY_ITEMS', ReceiveMoveManyItems: 'RECV_MOVE_MANY_ITEMS',
    SendDeleteItem: 'SEND_DELETE_ITEM', ReceiveDeleteItem: 'RECV_DELETE_ITEM',
    SendDeleteManyItems: 'SEND_DELETE_MANY_ITEMS', ReceiveDeleteManyItems: 'RECV_DELETE_MANY_ITEMS',
    SendCheckItem: 'SEND_CHECK_ITEM', ReceiveCheckItem: 'RECV_CHECK_ITEM',
    SendUncheckItem: 'SEND_UNCHECK_ITEM', ReceiveUncheckItem: 'RECV_UNCHECK_ITEM',
    SendGetProfile: 'SEND_GET_PROFILE', ReceiveGetProfile: 'RECV_GET_PROFILE',
    Logout: 'LOGOUT',

    WebRequestFailed: 'WEB_OOPS', ClientError: 'WOT_U_DOIN',
    ClearMajorError: 'YA_DUN_GOOFED', ClearMinorError: 'NO_WORRIES',

    ExpandItem: 'ITEM_EXPAND', CollapseItem: 'ITEM_COLLAPSE',

    SelectItem: 'SELECT_ITEM',
    GoUp: 'UP'
}