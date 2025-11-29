import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RoamBuddyProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  dataAmount?: string;
  validity?: string;
  coverage?: (string | { country_name: string; country_code: string; [key: string]: any })[];
  destination?: string;
}

export const useRoamBuddyAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAPI = async (action: string, data: any = {}) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: apiError } = await supabase.functions.invoke('roambuddy-api', {
        body: { action, ...data }
      });

      if (apiError) throw apiError;
      if (result.error) throw new Error(result.error);

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch RoamBuddy data';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAllProducts = async () => {
    return callAPI('getAllProducts');
  };

  const getServices = async (destination?: string) => {
    return callAPI('getServices', { destination });
  };

  const getDestinations = async () => {
    return callAPI('getDestinations');
  };

  const getCountries = async () => {
    return callAPI('getCountries');
  };

  const getWellnessPackages = async (params?: {
    destination?: string;
    wellness_type?: string;
    duration?: string;
  }) => {
    return callAPI('getWellnessPackages', params);
  };

  const createOrder = async (orderData: {
    product_id: string;
    customer_name: string;
    customer_email: string;
    product_name: string;
    amount: number;
    currency?: string;
    destination?: string;
  }) => {
    return callAPI('createOrder', orderData);
  };

  const getOrderedEsims = async () => {
    return callAPI('getOrderedEsims');
  };

  const activateEsim = async (iccid: string) => {
    return callAPI('activateEsim', { iccid });
  };

  const trackOrder = async (orderId: string) => {
    return callAPI('trackOrder', { orderId });
  };

  return {
    loading,
    error,
    getAllProducts,
    getServices,
    getDestinations,
    getCountries,
    getWellnessPackages,
    createOrder,
    getOrderedEsims,
    activateEsim,
    trackOrder
  };
};
