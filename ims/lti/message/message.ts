import {field, getFieldOpts, required} from "../decorators/field";
import OAuth from "node-oauth-1.0a-ts";

/**
 * Base Message class
 *
 * NOTE: Decorated properties should be initialized to their default value
 *       even if that value is undefined. Failure to do so results in the
 *       property not being fully defined thus we are unable to retrieve
 *       field options later. Hopefully someday we can figure out a better
 *       way to handle this case so pre-init isn't required during definition.
 */
export class Message {
    static CUSTOM_PREFIX = Object.freeze<string>("custom_");
    static DEFAULT_OAUTH_VERSION = Object.freeze<string>("1.0");
    static DEFAULT_SIGNATURE_METHOD = Object.freeze<string>("HMAC-SHA1");
    static EXTENSION_PREFIX = Object.freeze<string>("ext_");
    static LAUNCH_TARGET_IFRAME = Object.freeze<string>("iframe");
    static LAUNCH_TARGET_WINDOW = Object.freeze<string>("window");
    static MESSAGE_TYPE = Object.freeze<string>("");

    @required() lti_message_type: string = "";
    @required() lti_version: string = "";

    @field() launch_url?: string = void 0;

    // OAuth parameters
    @field() oauth_consumer_key: string = <any>void 0;
    @field() oauth_callback?: string = void 0;
    @field() oauth_nonce?: string = void 0;
    @field() oauth_signature?: string = void 0;
    @field() oauth_signature_method?: string = void 0;
    @field() oauth_timestamp?: number = void 0;
    @field() oauth_token?: string = void 0;
    @field() oauth_verifier?: string = void 0;
    @field() oauth_version?: string = void 0;

    // These fields hold adhoc parameters
    private _custom: any;
    private _ext: any;
    private _unknown: any;
    [key: string]: any;

    constructor() {
        this._custom = {};
        this._ext = {};
        this._unknown = {};
    }

    get customParams() {
        return JSON.parse(JSON.stringify(this._custom));
    }

    get extParams() {
        return JSON.parse(JSON.stringify(this._ext));
    }

    protected _initialize<T extends Message>(this: T, defaults: Partial<T>) {
        const keys = Object.keys(defaults);
        keys.forEach((key: keyof T) => {
            this.set(key, defaults[key]);
        });
    }

    /**
     * Helper method to get a value from the appropriate value map.
     * @type {T}
     */
    get<T extends Message>(this: T, key: string, defaultValue: any = void 0) {
        const keys = Object.keys(this);
        if (keys.indexOf(key) > -1) {
            return valueOrDefault(this[key], defaultValue);
        }
        if (key.startsWith(Message.EXTENSION_PREFIX)) {
            return valueOrDefault(this._ext[key], defaultValue);
        }
        if (key.startsWith(Message.CUSTOM_PREFIX)) {
            return valueOrDefault(this._custom[key], defaultValue);
        } else {
            return valueOrDefault(this._unknown[key], defaultValue);
        }
    }

    /**
     * Helper method used to set values in the appropriate value map.
     * @type {T}
     */
    set<T extends Message>(this: T, key: string, value: any): T {
        const keys = Object.keys(this);
        if (keys.indexOf(key) > -1) {
            const opts = getFieldOpts(this, key);
            if (opts && opts.required && value === void 0) {
                throw new Error(`${key} is a required property.`);
            }
            this[key] = value;
        } else if (key.startsWith(Message.EXTENSION_PREFIX)) {
            this._ext[key] = value;
        } else if (key.startsWith(Message.CUSTOM_PREFIX)) {
            this._custom[key] = value;
        } else {
            this._unknown[key] = value;
        }
        return this;
    }

    sign(secret: string, method: string = "POST") {
        if (this.oauth_signature) { return this; }
        const oauth = new OAuth({
            consumer: {public: this.oauth_consumer_key, secret: secret},
            signature_method: <any>(
                this.oauth_signature_method || Message.DEFAULT_SIGNATURE_METHOD
            ),
            version: this.oauth_version || Message.DEFAULT_OAUTH_VERSION,
        });
        if (!this.launch_url) {
            throw new Error("Must specify 'launch_url' before signing.");
        }
        if (!this.oauth_callback) { this.oauth_callback = "about:blank"; }
        const oauthData = oauth.authorize({
            method: method,
            url: this.launch_url,
            data: this.toJSON(),
        });
        this.oauth_nonce = oauthData.oauth_nonce;
        this.oauth_signature = oauthData.oauth_signature;
        this.oauth_signature_method = oauthData.oauth_signature_method;
        this.oauth_timestamp = oauthData.oauth_timestamp;
        return this;
    }

    isValidSignature(secret: string, method: string = "POST") {
        const oauth = new OAuth({
            consumer: {public: this.oauth_consumer_key, secret: secret},
            signature_method: <any>this.oauth_signature_method,
            version: this.oauth_version,
        });
        if (!this.launch_url) {
            throw new Error("Must specify 'launch_url' before validating.");
        }
        const signature = oauth.getSignature({
            method: method,
            url: this.launch_url,
        }, "", this.toJSON());
        return this.oauth_signature == signature;
    }

    isValid<T extends Message>(this: T, validationOpts: ValidationOpts) {
        // first check to verify that all fields required by the LTI spec are present
        const keys = Object.keys(this);
        let obj: any = {};
        keys.forEach((key: keyof T) => {
            // The launch url should not be part of a POST body
            if (key === "launch_url") { return; }
            const opt = getFieldOpts(this, key);
            if (opt && opt.required && this[key] === void 0) {
                throw new Error(`${key} is a required property.`);
            }
        });

        // next verify that the required fields from validationOpts are present
        if (validationOpts.required) {
            validationOpts.required.forEach((key) => {
                if (this[key] === void 0) {
                    throw new Error(`${key} is a required property.`);
                }
            });
        }

        // finally verify that the match fields from validationOpts meet the requirements
        if (validationOpts.match) {
            const match = validationOpts.match;
            Object.keys(match).forEach( (key) => {
                if (typeof match[key] == 'string') {
                    if (this[key] !== match[key]) {
                        throw Error(`LTI option ${key} must be '${match[key]}'`);
                    }
                } else if (match[key] instanceof RegExp) {
                    const re: RegExp = <any>match[key];
                    if (!re.test(this[key])) {
                        throw Error(`LTI option ${key} must match regular expression /${match[key]}/`);
                    }
                } else {
                    throw Error(`invalid validation value for ${key}`);
                }
            });
        }

        return true;
    }

    toJSON<T extends Message>(this: T): any {
        const keys = Object.keys(this);
        let obj: any = {};
        keys.forEach((key: keyof T) => {
            // The launch url should not be part of a POST body
            if (key === "launch_url") { return; }
            const opt = getFieldOpts(this, key);
            if (opt && opt.required && this[key] === void 0) {
                throw new Error(`${key} is a required property.`);
            }
            if (key.startsWith('_')) {
                Object.assign(obj, this[key]);
            } else if (this[key] !== void 0) {
                obj[key] = this[key];
            }
        });
        return obj;
    }
}

/**
 * Utility function to return a `value` or `defaultValue` if value is undefined.
 * @param {any} value        [description]
 * @param {any} defaultValue [description]
 */
function valueOrDefault(value: any, defaultValue: any) {
    if (typeof value == "undefined") {
        return defaultValue;
    }
    return value;
}

export interface ValidationOpts {
    required?: string[];
    match?: {[key: string]: string | RegExp};
}
