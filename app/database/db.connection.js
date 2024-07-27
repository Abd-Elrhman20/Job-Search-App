import mongoose from "mongoose";

mongoose.connect("mongodb://0.0.0.0:27017/Route_exam")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));