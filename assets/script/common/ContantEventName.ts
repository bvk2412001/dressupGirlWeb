import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ContantEventName')
export class ContantEventName extends Component {
    public static client_login = "client_login"
    public static server_login = "server_login"

    public static client_get_list_chat = "client_get_list_chat"
    public static server_send_list_chat = "server_send_list_chat"

    public static client_chat_message = "client_chat_message"
    public static server_chat_message = "server_chat_message"

    public static client_feedback_game = "client_feedback_game"

    public static client_send_base_64 = "client_send_base_64"
    public static server_send_url = "server_send_url"

    public static client_update_profile = "client_update_profile"
    public static server_update_profile = "server_update_profile"
    
}


