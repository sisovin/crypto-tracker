import { Coin, Currency } from '@/types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchCoins(
  currency: Currency = 'usd',
  page: number = 1,
  perPage: number = 50
): Promise<Coin[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
}

export function formatPrice(price: number, currency: Currency): string {
  const symbols = { usd: '$', eur: '€', gbp: '£' };
  
  if (price >= 1) {
    return `${symbols[currency]}${price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
  
  return `${symbols[currency]}${price.toFixed(6)}`;
}

export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  }
  if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  }
  if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  }
  return `$${marketCap.toLocaleString()}`;
}
