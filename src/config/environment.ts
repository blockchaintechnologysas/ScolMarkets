export const platformName = import.meta.env.VITE_PLATFORM_NAME ?? 'ScolMarkets';
export const networkName = import.meta.env.VITE_NETWORK_NAME ?? 'Scol Blockchain Network';
export const priceContractAddress = (import.meta.env.VITE_PRICE_CONTRACT_ADDRESS ?? '').trim();
export const walletSetupUrl = (import.meta.env.VITE_WALLET_SETUP_URL ?? 'https://docs.scolcoin.com/wallets/evm-network').trim();

const parseChainId = (): string | null => {
  const raw = (import.meta.env.VITE_CHAIN_ID ?? '').trim();

  if (!raw) {
    return null;
  }

  if (raw.startsWith('0x')) {
    const normalized = raw.toLowerCase();
    return /^0x[0-9a-f]+$/i.test(normalized) ? normalized : null;
  }

  const decimal = Number.parseInt(raw, 10);
  if (!Number.isFinite(decimal) || decimal <= 0) {
    return null;
  }

  return `0x${decimal.toString(16)}`;
};

const parseNativeCurrency = () => {
  const name = (import.meta.env.VITE_NATIVE_CURRENCY_NAME ?? 'Scolcoin').trim() || 'Scolcoin';
  const symbol = (import.meta.env.VITE_NATIVE_CURRENCY_SYMBOL ?? 'SCOL').trim() || 'SCOL';
  const decimalsRaw = (import.meta.env.VITE_NATIVE_CURRENCY_DECIMALS ?? '18').trim();
  const decimalsParsed = Number.parseInt(decimalsRaw, 10);
  const decimals = Number.isFinite(decimalsParsed) && decimalsParsed > 0 ? decimalsParsed : 18;

  return { name, symbol, decimals } as const;
};

export const chainId = parseChainId();
export const nativeCurrency = parseNativeCurrency();
export const blockExplorerUrl = (import.meta.env.VITE_BLOCK_EXPLORER_URL ?? 'https://explorador.scolcoin.com/').trim();

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
