// lib/shiprocket/tokenCache.ts

let tokenCache: {
  token: string | null;
  expiresAt: number; // Unix timestamp in milliseconds
} = {
  token: null,
  expiresAt: 0,
};

export function getShiprocketToken(): string | null {
  if (Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }
  return null;
}

export function setShiprocketToken(token: string, expiresInSeconds: number) {
  tokenCache = {
    token,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };
}


export function clearShiprocketToken() {
  tokenCache = {
    token: null,
    expiresAt: 0,
  };
}

export function isShiprocketTokenValid(): boolean {
  return tokenCache.token !== null && Date.now() < tokenCache.expiresAt;
}

export function getShiprocketTokenExpiration(): number {
  return tokenCache.expiresAt;
}

