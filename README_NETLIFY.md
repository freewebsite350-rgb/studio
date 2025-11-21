````markdown
```markdown
# Deploying Retail-Assist 3.0 to Netlify (Quick Guide)

1) Install dependencies locally (or CI)
   npm ci

2) Ensure @netlify/plugin-nextjs is installed (the repo includes it in package.json).
   If not present: npm i -D @netlify/plugin-nextjs

3) Netlify site setup
   - In Netlify UI, create a new site (connect GitHub repo `freewebsite350-rgb/studio`).
   - Build command: npm run build
   - Publish directory: leave default (the plugin will produce .netlify/output)

4) Environment variables (Netlify > Site settings > Build & deploy > Environment)
   - Add FB_VERIFY_TOKEN = retail-assist-token
   - Add any other env vars you use (Firebase config, GENKIT keys, etc.)

5) Webhook URL to set in Meta Developer portal:
   - Use your Netlify site URL: https://your-site.netlify.app/api/webhook
   - In Meta App Dashboard > Webhooks, set Callback URL to above and Verify Token to the same value you set in FB_VERIFY_TOKEN.
   - Click "Verify and save".

6) Debugging
   - Netlify build logs: check for successful `next build`.
   - Function logs: In Netlify UI, you can view function invocation logs. For initial verification the GET will be logged by the route handler (console.log entries).
   - If verification fails, try:
     - Confirm the exact path in Dashboard (no trailing slash mismatch).
     - Confirm FB_VERIFY_TOKEN in Netlify matches Dashboard verify token exactly.
     - Use curl to emulate:
       curl -i "https://your-site.netlify.app/api/webhook?hub.mode=subscribe&hub.verify_token=<your_token>&hub.challenge=TEST"
     - The response body must be exactly TEST (plain text), status 200.

7) Fallback (if you prefer not to use plugin):
   - You can implement the webhook as a Netlify Function under `netlify/functions/` and use that function URL as the callback. The above handler is simpler with the Next plugin and preserves your App Router routes.
```
````