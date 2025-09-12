import { useState, useEffect, useCallback } from 'react';

interface ExchangeRates {
  USD: number;
  ZAR: number;
  EUR: number;
  GBP: number;
}

interface CurrencyHook {
  convertToZAR: (amount: number, fromCurrency: string) => number;
  convertZARToUSD: (zarAmount: number) => number;
  formatZAR: (amount: number) => string;
  formatUSD: (amount: number) => string;
  formatCurrency: (amount: number, currency: string) => string;
  exchangeRates: ExchangeRates | null;
  isLoading: boolean;
  lastUpdated: Date | null;
}

const CACHE_KEY = 'exchange_rates';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Fallback rates in case API fails (approximate rates as of 2024)
const fallbackRates: ExchangeRates = {
  USD: 18.50, // 1 USD = 18.50 ZAR
  ZAR: 1,     // 1 ZAR = 1 ZAR
  EUR: 20.10, // 1 EUR = 20.10 ZAR
  GBP: 23.30  // 1 GBP = 23.30 ZAR
};

export const useCurrencyConverter = (): CurrencyHook => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getCachedRates = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        const now = new Date().getTime();
        if (now - data.timestamp < CACHE_DURATION) {
          return {
            rates: data.rates,
            timestamp: new Date(data.timestamp)
          };
        }
      }
    } catch (error) {
      console.warn('Failed to get cached exchange rates:', error);
    }
    return null;
  };

  const setCachedRates = (rates: ExchangeRates) => {
    try {
      const cacheData = {
        rates,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache exchange rates:', error);
    }
  };

  const fetchExchangeRates = useCallback(async () => {
    setIsLoading(true);
    
    // Try to use cached rates first
    const cached = getCachedRates();
    if (cached) {
      setExchangeRates(cached.rates);
      setLastUpdated(cached.timestamp);
      setIsLoading(false);
      return;
    }

    try {
      // Using exchangerate-api.io free tier (1500 requests/month)
      const response = await fetch('https://api.exchangerate-api.io/v4/latest/ZAR');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }

      const data = await response.json();
      
      // Convert the rates to ZAR base (how many ZAR per 1 unit of foreign currency)
      const rates: ExchangeRates = {
        USD: 1 / data.rates.USD, // Convert ZAR to USD rate to USD to ZAR rate
        ZAR: 1,
        EUR: 1 / data.rates.EUR,
        GBP: 1 / data.rates.GBP
      };

      setExchangeRates(rates);
      setLastUpdated(new Date());
      setCachedRates(rates);
      
    } catch (error) {
      console.warn('Failed to fetch live exchange rates, using fallback:', error);
      
      // Use fallback rates
      setExchangeRates(fallbackRates);
      setLastUpdated(new Date());
      setCachedRates(fallbackRates);
    }
    
    setIsLoading(false);
  }, []); // Remove fallbackRates dependency

  useEffect(() => {
    fetchExchangeRates();
  }, []); // Run only once on mount

  const convertToZAR = (amount: number, fromCurrency: string): number => {
    if (!exchangeRates || !amount) return 0;
    
    const currency = fromCurrency.toUpperCase();
    
    if (currency === 'ZAR' || currency === 'R') {
      return amount;
    }
    
    const rate = exchangeRates[currency as keyof ExchangeRates];
    if (!rate) {
      console.warn(`Exchange rate not found for ${currency}, using USD rate`);
      return amount * exchangeRates.USD;
    }
    
    return amount * rate;
  };

  const formatZAR = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount).replace('ZAR', 'R');
  };

  const convertZARToUSD = (zarAmount: number): number => {
    if (!exchangeRates || !zarAmount) return 0;
    return zarAmount / exchangeRates.USD;
  };

  const formatUSD = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatCurrency = (amount: number, currency: string): string => {
    if (currency === 'USD') return formatUSD(amount);
    return formatZAR(amount);
  };

  return {
    convertToZAR,
    convertZARToUSD,
    formatZAR,
    formatUSD,
    formatCurrency,
    exchangeRates,
    isLoading,
    lastUpdated
  };
};