import { toast } from "react-toastify";

export function receiveResponse(response) {
    if (!response) return;

    const {errors=[], logs=[], data} = response;

    if (errors.length && errors.every(ele => typeof ele === "string")) {
        toast.error(errors.join('\n'));
    } else if (logs.length && logs.every(ele => typeof ele === "string")) {
        toast.success(logs.join('\n'));
    }
}

export function receiveLogs(logs) {
    const response = {};
    response.logs = flattenMessage(logs);
    receiveResponse(response);
}

export function receiveErrors(errors) {
    const response = {};
    response.errors = flattenMessage(errors);
    receiveResponse(response);
}

function flattenMessage(message) {
    const result = [];
    
    if (Array.isArray(message)) {
        for (let msg of message) result.push(...flattenMessage(msg));
    } else if (typeof message === 'string') {
        result.push(message);
    }
    
    return result;
}