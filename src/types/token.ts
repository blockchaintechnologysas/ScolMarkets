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
}
