const signalR = require('@microsoft/signalr');
const five = require('johnny-five');
const board = new five.Board();
const Oled = require('oled-js');
const font = require('oled-font-5x7');

const fs = require('fs'); // for logging
const util = require('util'); // for logging

const PIN_PIEZO = 11;
const OLED_OPTS = {
    width: 128,
    height: 32,
    address: 0x3C // see https://github.com/noopkat/oled-js how to determine the address
};

const melodyB5 = [
    ['G3', 1 / 4],
    [null, 1 / 8],
    ['G3', 1 / 4],
    [null, 1 / 8],
    ['G3', 1 / 4],
    [null, 1 / 8],
    ['D#3', 2],   
    [null, 2],
    ['F3', 1 / 4],
    [null, 1 / 8],
    ['F3', 1 / 4],
    [null, 1 / 8],
    ['F3', 1 / 4],
    [null, 1 / 8],
    ['D3', 4], 
    [null, 1 / 8]
];  

const CONTRACT_ADDRESS = 'KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn'; // Hic et Nunc Marketplace

// parameters to adapt
const OBJKT_ID = '181212';  // put your OBJKT ID here

function playMelody(piezo, melody, bpm) {
    piezo.play({
        song: melodyB5,
        tempo: bpm
    });
}

board.on('ready', () => {

    // useful for debugging, uncomment to log
    // function log () {
    //     logFile.write(util.format.apply(null, arguments) + '\n');
    //     // logStdout.write(util.format.apply(null, arguments) + '\n');
    // }
    // const logFile = fs.createWriteStream('logs/log.txt', { flags: 'a' });
    // const logStdout = process.stdout;

    const piezo = new five.Piezo(PIN_PIEZO);
    const servo = new five.Servo(10);
    const oled = new Oled(board, five, OLED_OPTS);

    const connection = new signalR.HubConnectionBuilder()
        .withUrl('https://api.tzkt.io/v1/events')
        .build();

    // https://api.tzkt.io/#section/SubscribeToOperations
    async function init() {
        await connection.start();
        await connection.invoke('SubscribeToOperations', {
            address: CONTRACT_ADDRESS,
            types: 'transaction'
        });
    };

    // auto-reconnect
    connection.onclose(init);

    connection.on('operations', (msg) => {

        if (msg.type === 0) {
            console.log(`subscription to contract ${CONTRACT_ADDRESS} confirmed, listening for OBJKT ${OBJKT_ID}`);
        } else if (msg.type === 1) {

            const data = msg.data;

            // logging the incoming message, uncomment to log
            // log(data);

            for (let entry of data) {
                if (entry.type === 'transaction' && entry.status === 'applied'
                    && entry.parameter.entrypoint === 'collect'
                    && entry.diffs[0].content.value.objkt_id == OBJKT_ID    // note that === doesn't work
                ) {
                    const consoleMsg = `gm! Congratulations! OBJKT ${OBJKT_ID} got collected by ${entry.sender.address}`;
                    console.log(consoleMsg);
                    // shorter message for 128x32 display
                    const displayMsg = `gm! OBJKT ${OBJKT_ID}/ ${entry.sender.address}`;

                    playMelody(piezo, melodyB5, 100);

                    setTimeout(() => {
                        oled.clearDisplay();
                        oled.update();
                        oled.writeString(font, 1, displayMsg, 1, true, 2);  
                        oled.update();
                    }, 5000);

                    setTimeout(() => {
                        servo.home();
                        servo.sweep();
                    }, 8000)
                    setTimeout(() => {
                        servo.stop();
                    }, 16000);
                }
            }
        } else if (msg.type === 2) {
            console.log(`Chain reorganisation`)
        }

    });

    init();
});