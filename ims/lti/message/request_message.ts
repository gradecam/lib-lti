import {Message} from "./message";
import {field, recommended} from "../decorators/field";

export class RequestMessage  extends Message {
    @recommended() user_id?: string = void 0;
    @recommended() roles?: string = void 0; // comma separated list of LIS Context Roles
    @recommended() launch_presentation_document_target?: string = void 0;
    @recommended() launch_presentation_width?: number = void 0;
    @recommended() launch_presentation_height?: number = void 0;

    @field() launch_presentation_css_url?: string = void 0;
    @field() launch_presentation_locale?: string = void 0;
}
