import { MessageLog } from 'loglab';
import RequestDB from '../db/DB';
import { ErrorsServer, CountError, GetLogByDate, MessageLogMongo, MessageLogResponse, RequestServer, RequestInfo, CountRequest } from '../config/models/requestModel';
import dayjs from 'dayjs';
import { config } from '../config/config';

class Service {
    async getLogByHash(hash: string): Promise<number | MessageLogResponse[]> {
        const logs: MessageLogMongo[] | undefined = await RequestDB.getMessageLogByHash(hash);
        if(!logs || !logs[0]) return 1;
        const logsResult: MessageLogResponse[] = [];
        logs.forEach(log => {
            const result: MessageLogResponse = {
                server: log.server,
                hash: log.hash,
                pid: log.pid,
                request: {
                    id: log.request.id,
                    method: log.request.method,
                    path: log.request.path,
                    requestTime: log.request.requestTime.toLocaleString(),
                    headers: log.request.headers,
                    body: log.request.body
                },
                response: {
                    status: log.response.status,
                    body: log.response.body,
                    responseTime: log.response.responseTime.toLocaleString()
                },
                time: log.time,
                steps: log.steps
            };
            logsResult.push(result);
        })
        
        return logsResult;
    }

    async getLogByDate(data: GetLogByDate): Promise<number | MessageLogResponse[]> {
        if(!data.dateTo) data.dateTo = dayjs().hour(23).minute(59).second(59).toISOString();
        data.dateFrom = dayjs(data.dateFrom).hour(0).minute(0).second(0).toISOString();

        let logs: MessageLogMongo[] | undefined;

        if(data.server === 'all') logs = await RequestDB.getMessageLogByDate(data);
        else logs = await RequestDB.getMessageLogByDateServer(data);

        if(!logs || !logs[0]) return 1;

        const logsResult: MessageLogResponse[] = [];
        logs.forEach(log => {
            const result: MessageLogResponse = {
                server: log.server,
                hash: log.hash,
                pid: log.pid,
                request: {
                    id: log.request.id,
                    method: log.request.method,
                    path: log.request.path,
                    requestTime: log.request.requestTime.toLocaleString(),
                    headers: log.request.headers,
                    body: log.request.body
                },
                response: {
                    status: log.response.status,
                    body: log.response.body,
                    responseTime: log.response.responseTime.toLocaleString()
                },
                time: log.time,
                steps: log.steps
            };
            logsResult.push(result);
        });
        
        return logsResult;
    };

    async getServices(): Promise<string[]> {
        const services: string[] = config.connectedServers;
        return services;
    };

    async getStatisticByError(data: GetLogByDate): Promise<number | ErrorsServer[]> {
        if(!data.dateTo) data.dateTo = dayjs().hour(23).minute(59).second(59).toISOString();
        data.dateFrom = dayjs(data.dateFrom).hour(0).minute(0).second(0).toISOString();

        let logs: MessageLog[] | undefined;
        const result: ErrorsServer[] = [];
        if(data.server === 'all') {
            logs = await RequestDB.getMessageLogByDate(data);
            if(!logs || !logs[0]) return 1;

            const servers: string[] = logs.map((el) => el.server ?? 'См. код ошибки');
            const distinctServers: string[] = Array.from(new Set(servers));

            for(let i = 0; i < distinctServers.length; i++) {
                const errors: string[] = logs.filter(ser => ser.server == distinctServers[i]).map((el) => el.response.body.message ?? el.response.body);
                const distinctError: string[] = Array.from(new Set(errors));

                const errServ: ErrorsServer = {
                    server: distinctServers[i],
                    errors: [],
                    countErr: errors.length
                }

                for(let j = 0; j < distinctError.length; j++) {
                    const percent: number = errors.filter(el => el === distinctError[j]).length / (errors.length / 100);
                    
                    const countErr: CountError = {
                        error: distinctError[j],
                        count: errors.filter(el => el === distinctError[j]).length,
                        percent: String(percent).substring(0, String(percent).indexOf('.') + 4)
                    }
                    
                    errServ.errors.push(countErr);
                    errServ.errors = errServ.errors.sort((a, b) => b.count - a.count);
                }
                
                result.push(errServ);
            }

            return result;
        }
        else {
            console.time("mongo")
            logs = await RequestDB.getMessageLogByDateServer(data);
            console.timeEnd("mongo")

            if(!logs || !logs[0]) return 1;
            
            console.time("map")
            const allErrors: string[] = logs.map(el => el.response.body.message ?? el.response.body);
            const distinctErrors: string[] = Array.from(new Set(allErrors));
            const errArr: string[][] = [];
            console.timeEnd("map")
            
            const errorServer: ErrorsServer = {
                server: data.server,
                errors: [],
                countErr: allErrors.length
            }
            console.time("getStatisticData");
            for(let i = 0; i < distinctErrors.length; i++) {
                for(let j = 0; j < allErrors.length; j++) {
                    if(distinctErrors[i] === allErrors[j]) {
                        const index: number = errArr.findIndex(el => el[0] === allErrors[j]);
                        index != -1? errArr[index].push(allErrors[j]) : errArr.push([allErrors[j]]);
                    }
                }

                const fullPercernt: number = errArr[i].length / (allErrors.length / 100);
                const countErr: CountError = {
                    error: distinctErrors[i],
                    count: errArr[i].length,
                    percent: String(fullPercernt).substring(0, String(fullPercernt).indexOf('.') + 3)
                }

                errorServer.errors.push(countErr);
            }
            console.timeEnd("getStatisticData");

            result.push(errorServer);

            if(result[0].errors.length < 2) return result;

            console.time("sort");
            result[0].errors = result[0].errors.sort((a, b) => b.count - a.count);
            console.timeEnd("sort");

            return result;
        }
    };

    async statisticByAllRequests(data: GetLogByDate): Promise<number | RequestServer[]> {
        if(!data.dateTo) data.dateTo = dayjs().hour(23).minute(59).second(59).toISOString();
        data.dateFrom = dayjs(data.dateFrom).hour(0).minute(0).second(0).toISOString();

        let logs: RequestInfo[] | undefined;
        const result: RequestServer[] = [];
        
        if(data.server === 'all') {
            logs = await RequestDB.getRequestByDate(data);
            if(!logs || !logs[0]) return 1;
            
            const servers: string[] = logs.map(el => el.host);
            const distinctServers: string[] = Array.from(new Set(servers));
            
            for(let i = distinctServers.length - 1; i >= 0; i--) {
                const requests: string[] = logs.filter(p => p.host === distinctServers[i]).map(p => p.path);
                const distinctRequests: string[] = Array.from(new Set(requests));
                
                const requestServer: RequestServer = {
                    server: distinctServers[i],
                    requests: [],
                    count: 0
                };

                for(let j = distinctRequests.length - 1; j >= 0; j--) {
                    const percent: number = requests.filter(el => el === distinctRequests[j]).length / (requests.length / 100);
                    const method: string = logs.filter(p => p.path === distinctRequests[0])[0].method; 
                    const countRequest: CountRequest = {
                        request: distinctRequests[j],
                        method: method, 
                        count: requests.filter(p => p === distinctRequests[j]).length,
                        percent: String(percent).substring(0, String(percent).indexOf('.') + 4)
                    };
                    requestServer.requests.push(countRequest);
                }
                
                requestServer.requests.sort((a, b) => b.count - a.count);
                requestServer.count = logs.length;
                result.push(requestServer);
            }
            return result;
        }
        else {
            logs = await RequestDB.getRequestByDateServer(data);
            
            if(!logs || !logs[0]) return 1;
            
            const paths: string[] = logs.map(p => p.path);
            const distinctPaths: string[] = Array.from(new Set(paths));
            const rquests: CountRequest[] = [];
            
            for(let i = distinctPaths.length - 1; i >= 0; i--) {
                const percent: number = paths.filter(el => el === distinctPaths[i]).length / (paths.length / 100);
                const method: string = logs.filter(p => p.path === distinctPaths[0])[0].method;

                const request: CountRequest = {
                    request: distinctPaths[i],
                    method: method,
                    count: paths.filter(p => p === distinctPaths[i]).length,
                    percent: String(percent).substring(0, String(percent).indexOf('.') + 4)
                };
                rquests.push(request);
            }
            
            rquests.sort((a, b) => b.count - a.count);
            const rquestsServer: RequestServer = { 
                server: data.server,
                requests: rquests,
                count: logs.length
            };

            result.push(rquestsServer);
            return result;
        }    
    };
};

export default new Service();