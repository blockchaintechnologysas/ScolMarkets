import type { TokenPrice } from './price.ts';

export type TokenSocialKey =
  | 'facebook'
  | 'instagram'
  | 'x'
  | 'youtube'
  | 'tiktok'
  | 'reddit'
  | 'telegram'
  | 'discord';

export type TokenSocialLinks = Partial<Record<TokenSocialKey, string>>;

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
  totalSupply?: number | null;
  maxSupply?: number | null;
  circulatingSupply?: number | null;
  isNative?: boolean;
  priceId?: string;
  priceData?: TokenPrice;
  socials?: TokenSocialLinks;
}
