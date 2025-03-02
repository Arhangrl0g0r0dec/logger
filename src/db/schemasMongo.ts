import mongoose from "mongoose";
import { config } from "../config/config";

const Schema = mongoose.Schema;

interface IMessageLog {
    server: string,
    hash: string,
    pid: number,
    request: {
        id: any,
        method: string,
        path: string,
        requestTime: Date,
        headers: {
            Host: string | undefined,
            ContentType: string | undefined
        },
        body: string
    },
    response: {
        status: number,
        body: string,
        responseTime: Date
    },
    time: number,
    steps: IStep[]
}

interface IStep {
    level: string,
    dataStep: IDataStep
}

interface IDataStep {
    data: string,
    result?: string[]
}

const dataStep = new Schema<IDataStep>({
    data: String,
    result: [String]
});

const stepsSchema = new Schema<IStep>({
    level: String,
    dataStep: [dataStep]
});

const messageLogSchema = new Schema<IMessageLog>({
    server: {
        type: String,
        require: true
    },
    hash: {
        type: String,
        required: true
    },
    pid: Number,
    request: {
        id: Number,
        method: String,
        path: String,
        requestTime: Date,
        headers: {
            Host: String,
            ContentType: String
        },
        body: Object
    },
    response: {
        status: Number,
        body: Object,
        responseTime: Date
    },
    time: Number,
    steps: [stepsSchema]
});

interface IRequestInfo {
    method: string,
    path: string,
    requestTime: Date,
    host: string
}

const requestInfoSchema = new Schema<IRequestInfo>({
    method: String,
    path: String,
    requestTime: Date,
    host: String
});

export const messageLogModel = mongoose.model('MessageLog', messageLogSchema);
export const requestInfo = mongoose.model('RequestInfo', requestInfoSchema);

/**
 * Функция подключения к БД mongo
 */
export const connectMongo = async(): Promise<void> => {
    const method: string = 'connectMongo';
    try {
        await mongoose.connect(`${config.db.mongoDB.connectionString}`);    
        mongoose.connection.on('error', async(err) => {
            await connectMongo();
            config.errorData('Mongoose connection error: ' + err, method, 500, 'db.ts');
        });
    } catch(error: any) {
        config.errorData(error, method, 500, 'db.ts');
    }
}

export const disconnectMongo = async(): Promise<void> => {
    const method: string = 'connectMongo';
    try {
        await mongoose.disconnect();
    } catch(error: any) {
        config.errorData(error, method, 500, 'db.ts');
    }
}