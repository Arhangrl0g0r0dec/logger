import { ConsumerKafka, TransportKafka } from 'loglab';
import { config } from '../config/config';

//export const kafka: Publisher = new Publisher(config.kafka.hosts, config.kafka.client, false, 4);
export const transport: TransportKafka = new TransportKafka(config.kafka.hosts, config.kafka.client, true, 4);
export const consumer: ConsumerKafka = transport.createConsumer(config.kafka.groupId, [config.kafka.topics.log]);