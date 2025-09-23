import type { TokenPrice } from './price.ts';

export interface Token {
  symbol: string;
  name: string;
  address: string;
  logo: string;
  website: string;
  description: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  isNative?: boolean;
  priceId?: string;
  priceData?: TokenPrice;
}
