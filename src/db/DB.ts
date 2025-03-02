import { config } from "../config/config";
import { messageLogModel, requestInfo } from "./schemasMongo";
import { GetLogByDate, MessageLogMongo, RequestInfo } from "../config/models/requestModel";

class RequestDB {
    /**
     * Метод отправки данных лога в MongoDB
     * @param messageLog 
     * @returns boolean: true - укспешно, false - ошибка 
     */
    async sendMessageLog(messageLog: MessageLogMongo): Promise<boolean> {

        const method: string = 'sendMessageLog';

        try {
            const request = new messageLogModel(messageLog);
            await request.save();
            return true;
        } catch(error: any) {
            config.errorData(error, method, 500, 'db.ts');
            return false;
        };
    };
    /**
     * Метод получения логов по hash
     * @param hash строка hash
     * @returns Структуру MessageLog + доп. данные с mongo 
     */
    async getMessageLogByHash(hash: string): Promise<MessageLogMongo[] | undefined> {

        const method: string = 'getMessageLogByHash';

        try {
            const result = await messageLogModel.find({ hash: hash }).lean();
            return result;
        } catch(error: any) {
            config.errorData(error, method, 500, 'db.ts');
            return undefined;
        };
    };
    
    /**
     * Метод получения логов по датам и по названию серверов
     * @param data данные dateFrom, dateTo, server
     * @returns Структуру MessageLog + доп. данные с mongo 
     */
    async getMessageLogByDateServer(data: GetLogByDate): Promise<any> {

        const method: string = 'getMessageLogByDate';

        try {
            const result: any = await messageLogModel.find({ server : data.server, 'request.requestTime': { $gte: data.dateFrom, $lte: data.dateTo } }).lean();
            return result;
        } catch(error: any) {
            config.errorData(error, method, 500, 'db.ts');
            return undefined;
        };
    };

    /**
     * Метод получения логов по датам со всех серверов
     * @param data данные dateFrom, dateTo, server === 'all'
     * @returns Структуру MessageLog + доп. данные с mongo 
     */
    async getMessageLogByDate(data: GetLogByDate): Promise<any> {

        const method: string = 'getMessageLogByDate';

        try {
            const result = await messageLogModel.find({ 'request.requestTime': { $gte: data.dateFrom, $lte: data.dateTo } }).lean();;
            return result;
        } catch(error: any) {
            config.errorData(error, method, 500, 'db.ts');
            return undefined;
        };
    };

    /**
     * Метод получения данных по всем запросам по датам со всех серверов
     * @param data данные dateFrom, dateTo, server === 'all'
     * @returns Структуру RequestInfo + доп. данные с mongo 
     */
    async getRequestByDate(data: GetLogByDate): Promise<any> {

        const method: string = 'getRequestByDate';

        try {
            const result = await requestInfo.find({ 'requestTime': { $gte: data.dateFrom, $lte: data.dateTo } }).lean();
            return result;
        } catch(error: any) {
            config.errorData(error, method, 500, 'db.ts');
            return undefined;
        };
    };

    /**
     * Метод получения данных по всем запросам по датам и по названию серверов
     * @param data данные dateFrom, dateTo, server
     * @returns Структуру RequestInfo + доп. данные с mongo 
     */
    async getRequestByDateServer(data: GetLogByDate): Promise<any> {

        const method: string = 'getRequestByDateServer';

        try {
            const result: any = await requestInfo.find({ host : data.server, 'requestTime': { $gte: data.dateFrom, $lte: data.dateTo } }).lean();
            return result;
        } catch(error: any) {
            config.errorData(error, method, 500, 'db.ts');
            return undefined;
        };
    };

    /**
     * Метод отправки данных запросов в MongoDB
     * @param requestInfo 
     * @returns boolean: true - укспешно, false - ошибка 
     */
    async sendRequestInfo(request: RequestInfo): Promise<boolean> {

        const method: string = 'sendMessageLog';

        try {
            const query = new requestInfo(request);
            await query.save();
            return true;
        } catch(error: any) {
            config.errorData(error, method, 500, 'db.ts');
            return false;
        };
    };
}

export default new RequestDB();