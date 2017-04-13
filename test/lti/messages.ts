import * as fs from "fs";
import * as path from "path";
import "mocha";
import {expect} from "chai";
import {SampleData} from "./samples";
import * as message from "../../ims/lti/message";
const CUSTOM_PREFIX = message.Message.CUSTOM_PREFIX;
const EXT_PREFIX = message.Message.EXTENSION_PREFIX;
const SAMPLES_DIR = path.join(__dirname, "samples");

describe("message", () => {
    fs.readdirSync(SAMPLES_DIR).forEach(filename => {
        if (filename.startsWith("index") || !filename.endsWith(".ts")) {
            return;
        }
        filename = filename.replace(".ts", "");
        const data: SampleData = require(path.join(SAMPLES_DIR, filename));
        const body = data.body;
        const msg: message.Message = message.factory(body);
        it(`should properly handle ${filename}`, () => {
            expect(msg instanceof message.Message).to.be.true;
            expect(msg.lti_message_type.length).to.be.gt(0);
            // Make sure custom, extension, and unknown properties are handled correctly
            checkProperty(msg, body, CUSTOM_PREFIX);
            checkProperty(msg, body, EXT_PREFIX);
            checkProperty(msg, body);
        });

        it(`should have valid signature for ${filename}`, () => {
            expect(msg.oauth_consumer_key).eq(body.oauth_consumer_key);
            msg.launch_url = data.registration.launch_url;
            expect(msg.isValidSignature(data.registration.secret)).true;
        });
    });
});

/**
 * Helper to check custom, extension, and unknown properties of messages
 * @param {message.Message} msg  Message instance
 * @param {any}             body Body of received messgage
 * @param {string}          prefix field prefix (used for custom and extension)
 */
function checkProperty(msg: message.Message, body: any, prefix: string = "") {
    const keys = Object.keys(body);
    const key = keys.find((k: string) => {
        if (prefix) {
            return k.startsWith(prefix);
        } else if (k.startsWith(CUSTOM_PREFIX) || k.startsWith(EXT_PREFIX)) {
            return false;
        }
        return !(k in msg); // find "unknown" property
    });
    if (key) {
        // console.log(`${prefix ? prefix.slice(0, -1) : "unknown"} property:`, key);
        expect(msg.get(key)).to.eq(body[key]);
        expect(msg.toJSON()[key]).to.eq(body[key]);
    }
}