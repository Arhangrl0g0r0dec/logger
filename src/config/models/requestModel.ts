export type ResponseData = {
    error: boolean,
    message: string,
    DATA: any,
    warning: string
};

export type Hash = {
    hash: string
};

export type GetLogByDate = {
    dateFrom: string,
    dateTo?: string,
    server: string
}

export type Step = {
    level: string,
    dataStep: DataStep
}

export type DataStep = {
    data: string,
    result?: any[]
}

export type ErrorsServer = {
    errors: CountError[],
    server: string | undefined,
    countErr: number
}

export type RequestServer = {
    requests: CountRequest[],
    server: string | undefined,
    count: number
}

export type CountError = {
    error: string,
    count: number,
    percent: string
}

export type MessageLogMongo = {
    server: string | undefined;
    hash: string;
    pid: number;
    request: {
        id: any;
        method: string;
        path: string;
        requestTime: Date;
        headers: {
            Host: string | undefined;
            ContentType: string | undefined;
        };
        body: string;
    };
    response: {
        status: number;
        body: any;
        responseTime: Date;
    };
    time: number;
    steps: Step[];
}

export type RequestInfo = {
    method: string,
    path: string,
    requestTime: Date,
    host: string
}

export type CountRequest = {
    request: string,
    method: string,
    count: number,
    percent: string
}

export type MessageLogResponse = {
    server: string | undefined;
    hash: string;
    pid: number;
    request: {
        id: any;
        method: string;
        path: string;
        requestTime: string;
        headers: {
            Host: string | undefined;
            ContentType: string | undefined;
        };
        body: string;
    };
    response: {
        status: number;
        body: any;
        responseTime: string;
    };
    time: number;
    steps: Step[];
}