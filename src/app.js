const express = require('express');
const app = express();
const connectDb = require("./config/database");

app.use(express.json()); 

//importing Routers
const authRouter= require("./routes/auth");


// using the Imported Routers
app.use("/",authRouter);




//connecting to database and running server
connectDb().then(() => {
    console.log("Database is connected");
    app.listen(3000, () => {
        console.log("Server is Listening");
    });
}).catch((err) => {
    console.error("Database is not Connected");
})
