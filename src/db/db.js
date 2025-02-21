import mongoose from "mongoose";
import config from "../config/config.js";

const connect = () => {
  mongoose
    .connect(config.MONGO_URI)
    .then(() => {
      console.log("Connect of Mongodb");
    })
    .catch((err) => {
      console.log(err);
    });
};


export default connect;