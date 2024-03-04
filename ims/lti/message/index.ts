import {BasicLTILaunchRequest} from "./basic_lti_launch_request";
import { ContentItemSelectionRequest } from "./content_item_selection_request";
import {Message} from "./message";
import {RegistrationRequest} from "./registration_request";
import {ToolProxyReregistrationRequest} from "./tool_proxy_reregistration_request";

export {
    BasicLTILaunchRequest,
    Message,
    RegistrationRequest,
    ToolProxyReregistrationRequest,
};

export function factory(message: any) {
    switch (message.lti_message_type) {
        case BasicLTILaunchRequest.MESSAGE_TYPE:
            return new BasicLTILaunchRequest(message);
        case ContentItemSelectionRequest.MESSAGE_TYPE:
            return new ContentItemSelectionRequest(message);
        case RegistrationRequest.MESSAGE_TYPE:
            return new RegistrationRequest(message);
        case ToolProxyReregistrationRequest.MESSAGE_TYPE:
            return new ToolProxyReregistrationRequest(message);
        default:
            return unknownMessageType(message.lti_message_type);
    }
}

export default factory; // tslint:disable-line

function unknownMessageType(type: string): never {
    throw new Error(`Unknown Message Type: ${type}`);
}
