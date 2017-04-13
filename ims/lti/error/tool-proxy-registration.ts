export class ToolProxyRegistrationError extends Error {
    public status: number;
    public body: any;

    constructor(status: number, body: any = null) {
        const message = `Unexpected response for tool proxy registration.\n\
HTTP Response Status: ${status}\n\
HTTP Response Body: ${JSON.stringify(body || '')}`;
        super(message);
        this.status = status;
        this.body = body;
    }
}
