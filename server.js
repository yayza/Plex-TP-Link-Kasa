const { Client } = require("tplink-smarthome-api");
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "/tmp/" });
const smartHome = new Client();
const settings = require("./settings.js");

const clientList = {};
smartHome.startDiscovery().on("device-new", (device) => {
    device.getSysInfo().then((data) => (clientList[data.alias] = device));
});

function dimLights(brightness) {
    if ((clientList[settings.DEVICE_NAME]._sysInfo.relay_state === 0) && (brightness !== 0)) {
        console.log("Powering back on switch");
        clientList[settings.DEVICE_NAME].send({
            "smartlife.iot.dimmer": {
                set_switch_state: { state: 1 },
            },
        });
    }
    try {
        if (clientList[settings.DEVICE_NAME]._sysInfo.relay_state === 1) {
            clientList[settings.DEVICE_NAME].send({
                "smartlife.iot.dimmer": {
                    set_dimmer_transition: { brightness: brightness, mode: settings.DIM_MODE, duration: settings.DURATION },
                },
            });
        }
    } catch (e) {
        console.log(e);
    }
}

function checkErrors(data) {
    const isCorrectPlayer =
        (settings.PLAYER_UUID.length > 0 && data.Player.uuid == settings.PLAYER_UUID) ||
        settings.PLAYER_UUID.length == 0;

    if (!clientList[settings.DEVICE_NAME]) {
        console.log(`${settings.DEVICE_NAME} not found!`);
        return false;
    }
    if (!isCorrectPlayer || !data.Player.local) return false;
    return true;
}

function handleRequest(req) {
    try {
        const data = JSON.parse(req.body ? .payload);
        if (!checkErrors(data)) return;
        const event = {
            "media.play": { dim: settings.DIM, alias: "Played" },
            "media.resume": { dim: settings.DIM, alias: "Resumed" },
            "media.pause": { dim: settings.BRIGHTEN, alias: "Paused" },
            "media.stop": { dim: settings.BRIGHTEN, alias: "Stopped" },
        };
        dimLights(event[data.event].dim);
        console.log(
            `Media ${event[data.event].alias}\nMedia Title: ${data.Metadata.title}\nPlayer UUID: ${
        data.Player.uuid
      }\nSettings lights to ${event[data.event].dim}%\n`
        );
    } catch (e) {
        console.log(e);
    }
}

app.post("/plex", upload.single("thumb"), (req, res) => {
    handleRequest(req);
    res.sendStatus(200);
});

app.listen(44010, () => console.log("Listening for Plex events"));