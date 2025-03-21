import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Cliente para a primeira base (drivers)
export const supabaseDrivers = createClient(
  process.env.SUPABASE_DRIVERS_URL!,
  process.env.SUPABASE_DRIVERS_SERVICE_KEY!
);

// Cliente para a segunda base (restaurants)
export const supabaseRestaurants = createClient(
  process.env.SUPABASE_RESTAURANTS_URL!,
  process.env.SUPABASE_RESTAURANTS_SERVICE_KEY!
); 