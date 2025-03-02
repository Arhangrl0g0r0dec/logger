import { ErrorsServer, GetLogByDate, Hash, MessageLogResponse, RequestServer } from '../config/models/requestModel';
import { RequestWithBody } from '../config/types';
import { Response } from 'express';
import Service from '../service/Servise';
import { config } from '../config/config';
import { Result, validationResult } from 'express-validator';

class Controller {
    async getLogByHash(req: RequestWithBody<Hash>, res: Response) {

        /*
        #swagger.description = 'Получение данных логов по hash'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Hash лога',
            schema: { $ref: '#securityDefinitions/hash'},
        } */
        /*  
            #swagger.responses[200] = {
                description: 'Успешный запрос',
                schema: { $ref: '#securityDefinitions/successLog' }
            },
            #swagger.responses[400] = {
                description: 'Ошибка',
                schema: { $ref: '#securityDefinitions/error'}
            },
            #swagger.responses[500] = {
                description: 'Ошибка',
                schema: { $ref: '#securityDefinitions/error'}
            }
        */

        const method: string = 'getLogByHash';

        try {

            const error: Result = validationResult(req);

            if (!error.isEmpty()){
                config.errorData(config.error.getLogById.notParam, method, 400, 'Controller.ts');
                return config.getResponse(config.error.getLogById.notParam, 400, '', '', res);
            };

            const hash: Hash = {
                hash: req.body.hash
            };

            const result: number | MessageLogResponse[] = await Service.getLogByHash(hash.hash);

            switch(result) {
                case 1: {
                    config.errorData(config.error.getLogById.dataNotFound, method, 400, 'Controller.ts');
                    return config.getResponse(config.error.getLogById.dataNotFound, 400, '', '', res);
                };
                default: return config.getResponse('', 200, result, '', res);
            };

        } catch(error: any) {
            config.errorData(error, method, 500, 'Controller.ts');
            return config.getResponse(config.error.getLogById.serverError, 500, '', '', res);
        };
    };

    async getLogByDate(req: RequestWithBody<GetLogByDate>, res: Response) {

        /*
        #swagger.description = 'Получение данных логов по dateTo и dateFrom для конкретного сервера server'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Данные для получения лога:<br />dateFrom - дата, с которой начнется поиск<br />dateTo - дата до которой осуществляется поиск (до 23:59:59), необязательный параметр<br />server - название сервиса,
            на котором надо искать, если отправить параметр со значением all, то выведутся все логи со всех сервисов за выбранный период',
            schema: { $ref: '#securityDefinitions/getLogByDate' }
        },  
        #swagger.responses[200] = {
            description: 'Успешный запрос',
            schema: { $ref: '#securityDefinitions/successLog' }
        },
        #swagger.responses[400] = {
            description: 'Ошибка',
            schema: { $ref: '#securityDefinitions/error'}
        },
        #swagger.responses[500] = {
            description: 'Ошибка',
            schema: { $ref: '#securityDefinitions/error'}
        }
        */

        const method: string = 'getLogByDate';

        try {

            const error: Result = validationResult(req);

            if (!error.isEmpty()){
                config.errorData(config.error.getLogByDate.notParam, method, 400, 'Controller.ts');
                return config.getResponse(config.error.getLogByDate.notParam, 400, '', '', res);
            };

            const data: GetLogByDate = {
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo,
                server: req.body.server
            };

            const result: number | MessageLogResponse[] = await Service.getLogByDate(data);

            switch(result) {
                case 1: {
                    config.errorData(config.error.getLogByDate.dataNotFound, method, 400, 'Controller.ts');
                    return config.getResponse(config.error.getLogByDate.dataNotFound, 400, '', '', res);
                };
                default: return config.getResponse('', 200, result, '', res);
            };

        } catch(error: any) {
            config.errorData(error, method, 500, 'Controller.ts');
            return config.getResponse(config.error.getLogByDate.serverError, 500, '', '', res);
        };
    };

    async getServices(req: RequestWithBody<GetLogByDate>, res: Response) {

        /*
        #swagger.description = 'Получение информации по сервисам'
        #swagger.responses[200] = {
            description: 'Успешный запрос',
            schema: { $ref: '#securityDefinitions/getServicesResponse' }
        },
        #swagger.responses[500] = {
            description: 'Ошибка',
            schema: { $ref: '#securityDefinitions/error'}
        }
        */

        const method: string = 'getServices';

        try {
            const result: string[] = await Service.getServices();
            return config.getResponse('', 200, { result }, '', res);
        } catch(error: any) {
            config.errorData(error, method, 500, 'Controller.ts');
            return config.getResponse(config.error.getLogByDate.serverError, 500, '', '', res);
        };
    };

    async getStatistic(req: RequestWithBody<GetLogByDate>, res: Response) {

        /*
        #swagger.description = 'Получение краткой статистики по ошибкам'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Данные для получения лога:<br />dateFrom - дата, с которой начнется поиск<br />dateTo - дата до которой осуществляется поиск (до 23:59:59), необязательный параметр<br />server - название сервиса,
            на котором надо искать, если отправить параметр со значением all, то выведется стстистика по всем сервисам за выбранный период',
            schema: { $ref: '#securityDefinitions/getLogByDate' }
        }, 
        #swagger.responses[200] = {
            description: 'Успешный запрос',
            schema: { $ref: '#securityDefinitions/getStatisticErrorResponse' }
        },
        #swagger.responses[400] = {
            description: 'Успешный запрос',
            schema: { $ref: '#securityDefinitions/error' }
        },
        #swagger.responses[500] = {
            description: 'Ошибка',
            schema: { $ref: '#securityDefinitions/error'}
        }
        */

        const method: string = 'getStatistic';

        const error: Result = validationResult(req);

        if (!error.isEmpty()){
            config.errorData(config.error.statisticByError.notParam, method, 400, 'Controller.ts');
            return config.getResponse(config.error.statisticByError.notParam, 400, '', '', res);
        };

        try {
            const data: GetLogByDate = {
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo,
                server: req.body.server
            };

            const result: number | ErrorsServer[] = await Service.getStatisticByError(data);
            switch(result) {
                case 1: {
                    config.errorData(config.error.statisticByError.dataNotFound, method, 400, 'Controller.ts');
                    return config.getResponse(config.error.statisticByError.dataNotFound, 400, '', '', res);
                }
                default: return config.getResponse('', 200, { result }, '', res);
            };
        } catch(error: any) {
            config.errorData(error, method, 500, 'Controller.ts');
            return config.getResponse(config.error.statisticByError.serverError, 500, '', '', res);
        };
    };

    async statisticByAllRequests(req: RequestWithBody<GetLogByDate>, res: Response) {

        /*
        #swagger.description = 'Получение краткой статистики по всем запросам'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Данные для получения логов:<br />dateFrom - дата, с которой начнется поиск<br />dateTo - дата до которой осуществляется поиск (до 23:59:59), необязательный параметр<br />server - название сервиса,
            на котором надо искать, если отправить параметр со значением all, то выведется стстистика по всем сервисам за выбранный период',
            schema: { $ref: '#securityDefinitions/getLogByDate' }
        }, 
        #swagger.responses[200] = {
            description: 'Успешный запрос',
            schema: { $ref: '#securityDefinitions/getStatisticErrorResponse' }
        },
        #swagger.responses[400] = {
            description: 'Успешный запрос',
            schema: { $ref: '#securityDefinitions/error' }
        },
        #swagger.responses[500] = {
            description: 'Ошибка',
            schema: { $ref: '#securityDefinitions/error'}
        }
        */

        const method: string = 'statisticByAllRequests';

        const error: Result = validationResult(req);

        if (!error.isEmpty()){
            config.errorData(config.error.statisticByAllRequests.notParam, method, 400, 'Controller.ts');
            return config.getResponse(config.error.statisticByAllRequests.notParam, 400, '', '', res);
        };

        try {
            const data: GetLogByDate = {
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo,
                server: req.body.server
            };

            const result: number | RequestServer[] = await Service.statisticByAllRequests(data);
            switch(result) {
                case 1: {
                    config.errorData(config.error.statisticByAllRequests.dataNotFound, method, 400, 'Controller.ts');
                    return config.getResponse(config.error.statisticByAllRequests.dataNotFound, 400, '', '', res);
                }
                default: return config.getResponse('', 200, { result }, '', res);
            };
        } catch(error: any) {
            config.errorData(error, method, 500, 'Controller.ts');
            return config.getResponse(config.error.statisticByAllRequests.serverError, 500, '', '', res);
        };
    };
};

export default new Controller();