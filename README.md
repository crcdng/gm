# gm!

Connecting the virtual and physical metaverse in a playful manner.

The metaverse - a concept originally derived from Neil Stephenson's sci-fi novel "Snow Crash" - has stirred debates and drawn strong views from commentators. Especially after major gaming and social media companies start claiming the concept for themselves, criticism has peaked. However: some of the self-professed "metaverse critics" seem unaware that by dismissing the concept altogether they inherently accept and confirm the takeover, playing the game of [INSERT MEGACORP HERE]. 

A very different approach is to resist appropriation, with artists and hackers instead exploring *their ideas what a metaverse could be* - through community, discussion and experimentation. Some directions I think could be interseting to explore for a future metaverse:
   
* ownership - green blockchain technology such as [Tezos](https://tezos.com/) enables us to experiment with alternative economic models 
* mixed reality - the metaverse will bridge physical and digital manifestations VR/AR/XR 
* decentralization - a catastrophic DNS failure can bring down Facebook but it cannot bring down not Hic et Nunc
* identities - we can play with multiple identities and avatars that persist beyond the realm of a specific world 
* openness - open standards, open minds, open communities - it is time get rid of your old gatekeeping mindset

This small prototype attempts to embody the first three of these, make the collection of NFTs on Tezos more playful and delight the artist whose piece is collected. 

In short, it is this meme:

Technically, it works by 'listening' to collect transactions and looking for a particular OBJKT on [Hic et Nunc](https://hicetnunc.art/). When the NFT is being collected, it sends out signals to a piezo speaker, a matrix display and a servo motor. That's it - the complete code, written in JavaScript, is available in file `main.js`. Use at your own risk.

From this small prototype, imagine what you can do in future iterations: open a door, play sound from a synthesizer, start a little robot that stops by and says "gm!" (gm stands for "Good Morning", a friendy phrase in the community). Imagine you create a different effect for each of your OBJKTs. It is only limited by imagination. 

---

Made for the https://www.despace.berlin/hack-the-metaverse hackathon in December 2021, solo project in 48 hours. 
Sticker created by Anita Sengupta (tzconnect).

MIT License 

### Prerequisites

[node.js](https://nodejs.org/en/), libraries: SignalR, Johnny Five, oled-js. Uses the TzKT API (v1.6.3) by Baking Bad Team https://api.tzkt.io/.

To install, run 
`npm main.js`

To start, run
`node main.js`

To test collecting, you need a Tezos wallet - I am using [Temple](https://templewallet.com/). I made a special NFT for development https://hicetnunc.art/objkt/181212 (0.01 tez) but you can use any OBJKT number you want of course. Note this transaction happens on the Tezos Mainnet using the original Hic et Nunc smart contract, so when running the code in this repository, the effect is triggered when you are actually collecting the NFT.  

### Physical Setup

![](assets/physical_setup.jpg)

Wiring schema

![](assets/arduino_schema.jpg)

### Parts list

* Arduino UNO 
* Servo Motor - I am using a [Blue Arrow SO3611](https://servodatabase.com/servo/blue-arrow/s03611)
* OLED Mini Display - e.g. [DSD TECH 0.91 inch(128*32)](http://www.dsdtech-global.com/2018/05/iic-oled-lcd-u8glib.html) 
* Piezo Speaker
* a breadboard
* cables, a USB cable

In the Arduino IDE load the "Examples -> Firmata -> StandardFirmataPlus" sketch. Then close the IDE, in this project we use JavaScript / node.js to talk to the Arduino running the Firmata sketch. 

Questions? Twitter! [@crcdng](https://twitter.com/crcdng)

