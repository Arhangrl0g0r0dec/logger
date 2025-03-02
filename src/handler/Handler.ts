import { ILogHandler, MessageLog } from 'loglab';
import RequestDB from '../db/DB';
import { MessageLogMongo } from '../config/models/requestModel';

export class Handler implements ILogHandler {
    async logHandler(logData: MessageLog): Promise<void> {
        logData.steps = [];
        for(let i = 0; i < logData.steps.length; i ++) logData.steps[i].dataStep.result = JSON.stringify(logData.steps[i].dataStep.result);       
        const message: MessageLogMongo = {
            server: logData.server,
            hash: logData.hash,
            pid: logData.pid,
            request: {
                id: logData.request.id,
                method: logData.request.method,
                path: logData.request.path,
                requestTime: new Date(logData.request.requestTime),
                headers: {
                    Host: logData.request.headers.Host,
                    ContentType: logData.request.headers.ContentType,
                },
                body: logData.request.body
            },
            response: {
                status: logData.response.status,
                body: logData.response.body,
                responseTime: new Date(logData.response.responseTime)
            },
            time: logData.time,
            steps: logData.steps
        };
        await RequestDB.sendMessageLog(message);
    }
}