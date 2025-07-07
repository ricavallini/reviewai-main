import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// Hook para produtos
export const useProducts = (userId?: string) => {
  const [products, setProducts] = useState<Tables['products']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Subscription para mudanças em tempo real
    const subscription = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [payload.new as Tables['products']['Row'], ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev => prev.map(product => 
              product.id === payload.new.id ? payload.new as Tables['products']['Row'] : product
            ));
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(product => product.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const addProduct = async (productData: Tables['products']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao adicionar produto');
    }
  };

  const updateProduct = async (id: string, updates: Tables['products']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar produto');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao deletar produto');
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

// Hook para reviews
export const useReviews = (productId?: string) => {
  const [reviews, setReviews] = useState<Tables['reviews']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .order('review_date', { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar avaliações');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Subscription para mudanças em tempo real
    const subscription = supabase
      .channel('reviews_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reviews',
          filter: `product_id=eq.${productId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReviews(prev => [payload.new as Tables['reviews']['Row'], ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setReviews(prev => prev.map(review => 
              review.id === payload.new.id ? payload.new as Tables['reviews']['Row'] : review
            ));
          } else if (payload.eventType === 'DELETE') {
            setReviews(prev => prev.filter(review => review.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [productId]);

  const addReview = async (reviewData: Tables['reviews']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao adicionar avaliação');
    }
  };

  const updateReview = async (id: string, updates: Tables['reviews']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar avaliação');
    }
  };

  return {
    reviews,
    loading,
    error,
    addReview,
    updateReview
  };
};

// Hook para alertas
export const useAlerts = (userId?: string) => {
  const [alerts, setAlerts] = useState<Tables['alerts']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAlerts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar alertas');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Subscription para mudanças em tempo real
    const subscription = supabase
      .channel('alerts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'alerts',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAlerts(prev => [payload.new as Tables['alerts']['Row'], ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(prev => prev.map(alert => 
              alert.id === payload.new.id ? payload.new as Tables['alerts']['Row'] : alert
            ));
          } else if (payload.eventType === 'DELETE') {
            setAlerts(prev => prev.filter(alert => alert.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao marcar alerta como lido');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao marcar todos os alertas como lidos');
    }
  };

  return {
    alerts,
    loading,
    error,
    markAsRead,
    markAllAsRead
  };
};

// Hook para configurações do usuário
export const useUserSettings = (userId?: string) => {
  const [settings, setSettings] = useState<Tables['user_settings']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const updateSettings = async (updates: Tables['user_settings']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar configurações');
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings
  };
};

// Hook para credenciais de marketplace
export const useMarketplaceCredentials = (userId?: string) => {
  const [credentials, setCredentials] = useState<Tables['marketplace_credentials']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchCredentials = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('marketplace_credentials')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setCredentials(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar credenciais');
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, [userId]);

  const saveCredentials = async (credentialData: Tables['marketplace_credentials']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('marketplace_credentials')
        .upsert(credentialData, { 
          onConflict: 'user_id,marketplace' 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao salvar credenciais');
    }
  };

  return {
    credentials,
    loading,
    error,
    saveCredentials
  };
};

export function useSupabaseUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  return user;
}