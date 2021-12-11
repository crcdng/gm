# gm!

Connecting the virtual and physical metaverse in a playful manner.

Made for the https://www.despace.berlin/hack-the-metaverse hackathon, solo project in 48 hours. 

### Prerequisites

[node.js](https://nodejs.org/en/), libraries: SignalR, Johnny Five, oled-js. Uses the TzKT API (v1.6.3) by Baking Bad Team https://api.tzkt.io/.

To install, run 
`npm main.js`

To start, run
`node main.js`

To test collecting, you need a Tezos wallet - I am using [Temple](https://templewallet.com/). I made an NFT for that https://hicetnunc.art/objkt/181212 (0.01 tez) but you can use any OBJKT you want of course. Note this transaction happens on Mainnet, so you are actually collecting the NFT.  

### Physical Setup

![](assets/physical_setup.jpg)

Wiring

![](assets/arduino_schema.jpg)

### Parts list

* Arduino UNO 
* Servo Motor - I am using a [Blue Arrow SO3611](https://servodatabase.com/servo/blue-arrow/s03611)
* OLED Mini Display - e.g. [DSD TECH 0.91 inch(128*32)](http://www.dsdtech-global.com/2018/05/iic-oled-lcd-u8glib.html) 
* Piezo Speaker
* a breadboard
* cables, a USB cable

In the Arduino IDE load the "Examples -> Firmata -> StandardFirmataPlus" sketch. Then close the IDE, we use JavaScript / node.js to talk to the Arduino. 



