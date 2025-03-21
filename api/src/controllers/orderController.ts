import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      if (!orderId || !status) {
        return res.status(400).json({ error: 'ID do pedido e status são obrigatórios' });
      }

      const result = await this.orderService.updateOrderStatus(orderId, status);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro no controlador de pedidos:', error);
      return res.status(500).json({ error: error.message || 'Erro interno do servidor' });
    }
  }
} 