# Plex-TP-Link-Kasa
Dim Kasa lights using Plex webhooks

Will dim lights on media playing and brighten lights when pausing or stopping

To use:
1. Install modules using `npm install`
2. Add `http://localhost:44010/plex` to your Plex webhooks
3. Open settings.js and add your Kasa lights' name to `DEVICE_NAME`
4. Run using `npm start` in console
5. Play some media and watch your lights politely dim themselves for you

Note: To set a specific media player to listen to (ex. The TV located in the same room as the lights), play some media on it to get it's UUID in the console, then you can set that UUID in settings.js
