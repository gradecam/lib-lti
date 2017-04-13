import * as uuid from "uuid";
import {RequestMessage} from "./request_message";
import {field, recommended, required} from "../decorators/field";

export class ToolProxyReregistrationRequest extends RequestMessage {
    @required() tc_profile_url: string = <any>void 0;
    @required() launch_presentation_return_url: string = <any>void 0;

    static MESSAGE_TYPE = "ToolProxyReregistrationRequest";

    constructor(defaults: Partial<ToolProxyReregistrationRequest> = {}) {
        super();
        this.lti_message_type = ToolProxyReregistrationRequest.MESSAGE_TYPE;
    }
}
