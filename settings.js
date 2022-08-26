// Settings
const settings = {
    DEVICE_NAME: "Yousef's Office", // Name of the lights to control
    PLAYER_UUID: "", // UUID of the device playing the media, leave empty to allow any player to dim the lights
    DIM_MODE: "gentle_on_off", // Dim mode - gentle_on_off / instant_on_off / last_status
    DURATION: 5, // Duration of dimming in seconds
    DIM: 1,
    BRIGHTEN: 20,
};

module.exports = settings;