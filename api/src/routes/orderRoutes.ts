import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const orderController = new OrderController();

// Rota para atualizar o status do pedido
router.put('/:orderId/status', authMiddleware, orderController.updateOrderStatus);

export default router; 