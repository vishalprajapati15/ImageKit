import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI){
    throw new Error("Please define Mongodb uri in env file!!");
}

let cached = global.mongoose;
if(!cached){
    cached = global.mongoose = {conn: null, promise: null}
}

export async function connectionToDB() {  //if connection already exist
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){                // if connection does not exist
        const options = {
            bufferCommands: true,
            maxPoolSize: 10
        };
        mongoose
        .connect(MONGODB_URI, options)
        .then(()=>mongoose.connection)
    }

    try {
        cached.conn = await cached.promise          // if already connected and promise on the way
    } catch (error) {
        cached.promise = null;
        throw Error;
    }
    return cached.conn;
}