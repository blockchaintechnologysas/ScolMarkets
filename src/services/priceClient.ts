import { priceContractAddress, rpcUrl } from '../config/environment.ts';
import type { TokenPrice } from '../types/price.ts';

const PRECIOS_SELECTOR = '0x1002aa9d';
const DECIMALS = 2n;
const WORD_SIZE = 64;
const ADDRESS_LENGTH = 40;

const textEncoder = new TextEncoder();
let requestId = 1;

const padHex = (value: string, size = WORD_SIZE) => value.padStart(size, '0');

const encodeStringArgument = (value: string) => {
  const bytes = Array.from(textEncoder.encode(value));
  const lengthHex = padHex(bytes.length.toString(16));
  const paddedLength = Math.ceil(bytes.length / 32) * 32;
  const dataHex = bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('').padEnd(paddedLength * 2, '0');
  const offsetHex = padHex((32).toString(16));

  return `${PRECIOS_SELECTOR}${offsetHex}${lengthHex}${dataHex}`;
};

const formatWithDecimals = (value: bigint): number => {
  const divisor = 10n ** DECIMALS;
  const whole = value / divisor;
  const fraction = value % divisor;
  return Number(whole) + Number(fraction) / Number(divisor);
};

const hexToBigInt = (hex: string): bigint => {
  if (!hex) {
    return 0n;
  }
  return BigInt(`0x${hex}`);
};

const decodePriceResult = (hex: string): TokenPrice | null => {
  if (!hex || hex === '0x') {
    return null;
  }

  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const expectedLength = WORD_SIZE * 10;
  if (clean.length < expectedLength) {
    return null;
  }

  const values = Array.from({ length: 8 }, (_, index) => {
    const start = index * WORD_SIZE;
    return clean.slice(start, start + WORD_SIZE);
  });

  const walletChunk = clean.slice(WORD_SIZE * 8, WORD_SIZE * 9);
  const statusChunk = clean.slice(WORD_SIZE * 9, WORD_SIZE * 10);
  const walletHex = walletChunk.slice(-ADDRESS_LENGTH).padStart(ADDRESS_LENGTH, '0');

  return {
    cop: formatWithDecimals(hexToBigInt(values[0])),
    usd: formatWithDecimals(hexToBigInt(values[1])),
    gbp: formatWithDecimals(hexToBigInt(values[2])),
    cny: formatWithDecimals(hexToBigInt(values[3])),
    jpy: formatWithDecimals(hexToBigInt(values[4])),
    eur: formatWithDecimals(hexToBigInt(values[5])),
    brl: formatWithDecimals(hexToBigInt(values[6])),
    btc: formatWithDecimals(hexToBigInt(values[7])),
    wallet: `0x${walletHex}`.toLowerCase(),
    status: hexToBigInt(statusChunk) !== 0n,
  };
};

export const fetchOnChainPrice = async (tokenName: string): Promise<TokenPrice | null> => {
  if (!priceContractAddress || !rpcUrl) {
    throw new Error('Missing price contract configuration');
  }

  const normalizedName = tokenName.trim();
  if (!normalizedName) {
    return null;
  }

  const data = encodeStringArgument(normalizedName);
  const payload = {
    jsonrpc: '2.0',
    id: requestId++,
    method: 'eth_call',
    params: [
      {
        to: priceContractAddress,
        data,
      },
      'latest',
    ],
  };

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`RPC call failed with status ${response.status}`);
  }

  const body = await response.json();

  if ('error' in body) {
    const message = body.error?.message ?? 'Unknown RPC error';
    throw new Error(message);
  }

  const result = typeof body.result === 'string' ? body.result : '';

  return decodePriceResult(result);
};
