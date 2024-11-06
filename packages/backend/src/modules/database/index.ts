import { connect } from "mongoose";
import { Logger } from "../common/utils/Logger";

export class Database {
    public async connect(): Promise<void> {
        try {
            await connect(process.env.STRIKE_MONGODB_URI ?? "mongodb://localhost:27017/strike");
            Logger.info('Connected to database');
        } catch (error) {
            console.log(error)
            Logger.error('Unable to connect to database');
        }
    }
}