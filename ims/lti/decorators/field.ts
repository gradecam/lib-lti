import "reflect-metadata";

export type FieldStatus = "deprecated" | "recommended";
export interface FieldOpts {
    prefix?: string; // NOTE: intended to be used with fields of type `any`
    required?: boolean;
    status?: FieldStatus;
}

const fieldOptMetadataKey = Symbol("custom:fo");

export function getFieldOpts(target: any, key: string): FieldOpts | void {
    return Reflect.getMetadata(fieldOptMetadataKey, target, key);
}

/**
 * Use this as a helper to make new field decorators
 * @param {FieldOpts} defaultOpts defaults for the field decorator
 */
function makeFieldDecorator(defaultOpts: FieldOpts) {
    function FieldDecorator(opts?: FieldOpts): PropertyDecorator {
        const fieldOpts: FieldOpts = Object.assign({
            required: false,
        }, defaultOpts, opts);
        return Reflect.metadata(fieldOptMetadataKey, fieldOpts);
    }
    return FieldDecorator;
}

export const deprecated = makeFieldDecorator({status: "deprecated"});
export const field = makeFieldDecorator({});
export const recommended = makeFieldDecorator({status: "recommended"});
export const required = makeFieldDecorator({required: true});
