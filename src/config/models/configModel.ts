import { Response } from 'express';

export interface Config {
    server: {
        host: string,
        port: number
    },
    db: {
        mongoDB: {
            connectionString: string
        }
    },
    kafka: {
        hosts: string[],
        topics : {
            log : string 
        },
        groupId: string,
        client: string
    }
    error: {
        getLogById: {
            notParam: string,
            dataNotFound: string,
            serverError: string
        },
        getLogByDate: {
            notParam: string,
            dataNotFound: string,
            serverError: string
        },
        getServices: {
            serverError: string
        },
        statisticByError: {
            notParam: string,
            dataNotFound: string,
            serverError: string
        },
        statisticByAllRequests: {
            notParam: string,
            dataNotFound: string,
            serverError: string
        }
    },
    connectedServers: string[],
    requests: string[]
};

export interface ConfigMethods extends Config {
    addDir(): void,
    errorData(error: string, method: string, status: number, module: string): void,
    getResponse(error: string, status: number, data: any, warning: string, res: Response): void
};