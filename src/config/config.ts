import { ConfigMethods } from './models/configModel';
import { configData } from './data';
import fs from 'fs';
import dayjs from 'dayjs';
import { ResponseData } from './models/requestModel';

export const config: ConfigMethods = {
    server: configData.server,
    db: configData.db,
    kafka: configData.kafka,
    error: configData.error,
    connectedServers: configData.connectedServers,
    requests: configData.requests,
    addDir: () => {
        fs.mkdirSync('./data', { recursive: true });
        fs.mkdirSync('./data/log', { recursive: true });
    },
    errorData: (error, method, status, module) => {
        const messageError: string = `
===================================================================
Дата/Время: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}
Модуль: ${module}
Метод: ${method}
Статус ошибки: ${status}
Описание: ${error}
===================================================================
        `;
        fs.mkdirSync('./data/log/error', { recursive: true });
        fs.writeFileSync(`./data/log/error/${dayjs().format('DD-MM-YYYY')}.log`, `${messageError}\r\n`, { flag: 'a' });
    },
    getResponse: (error, status, DATA, warning, res) => {
        const response: ResponseData = {
            error: false,
            message: '',
            DATA,
            warning
        };

        if (error !== '') {
            response.DATA = {};
            response.error = true;
            response.message = error;
            return res.status(status).json(response);
        };

        res.status(status).json(response);
    }
};