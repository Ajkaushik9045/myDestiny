const mongoose = require('mongoose');

const uri = "mongodb+srv://brandbridge45:myDestiny@cluster0.nkx1v.mongodb.net/MyDestiny";
const connectDb = async () => {
    await mongoose.connect(uri);
}
module.exports = connectDb;