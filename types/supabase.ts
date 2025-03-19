export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          created_at: string
          order_number: string
          Customer_Address: string
          restaurant_name: string
          total_amount: number
          status: 'pending' | 'accepted' | 'rejected' | 'delivered'
          driver_id: string | null
          customer_id: string
          restaurant_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          order_number: string
          Customer_Address: string
          restaurant_name: string
          total_amount: number
          status?: 'pending' | 'accepted' | 'rejected' | 'delivered'
          driver_id?: string | null
          customer_id: string
          restaurant_id: string
        }
        Update: {
          id?: string
          created_at?: string
          order_number?: string
          Customer_Address?: string
          restaurant_name?: string
          total_amount?: number
          status?: 'pending' | 'accepted' | 'rejected' | 'delivered'
          driver_id?: string | null
          customer_id?: string
          restaurant_id?: string
        }
      }
      order_history: {
        Row: {
          id: number
          created_at: string
          order_id: number
          action: string
        }
        Insert: {
          id?: number
          created_at?: string
          order_id: number
          action: string
        }
        Update: {
          id?: number
          created_at?: string
          order_id?: number
          action?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 