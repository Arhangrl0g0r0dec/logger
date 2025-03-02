import fs from 'fs';
import express, { Request, Response } from 'express';
import { config } from './config/config';
import morgan from 'morgan';
import dayjs from 'dayjs';
import router from './router/router';
import { connectMongo, disconnectMongo } from './db/schemasMongo';
import swaggerUI from 'swagger-ui-express';
import swaggerOptions from './swagger/documentation.json';
import { consumer } from './kafka/kafka';
import { Handler } from './handler/Handler';
import { RequestInfo } from './config/models/requestModel';

config.addDir();
const app = express();
app.use(express.json());
app.use(morgan('combined', { stream: fs.createWriteStream(`./data/log/${dayjs().format('DD-MM-YYYY')}.log`, { flags: 'a' }) }));
app.use(morgan('dev'));
/**
 * Подключение к БД mongo
 * Подключение к Kafka
 * Запуск прослушивания топика
 */

(async () => {
    await connectMongo();
    const handler: Handler = new Handler();
    await consumer.kafkaConsumer(handler);
})();
/**
 * Прослушивание события завершения процесса node.js
 * Если событие наступило, то отключаемся от kafka и mongo
 */
process.on('exit', async() => {
    await disconnectMongo();
    await consumer.disconnectConsumer();
});
/**
 * Прослушивание события завершения процесса node.js вручную например Ctrl+C
 * Если событие наступило, то отключаемся от kafka и mongo
 */
process.on('SIGINT', async() => {
    await disconnectMongo();
    await consumer.disconnectConsumer();
    process.exit(0);
});

app.use('/', router);
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerOptions));
app.use((req: any, res: any) => res.status(404).json({ error: true, message: '404 request not found', DATA: {}, warning: '' }));
app.listen(config.server.port, config.server.host, () => console.log(`Server starting on http://${config.server.host}:${config.server.port}`));
export default app;