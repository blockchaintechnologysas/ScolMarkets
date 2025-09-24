export const platformName = import.meta.env.VITE_PLATFORM_NAME ?? 'ScolMarkets';
export const networkName = import.meta.env.VITE_NETWORK_NAME ?? 'Scol Blockchain Network';
export const priceContractAddress = (import.meta.env.VITE_PRICE_CONTRACT_ADDRESS ?? '').trim();

const defaultRpcUrls = [
  'https://mainnet-rpc.scolcoin.com',
  'https://mainrpc.scolcoin.com',
  'https://seed.scolcoin.com',
];

const parseConfiguredRpcUrls = (): string[] => {
  const envUrls: string[] = [];
  const singleUrl = (import.meta.env.VITE_RPC_URL ?? '').trim();
  const multiUrl = (import.meta.env.VITE_RPC_URLS ?? '').trim();

  if (singleUrl) {
    envUrls.push(singleUrl);
  }

  if (multiUrl) {
    envUrls.push(...multiUrl.split(',').map((value) => value.trim()).filter((value) => value.length > 0));
  }

  const combined = [...envUrls, ...defaultRpcUrls];
  const unique = combined.filter((value, index) => combined.indexOf(value) === index);

  return unique;
};

export const rpcUrls = parseConfiguredRpcUrls();
export const rpcUrl = rpcUrls[0] ?? '';
