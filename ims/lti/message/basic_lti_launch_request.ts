import {RequestMessage} from './request_message';
import {deprecated, field, recommended, required} from "../decorators/field";

export class BasicLTILaunchRequest extends RequestMessage {
    @required() resource_link_id: string = <any>void 0;
    @recommended() context_id?: string = void 0;
    @recommended() launch_presentation_return_url?: string = void 0;
    @recommended() tool_consumer_instance_guid?: string = void 0;

    @field() context_type?: string = void 0;
    @field() role_scope_mentor?: string = void 0;

    @deprecated() context_title?: string = void 0;
    @deprecated() context_label?: string = void 0;
    @deprecated() resource_link_title?: string = void 0;
    @deprecated() resource_link_description?: string = void 0;
    @deprecated() lis_person_name_given?: string = void 0;
    @deprecated() lis_person_name_family?: string = void 0;
    @deprecated() lis_person_name_full?: string = void 0;
    @deprecated() lis_person_contact_email_primary?: string = void 0;
    @deprecated() user_image?: string = void 0;
    @deprecated() lis_person_sourcedid?: string = void 0;
    @deprecated() lis_course_offering_sourcedid?: string = void 0;
    @deprecated() lis_course_section_sourcedid?: string = void 0;
    @deprecated() tool_consumer_info_product_family_code?: string = void 0;
    @deprecated() tool_consumer_info_product_family_version?: string = void 0;
    @deprecated() tool_consumer_instance_name?: string = void 0;
    @deprecated() tool_consumer_instance_description?: string = void 0;
    @deprecated() tool_consumer_instance_url?: string = void 0;
    @deprecated() tool_consumer_instance_contact_email?: string = void 0;
    @deprecated() tool_consumer_info_version?: string = void 0;

    static MESSAGE_TYPE = "basic-lti-launch-request";

    constructor(defaults: Partial<BasicLTILaunchRequest> = {}) {
        super();
        this._initialize(defaults);
        this.lti_message_type = BasicLTILaunchRequest.MESSAGE_TYPE;
    }
}
