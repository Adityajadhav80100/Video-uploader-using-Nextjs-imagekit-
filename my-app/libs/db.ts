import mongoose  from "mongoose";
import { buffer } from "stream/consumers";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/videoAI";

if(!MONGO_URL){
    throw new Error("MONGO_URL is not defined in environment variables");
}

let chached = global.mongoose; 

if(!chached){
   chached = global.mongoose = {conn: null , promise: null} ;

}
 
export async function connectionToDB() {
    if(chached.conn){
        return chached.conn;
    }

    if(!chached.promise){
          
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        }

        mongoose
        .connect(MONGO_URL , opts)
        .then(()=>mongoose.connection)
    }

    try {
       chached.conn = await chached.promise

    } catch (error) {
        chached.promise = null;
        throw error;
    }

    return chached.conn;
}