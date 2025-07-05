import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          company: string | null;
          plan: 'free' | 'basic' | 'premium' | 'enterprise';
          is_admin: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          company?: string | null;
          plan?: 'free' | 'basic' | 'premium' | 'enterprise';
          is_admin?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          company?: string | null;
          plan?: 'free' | 'basic' | 'premium' | 'enterprise';
          is_admin?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          price: number;
          marketplace_url: string;
          marketplace: string | null;
          image_url: string | null;
          description: string | null;
          avg_rating: number;
          total_reviews: number;
          recent_reviews: number;
          trend: 'up' | 'down' | 'stable';
          last_analysis: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          price: number;
          marketplace_url: string;
          marketplace?: string | null;
          image_url?: string | null;
          description?: string | null;
          avg_rating?: number;
          total_reviews?: number;
          recent_reviews?: number;
          trend?: 'up' | 'down' | 'stable';
          last_analysis?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          price?: number;
          marketplace_url?: string;
          marketplace?: string | null;
          image_url?: string | null;
          description?: string | null;
          avg_rating?: number;
          total_reviews?: number;
          recent_reviews?: number;
          trend?: 'up' | 'down' | 'stable';
          last_analysis?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          rating: number;
          comment: string;
          author: string;
          review_date: string;
          sentiment: 'positive' | 'negative' | 'neutral';
          category: string | null;
          keywords: string[];
          ai_response: string | null;
          is_urgent: boolean;
          marketplace_review_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          rating: number;
          comment: string;
          author: string;
          review_date: string;
          sentiment?: 'positive' | 'negative' | 'neutral';
          category?: string | null;
          keywords?: string[];
          ai_response?: string | null;
          is_urgent?: boolean;
          marketplace_review_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          rating?: number;
          comment?: string;
          author?: string;
          review_date?: string;
          sentiment?: 'positive' | 'negative' | 'neutral';
          category?: string | null;
          keywords?: string[];
          ai_response?: string | null;
          is_urgent?: boolean;
          marketplace_review_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      marketplace_credentials: {
        Row: {
          id: string;
          user_id: string;
          marketplace: string;
          api_key: string | null;
          secret_key: string | null;
          access_token: string | null;
          store_id: string | null;
          webhook_url: string | null;
          is_active: boolean;
          last_sync: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          marketplace: string;
          api_key?: string | null;
          secret_key?: string | null;
          access_token?: string | null;
          store_id?: string | null;
          webhook_url?: string | null;
          is_active?: boolean;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          marketplace?: string;
          api_key?: string | null;
          secret_key?: string | null;
          access_token?: string | null;
          store_id?: string | null;
          webhook_url?: string | null;
          is_active?: boolean;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          product_id: string | null;
          review_id: string | null;
          type: 'critical' | 'warning' | 'info' | 'success';
          title: string;
          message: string;
          is_read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id?: string | null;
          review_id?: string | null;
          type: 'critical' | 'warning' | 'info' | 'success';
          title: string;
          message: string;
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string | null;
          review_id?: string | null;
          type?: 'critical' | 'warning' | 'info' | 'success';
          title?: string;
          message?: string;
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark' | 'auto';
          color_scheme: 'blue' | 'green' | 'purple' | 'orange';
          font_size: 'small' | 'medium' | 'large';
          sidebar_collapsed: boolean;
          animations: boolean;
          compact_mode: boolean;
          email_notifications: boolean;
          whatsapp_notifications: boolean;
          push_notifications: boolean;
          whatsapp_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: 'light' | 'dark' | 'auto';
          color_scheme?: 'blue' | 'green' | 'purple' | 'orange';
          font_size?: 'small' | 'medium' | 'large';
          sidebar_collapsed?: boolean;
          animations?: boolean;
          compact_mode?: boolean;
          email_notifications?: boolean;
          whatsapp_notifications?: boolean;
          push_notifications?: boolean;
          whatsapp_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: 'light' | 'dark' | 'auto';
          color_scheme?: 'blue' | 'green' | 'purple' | 'orange';
          font_size?: 'small' | 'medium' | 'large';
          sidebar_collapsed?: boolean;
          animations?: boolean;
          compact_mode?: boolean;
          email_notifications?: boolean;
          whatsapp_notifications?: boolean;
          push_notifications?: boolean;
          whatsapp_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}