Track Client SDK
================

A client SDK that enables the application to submit
user actions to the track service.

If you are using the track proxy, you should configure the proxy to include
the a header with an account id (for example, `Track-Account-Id`, or any other
other authorization header like `Authorization: Bearer <access_token>`) on all
track requests, so you don't have to configure the track SDK with any account-specific
information. You can then configure separate account id's in production and development
environments using the track proxy, without having to customize the Track Client SDK
configuration for each deployment.

If you are not using the track proxy, and you need to send a header with the track
requests indicating an account id or access token, you can include it in the
`requestHeaders` parameter when you initialize the client, like this:

```
const track = new TrackClient({
    serviceEndpoint: '/track',
    requestHeaders: {
        'Track-Account-Id': '<account_id>',
    },
});
```
# API

You can use async/await:

```
async function example() {
    await this.$track.event({ action: 'signup' });
    // do the next thing after event is recorded
}
```

You can use then():

```
function example() {
    this.$track.event({ action: 'signup' })
        .then(result => { /* do the next thing after event is recorded */ })
        .catch(error => { /* handle error */ });
}
```

You can send the event and continue without waiting for it:

```
function example() {
    this.$track.event({ action: 'signup' });
    // do the next thing immediately without waiting
}
```

# Vue

Add this to `main.js`, or anywhere you configure the track sdk:

```
import { TrackClient } from '@unicornsprings/track-client-sdk-js';
...
Vue.prototype.$track = new TrackClient({ serviceEndpoint: '/track' });
```

To configure the track client to send an event on every route change, add this to your
`App.vue` file so it applies to all pages. Alternatively, you can add it to every page where you want
to add tracking.

The event info object is completely arbitrary -- send whatever
you want to see in the campaign manager. The track SDK already
sends the complete URL from `window.location.href` with each
event so you don't have to send route info unless it's more
convenient for you to parse out a specific query parameter here
and send it separately.

Note that we are NOT waiting for this request to complete,
so we don't hold up the UI.


```
    watch: {
        $route(to) {
            this.$track.event({ action: 'route' });
        },
    },
```

# Gridsome

Add this to `main.js`, or anywhere you configure the track sdk:

```
import { TrackClient } from '@unicornsprings/track-client-sdk-js';
...
Vue.prototype.$track = new TrackClient({ serviceEndpoint: '/track' });
```

To configure the track client to send an event on every route change, add this to your
`App.vue` file so it applies to all pages. Alternatively, you can add it to every page where you want
to add tracking.

Note the use of `process.isClient` to ensure we only track events by visitors,
and don't call the track API when we're generating static pages before deployment.
For more information, see [gridsome docs](https://gridsome.org/docs/client-api/#isclient).

```
    watch: {
        '$route.path': function onChangeRoutePath(newVal) {
            if (process.isClient) {
              this.$track.event({ action: 'route' });
            }
        },
    },
    mounted() {
        if (process.isClient) {
          this.$track.event({ action: 'route' });
        }
    },
```

