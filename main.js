const signalR = require("@microsoft/signalr");
const five = require("johnny-five");
const board = new five.Board();
const Oled = require('oled-js');

const PIN_PIEZO = 11;
const OLED_OPTS = {
    width: 128,
    height: 32,
    address: 0x3C // see https://github.com/noopkat/oled-js how to determine the address
};

const CONTRACT_ADDRESS = "KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn"; // Hic et Nunc Marketplace

// parameters to adapt
const ACCOUNT = "tz1RJaJXwrqyjUtWyXqcybX77yUKHj8j3oyL";  // put your account here
const OBJKT_ID = "181212";  // put your OBJKT ID here

function playMelody(piezo, melody, bpm) {
    piezo.play({
        song: melody,
        tempo: bpm
    });
}

board.on("ready", () => {

    // testing the piezo
    const piezo = new five.Piezo(PIN_PIEZO);
    playMelody(piezo, [
        ["C4", 1 / 4],
        ["D4", 1 / 4],
        ["F4", 1 / 4],
        ["D4", 1 / 4],
        ["A4", 1 / 4],
        [null, 1 / 4],
        ["A4", 1],
        ["G4", 1],
        [null, 1 / 2],
        ["C4", 1 / 4],
        ["D4", 1 / 4],
        ["F4", 1 / 4],
        ["D4", 1 / 4],
        ["G4", 1 / 4],
        [null, 1 / 4],
        ["G4", 1],
        ["F4", 1],
        [null, 1 / 2]
    ], 100);

    // testing the display 
    const oled = new Oled(board, five, OLED_OPTS);
    setTimeout(() => {
        oled.clearDisplay();
        oled.update();
        // oled.setCursor(0, 0);
        // oled.drawRect(2, 2, 123, 27, 1);
        // oled.drawRect(5, 5, 117, 21, 1);
        oled.drawRect(8, 8, 111, 13, 1);
        // oled.drawRect(11, 11, 113, 17, 1);
        // oled.invertDisplay(true);
        oled.update();
        // oled.drawRect(10, 10, OLED_OPTS.width - 20, OLED_OPTS.height - 10, 1);
        for (let i = 0; i < 16; i++) {
            // oled.drawRect(i+1, i+1, OLED_OPTS.width - (i+1), OLED_OPTS.height - (i+1), 1);
            // oled.drawCircle(Math.floor(Math.random() * OLED_OPTS.width), Math.floor(Math.random() * OLED_OPTS.height), Math.floor(Math.random() * 30), 1);
        }
    }, 5000)

    // testing the servo 
    // https://johnny-five.io/api/servo/
    const servo = new five.Servo(10);
    setTimeout(() => {
        servo.home();
        servo.sweep();
    }, 8000)
    setTimeout(() => {
        servo.stop();
    }, 16000)

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://api.tzkt.io/v1/events")
        .build();

    // https://api.tzkt.io/#section/SubscribeToOperations
    async function init() {
        await connection.start();
        await connection.invoke("SubscribeToOperations", {
            address: CONTRACT_ADDRESS,
            types: 'transaction'
        });
    };

    // auto-reconnect
    connection.onclose(init);

    connection.on("operations", (msg) => {

        if (msg.type === 0) {
            console.log("subscription confirmed");
        }

        if (msg.type === 1) {

            const data = msg.data;

            for (let entry of data) {
                if (entry.type === "transaction" && entry.status === "applied"
                    && entry.parameter.entrypoint === "collect"
                    && entry.diffs[0].content.value.issuer == ACCOUNT       // note that === doesn't work
                    && entry.diffs[0].content.value.objkt_id == OBJKT_ID    // note that === doesn't work
                ) {
                    console.log(`Congratulations OBJKT ${OBJKT_ID} got collected by ${entry.sender.address}`);
                }
            }
        }

    });

    init();
});