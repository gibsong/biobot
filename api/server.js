const kitData = require('./data/KITS_SHIPPING_DATA.json')
const express = require("express");
const cors = require("cors");

//Setup Express
const PORT = 9000;
const server = express();

server.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ["GET", "OPTIONS"],
    })
);

let kits = new Map();

const getKitIds = async(req, res) => {

    try {
        const ids = []
        const iterator = kits.keys()
        for (const id of iterator) {
            if (id.toString().startsWith(req.query.kitID)) {
                ids.push({value: id, label: id})
            }
        }

        res.status(200).json(ids)
    } catch (error) {
        console.log(req, "getKitIds", null, error);
        res.status(500).json({})
    }
}

function isValidKitID(kitID, range) {

    if(Number.isInteger(kitID) &&
        (kitID > range.start) &&
        (kitID <= range.end)) {
        return true
    } else {
        return false
    }
}

const searchKit = async (req, res) => {

    try {
        const kitID = Number(req.query.kitID)
        const range = {start: 0, end: kits.size}
        if(isValidKitID(kitID, range)) {  //param validation
            res.status(200).json(kits.get(kitID))
        } else {
            res.status(400).json({})
        }
    } catch (error) {
        console.log(req, "searchKit", null, error);
        res.status(500).json({})
    }
}
//TODO break out functions into modules
server.get("/api/v1/kits", getKitIds);
server.get("/api/v1/kit", searchKit);

//Redirect to default route
server.get("*", function (req, res) {
    res.redirect("/");
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
    if(kitData) {
        kitData.forEach(element => {
            kits.set(element.id, element)
        })
    }
});
