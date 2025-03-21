import { Request, Response } from 'express';
import { TestService } from '../services/testService';

export class TestController {
  private testService: TestService;

  constructor() {
    this.testService = new TestService();
    this.testConnections = this.testConnections.bind(this);
  }

  async testConnections(req: Request, res: Response) {
    try {
      const result = await this.testService.testConnections();
      return res.json(result);
    } catch (error: any) {
      console.error('Erro no controlador de teste:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      });
    }
  }
} 