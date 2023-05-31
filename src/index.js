import mongoose from "mongoose";
// app is bringing the expresss server 
import app from "./app.js";
// making a config file to store all the data like port and urls is a good practice 
import config from "./config/index.js";

(async () => {
    try {
        // await is used here so that the system waits till there is any response that if the connection is made or not

      await mongoose.connect(config.MONGODB_URL);
      console.log("DB connected");

      // app.on is for checking if db and server are having any problems, if they are it will throe error.
      // error in this is an event 
      app.on('error', (err) => {
            console.error("ERROR:", err);
            throw err;
      })

      app.listen(config.PORT, () => {
        console.log(`Server is listening  on  ${config.PORT}`);
      }) 

    } catch (err) {
        console.error("ERROR:", err);
        throw err;
        
    }
})()