let logger = null
let store = null
let alreadyInitialized = false;
const keyStates = {};

module.exports = {
    title: "WinSFX",
    summary: "gives the browser click & clack sfx",
    author: "flyntdubu",
    modVersion: 0.1,

    trees: {
        "./": "assets://mod/winSFX/"
    },

    settings: {
        boolean: [{
            model: "disable_click",
            label: "Disable Click SFX",
            desc: "Disables SFX on mouse clicks.",
        },
        {
            model: "disable_clack",
            label: "Disable Clack SFX",
            desc: "Disables SFX on keyboard clacks.",
        }]
    },

    computed(api) {
        logger = api.logger
        store = api.store
        store.set("click", store.get("click", "assets:/mod/winSFX/click.mp3")) // from https://www.youtube.com/watch?v=h6_8SlZZwvQ
        store.set("clack", store.get("clack", "assets:/mod/winSFX/clack.mp3")) // assets:/storyfiles/hs/00003/00003.swf
        // TODO: add mode to only register valid clicks!
    },

    vueHooks: [{
        matchName: "settings",
        created() {
            if (!alreadyInitialized) { // only run if the listeners haven't been initialized
                const MAX_VOLUME = 1.0;
                const MIN_VOLUME = 0.1;
                const volumeStep = (MAX_VOLUME - MIN_VOLUME) / 2;

                // do some audio adjustment!!!
                const adjustVolume = () => {
                    const pressedKeys = Object.values(keyStates).filter(state => state);
                    const numPressedKeys = pressedKeys.length;
                    const volume = Math.max(MAX_VOLUME - (numPressedKeys - 1) * volumeStep, MIN_VOLUME);
                    return volume;
                };

                document.addEventListener("click", () => {
                    if (!store.get("disable_click", false)) {
                        const audio = new Audio(store.get("click", "assets:/mod/winSFX/click.mp3"));
                        const pitchShift = Math.random() * 0.2; // random to make it interesting :3
                        audio.playbackRate = 1 + pitchShift;
                        audio.play();
                    }
                });

                document.addEventListener("keydown", (event) => {
                    if (!keyStates[event.code]) {
                        keyStates[event.code] = true; 
                        
                        if (!store.get("disable_clack", false)) {
                            const audio = new Audio(store.get("clack", "assets:/mod/winSFX/clack.mp3"));
                            const pitchShift = Math.random() * 0.2;
                            audio.playbackRate = 1 + pitchShift; // random to make it interesting :3
                            audio.volume = adjustVolume();
                            audio.play(); 
                        }
                    }

                });

                document.addEventListener("keyup", (event) => {
                    keyStates[event.code] = false;
                });

                alreadyInitialized = true; // initialized, flag it as so!
            }
        },

    }]
}
