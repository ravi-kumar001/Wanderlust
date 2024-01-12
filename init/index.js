const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
main().then((res) => {
    console.log("Connection successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "658fc5d18690bdb0fdda6be6"
    }))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();