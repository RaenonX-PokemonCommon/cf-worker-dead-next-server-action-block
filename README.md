# cf-worker-dead-next-server-action-block

When a user opens a next.js webpage that has a server action then a new deployment happens,
the previously opened page could send a server action that doesn't exist after the deployment. 

If this happens, the server will print a log like this:
```
Error: Failed to find Server Action "X". This request might be from an older or newer deployment. Original error: Cannot read properties of undefined (reading 'workers')
```

...and send the whole page back in HTML instead of a way shorter response
that should've been what to be returned by the server action.

Therefore, this worker is created so that such HTML response (meaning server action doesn't exist anymore) 
won't be returned, and will be blocked for the future requests.

## Deploy

Run the command below to update.

```bash
wrangler deploy
```
