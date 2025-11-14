'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Settings } from 'lucide-react';
import { Currency, SortOption } from '@/types/crypto';
import { ThemeSwitcher } from './theme-switcher';

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function DashboardHeader({
  searchQuery,
  onSearchChange,
  currency,
  onCurrencyChange,
  sortBy,
  onSortChange,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500">
              <span className="text-2xl">₿</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Crypto Market</h1>
              <p className="text-sm text-muted-foreground">Live cryptocurrency prices</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={currency} onValueChange={(value) => onCurrencyChange(value as Currency)}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD $</SelectItem>
                <SelectItem value="eur">EUR €</SelectItem>
                <SelectItem value="gbp">GBP £</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market_cap">Market Cap</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="change">24h Change</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
