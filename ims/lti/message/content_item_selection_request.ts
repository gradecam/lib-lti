import {RequestMessage} from './request_message';
import {deprecated, field, recommended, required} from "../decorators/field";

export class ContentItemSelectionRequest extends RequestMessage {
    @required() accept_media_types: string = <any>void 0;
    @required() accept_presentation_document_targets: string = <any>void 0;
    @required() content_item_return_url: string = <any>void 0;

    @recommended() accept_unsigned: string = <any>void 0;
    @recommended() accept_multiple: string = <any>void 0;
    @recommended() accept_copy_advice: string = <any>void 0;
    @recommended() auto_create: string = <any>void 0;
    @recommended() title: string = <any>void 0;
    @recommended() text: string = <any>void 0;
    @recommended() data: string = <any>void 0;

    static MESSAGE_TYPE = "ContentItemSelectionRequest";

    constructor(defaults: Partial<ContentItemSelectionRequest> = {}) {
        super();
        this._initialize(defaults);
        this.lti_message_type = ContentItemSelectionRequest.MESSAGE_TYPE;
    }
}
