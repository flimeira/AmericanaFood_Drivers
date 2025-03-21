import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseDrivers } from '../config/supabase';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [, token] = authHeader.split(' ');

    // Verifica o token no Supabase
    const { data: { user }, error } = await supabaseDrivers.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Erro na autenticação' });
  }
}; 