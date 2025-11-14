'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Coin, Currency, SortOption } from '@/types/crypto';
import CoinCard from '@/components/coin-card';
import CoinCardSkeleton from '@/components/coin-card-skeleton';
import DashboardHeader from '@/components/dashboard-header';
import ErrorState from '@/components/error-state';
import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CryptoDashboardProps {
  initialCoins: Coin[];
}

export default function CryptoDashboard({ initialCoins }: CryptoDashboardProps) {
  const [coins, setCoins] = useState<Coin[]>(initialCoins);
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState<Currency>('usd');
  const [sortBy, setSortBy] = useState<SortOption>('market_cap');
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crypto-watchlist');
    if (saved) {
      setWatchlist(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('crypto-watchlist', JSON.stringify(Array.from(watchlist)));
  }, [watchlist]);

  // Fetch coins when currency changes
  useEffect(() => {
    const fetchNewCurrency = async () => {
      setIsRefreshing(true);
      try {
        const response = await fetch(`/api/coins?currency=${currency}&page=1`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setCoins(data);
        setPage(1);
        setHasError(false);
      } catch (error) {
        setHasError(true);
        toast({
          title: 'Error',
          description: 'Failed to fetch coins in selected currency',
          variant: 'destructive',
        });
      } finally {
        setIsRefreshing(false);
      }
    };

    if (currency !== 'usd' || coins.length === 0) {
      fetchNewCurrency();
    }
  }, [currency]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/coins?currency=${currency}&page=1`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCoins(data);
      setPage(1);
      setHasError(false);
      toast({
        title: 'Refreshed',
        description: 'Market data updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh data',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/coins?currency=${currency}&page=${nextPage}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCoins((prev) => [...prev, ...data]);
      setPage(nextPage);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load more coins',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const toggleWatchlist = useCallback((coinId: string) => {
    setWatchlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(coinId)) {
        newSet.delete(coinId);
        toast({
          title: 'Removed from watchlist',
          description: 'Coin removed from your watchlist',
        });
      } else {
        newSet.add(coinId);
        toast({
          title: 'Added to watchlist',
          description: 'Coin added to your watchlist',
        });
      }
      return newSet;
    });
  }, [toast]);

  const filteredAndSortedCoins = useMemo(() => {
    let filtered = coins;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.current_price - a.current_price;
        case 'change':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'market_cap':
        default:
          return b.market_cap - a.market_cap;
      }
    });

    return sorted;
  }, [coins, searchQuery, sortBy]);

  if (hasError && coins.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currency={currency}
          onCurrencyChange={setCurrency}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <ErrorState onRetry={handleRefresh} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currency={currency}
        onCurrencyChange={setCurrency}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <main className="container mx-auto px-4 py-8">
        {isRefreshing && coins.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <CoinCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedCoins.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedCoins.map((coin) => (
                <CoinCard
                  key={coin.id}
                  coin={coin}
                  currency={currency}
                  isInWatchlist={watchlist.has(coin.id)}
                  onToggleWatchlist={toggleWatchlist}
                />
              ))}
            </div>

            {!searchQuery && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  size="lg"
                  variant="outline"
                  className="gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}