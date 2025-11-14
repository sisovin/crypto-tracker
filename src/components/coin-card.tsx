'use client';

import { Coin, Currency } from '@/types/crypto';
import { formatPrice, formatMarketCap } from '@/lib/crypto-api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface CoinCardProps {
  coin: Coin;
  currency: Currency;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (coinId: string) => void;
}

export default function CoinCard({ 
  coin, 
  currency, 
  isInWatchlist = false,
  onToggleWatchlist 
}: CoinCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleWatchlistToggle = () => {
    setIsAnimating(true);
    onToggleWatchlist?.(coin.id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const priceChangeColor = coin.price_change_percentage_24h >= 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
    
  const priceChangeBg = coin.price_change_percentage_24h >= 0
    ? 'bg-green-50 dark:bg-green-950/30'
    : 'bg-red-50 dark:bg-red-950/30';

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
            <Image
              src={coin.image}
              alt={coin.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-semibold text-base">{coin.name}</h3>
            <p className="text-sm text-muted-foreground uppercase">{coin.symbol}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWatchlistToggle}
          className={`transition-transform ${isAnimating ? 'scale-125' : 'scale-100'}`}
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${
              isInWatchlist 
                ? 'fill-red-500 text-red-500' 
                : 'text-muted-foreground hover:text-red-500'
            }`}
          />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            {formatPrice(coin.current_price, currency)}
          </span>
          <Badge 
            variant="secondary" 
            className={`${priceChangeBg} ${priceChangeColor} font-semibold`}
          >
            {coin.price_change_percentage_24h >= 0 ? '+' : ''}
            {coin.price_change_percentage_24h.toFixed(2)}%
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Market Cap</span>
          <span className="font-medium">{formatMarketCap(coin.market_cap)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Rank</span>
          <span className="font-medium">#{coin.market_cap_rank}</span>
        </div>
      </div>
    </Card>
  );
}
