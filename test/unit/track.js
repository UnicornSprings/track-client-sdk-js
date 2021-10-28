import assert from 'assert';
import { TrackClient } from '../../src/main.js';

function getEventUriTest() {
    return 'http://localhost';
}
/*
required environment variables for the test:
SERVICE_ENDPOINT, e.g. http://localhost/track
*/
const serviceEndpoint = process.env.SERVICE_ENDPOINT;

const context = {
    serviceEndpoint,
    getEventUri: getEventUriTest,
};

console.log(`context: ${JSON.stringify(context)}`);

const client = new TrackClient(context);

describe('trackEvent', function () {
    it('worksAsync', async function () {
        this.timeout(5000); // this test can take up to 5 seconds
        try {
            const result = await client.event({ action: 'hello', extra: 'world' });
            console.log(`result: ${JSON.stringify(result)}`);
        } catch (err) {
            console.error(`failed`, err);
        }
    });
    it('worksThen', function (next) {
        this.timeout(5000); // this test can take up to 5 seconds
        const result = client.event({ action: 'hello', extra: 'world' })
            .then(result => { console.log(`result: ${JSON.stringify(result)}`); next(); })
            .catch(error => { console.error(`failed`, error); next(); });
        console.log(`result: ${JSON.stringify(result)}`);
    });
});
