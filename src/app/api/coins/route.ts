import { NextResponse } from 'next/server';
import { fetchCoins } from '@/lib/crypto-api';
import { Currency } from '@/types/crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = (searchParams.get('currency') || 'usd') as Currency;
    const page = parseInt(searchParams.get('page') || '1');
    
    const coins = await fetchCoins(currency, page, 50);
    
    return NextResponse.json(coins);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coins' },
      { status: 500 }
    );
  }
}
