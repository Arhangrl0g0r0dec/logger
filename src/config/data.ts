
import {Config} from './models/configModel';

export const configData: Config = {
    server: {
        host: 'localhost',
        port: 3000,
    },
    db: {
        mongoDB: {
            connectionString: 'mongodb://mongologger:2222@localhost:20000/logger?authSource=logger'
        }
    },
    kafka: {
        hosts: ["localhost:9092"],
        topics: {
            log: 'log'
        },
        groupId: 'logger',
        client: 'clientLogger'
    },
    error: {
        getLogById: {
            notParam: '1.1.1 - Недостаточно параметров',
            dataNotFound: '1.1.2 - Данные не найдены',
            serverError: '1.1.3 - Ошибка сервера'
        },
        getLogByDate: {
            notParam: '2.2.1 - Недостаточно параметров',
            dataNotFound: '2.2.2 - Данные не найдены',
            serverError: '2.2.3 - Ошибка сервера'
        },
        getServices: {
            serverError: '3.3.1 - Ошибка сервера'
        },
        statisticByError: {
            notParam: '4.4.1 - Недостаточно параметров',
            dataNotFound: '4.4.2 - Данные не найдены',
            serverError: '4.4.3 - Ошибка сервера'
        },
        statisticByAllRequests :{
            notParam: '5.5.1 - Недостаточно параметров',
            dataNotFound: '5.5.2 - Данные не найдены',
            serverError: '5.5.3 - Ошибка сервера',
        }
    },
    requests: ["/getLogById", "/getLogByDate", "/getServices", "/statisticByError", "/statisticByAllRequests"],
    connectedServers: []
};