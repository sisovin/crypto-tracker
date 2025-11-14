import CryptoDashboard from '@/components/crypto-dashboard';
import { fetchCoins } from '@/lib/crypto-api';
import { Toaster } from '@/components/ui/toaster';
import { Coin } from '@/types/crypto';

export default async function Page() {
  let initialCoins: Coin[] = [];
  
  try {
    initialCoins = await fetchCoins('usd', 1, 50);
  } catch (error) {
    console.error('Failed to fetch initial coins:', error);
  }

  return (
    <>
      <CryptoDashboard initialCoins={initialCoins} />
      <Toaster />
    </>
  );
}