import * as uuid from "uuid";
import {RequestMessage} from "./request_message";
import {required} from "../decorators/field";

export class RegistrationRequest extends RequestMessage {
    @required() reg_key: string = <any>void 0;
    @required() reg_password: string = <any>void 0;
    @required() tc_profile_url: string = <any>void 0;
    @required() launch_presentation_return_url: string = <any>void 0;

    static MESSAGE_TYPE = "ToolProxyRegistrationRequest";

    constructor(defaults: Partial<RegistrationRequest> = {}) {
        super();
        this.lti_message_type = RegistrationRequest.MESSAGE_TYPE;
    }

    generateKeyAndPassword() {
        this.reg_key = uuid.v4();
        this.reg_password = uuid.v4();
    }
}
