/*!
Copyright (C) 2020 Liberty Infrasystems (https://liberty.io).
*/
/* eslint-disable no-console, class-methods-use-this, max-classes-per-file */

import axios from 'axios';

axios.defaults.withCredentials = true; // required for browser to send cookies in a cross-origin request (e.g. website at app.example.com using this client sdk to make a request to track.example.com)

async function getJson(path, query = null, { requestHeaders = {} } = {}) {
    const response = await axios.get(path, {
        headers: {
            Accept: 'application/json',
            ...requestHeaders,
        },
        params: query,
    });
    return response.data;
}

async function postJson(path, request, query = null, { requestHeaders = {} } = {}) {
    const response = await axios.post(path, request ? JSON.stringify(request) : null, {
        headers: {
            'Content-Type': 'application/json',
            ...requestHeaders,
        },
        params: query,
    });
    return response.data;
}

function getEventUriBrowser() {
    return window.location.href;
}

class TrackClient {
    constructor(context = { serviceEndpoint: null, requestHeaders: {}, getEventUri: null }) {
        this.url = context.serviceEndpoint;
        if (context.requestHeaders) {
            this.requestHeaders = context.requestHeaders;
        } else {
            this.requestHeaders = {};
        }
        if (context.getEventUri && typeof context.getEventUri === 'function') {
            this.getEventUri = context.getEventUri;
        } else {
            this.getEventUri = getEventUriBrowser;
        }
        console.log(`track-client-sdk: service endpoint ${this.url}`);
    }

    // no response is expected from the server; eventInfo should be an object
    async event(eventInfo) {
        return postJson(`${this.url}/event`, eventInfo, null, { requestHeaders: { ...this.requestHeaders, 'Event-URI': this.getEventUri() } });
    }

    async getSession() {
        return getJson(`${this.url}/session`, null, { requestHeaders: { ...this.requestHeaders } });
    }

    async editSession(sessionInfo) {
        return postJson(`${this.url}/session`, sessionInfo, null, { requestHeaders: { ...this.requestHeaders } });
    }
}

export {
    TrackClient,
};
