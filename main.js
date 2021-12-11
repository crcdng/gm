const signalR = require("@microsoft/signalr");

const CONTRACT_ADDRESS = "KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn"; // Hic et Nunc Marketplace

// parameters to adapt
const ACCOUNT = "tz1RJaJXwrqyjUtWyXqcybX77yUKHj8j3oyL";  // put your account here
const OBJKT_ID = "181212";  // put your OBJKT ID here

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
