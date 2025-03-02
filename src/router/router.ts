import Router, { Express } from 'express';
import Controller from '../controller/Controller';
import { check } from 'express-validator';

const router: Express = Router();

// POST
router.post('/getLogById', [check('hash').notEmpty()], Controller.getLogByHash);
router.post('/getLogByDate', [check('dateFrom').notEmpty()], [check('server').notEmpty()], Controller.getLogByDate);
router.get('/getServices', Controller.getServices);
router.post('/statisticByError',[check('dateFrom').notEmpty()], [check('server').notEmpty()], Controller.getStatistic);
router.post('/statisticByAllRequests',[check('dateFrom').notEmpty()], [check('server').notEmpty()], Controller.statisticByAllRequests);
export default router;