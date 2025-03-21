import { Router } from 'express';
import { TestController } from '../controllers/testController';

const router = Router();
const testController = new TestController();

// Rota para testar as conexões
router.get('/connections', testController.testConnections);

export default router; 