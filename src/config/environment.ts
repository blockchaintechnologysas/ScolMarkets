export const platformName = import.meta.env.VITE_PLATFORM_NAME ?? 'ScolMarkets';
export const networkName = import.meta.env.VITE_NETWORK_NAME ?? 'Scol Blockchain Network';
export const priceContractAddress = (import.meta.env.VITE_PRICE_CONTRACT_ADDRESS ?? '').trim();
export const rpcUrl = (import.meta.env.VITE_RPC_URL ?? '').trim();
