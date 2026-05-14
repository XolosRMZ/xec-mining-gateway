import { ChronikClient } from "chronik-client";

import { config } from "../config";
import { MembershipStatus } from "../types";

const APPROVED_WALLETS = new Set([
  "ecash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
]);

const chronik = new ChronikClient(config.CHRONIK_URLS);

const normalizeWallet = (wallet: string): string => wallet.trim().toLowerCase();

const toBigInt = (value: unknown): bigint => {
  if (typeof value === "bigint") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    return BigInt(value.trim());
  }

  if (typeof value === "number" && Number.isInteger(value)) {
    return BigInt(value);
  }

  throw new Error("Unsupported token amount value");
};

export const getTokenAtomsFromUtxo = (utxo: unknown): bigint => {
  if (!utxo || typeof utxo !== "object") {
    return 0n;
  }

  const candidate = utxo as {
    token?: { tokenId?: unknown; atoms?: unknown };
    slpMeta?: { tokenId?: unknown };
    slpToken?: { amount?: unknown };
  };

  if (
    candidate.token?.tokenId === config.RMZ_TOKEN_ID &&
    candidate.token.atoms !== undefined
  ) {
    return toBigInt(candidate.token.atoms);
  }

  if (
    candidate.slpMeta?.tokenId === config.RMZ_TOKEN_ID &&
    candidate.slpToken?.amount !== undefined
  ) {
    return toBigInt(candidate.slpToken.amount);
  }

  return 0n;
};

export const isMockRmzMember = async (
  wallet: string,
): Promise<MembershipStatus> => {
  const normalizedWallet = wallet.trim().toLowerCase();

  // Prototype 5 mock registry remains available for local development.
  if (APPROVED_WALLETS.has(normalizedWallet)) {
    return {
      wallet: normalizedWallet,
      tier: "founding-miner",
      active: true,
      source: "mock",
    };
  }

  return {
    wallet: normalizedWallet,
    tier: "none",
    active: false,
    source: "mock",
  };
};

export const isChronikRmzMember = async (
  wallet: string,
): Promise<MembershipStatus> => {
  const normalizedWallet = normalizeWallet(wallet);

  try {
    const { utxos } = await chronik.address(normalizedWallet).utxos();
    const totalAtoms = utxos.reduce<bigint>(
      (sum, utxo) => sum + getTokenAtomsFromUtxo(utxo),
      0n,
    );

    return {
      wallet: normalizedWallet,
      tier:
        totalAtoms >= config.MIN_RMZ_ATOMS_REQUIRED ? "base" : "none",
      active: totalAtoms >= config.MIN_RMZ_ATOMS_REQUIRED,
      source: "chronik",
      rmzAtoms: totalAtoms.toString(),
      rmzRequiredAtoms: config.MIN_RMZ_ATOMS_REQUIRED.toString(),
      tokenId: config.RMZ_TOKEN_ID,
    };
  } catch {
    return {
      wallet: normalizedWallet,
      tier: "none",
      active: false,
      source: "chronik",
      rmzAtoms: "0",
      rmzRequiredAtoms: config.MIN_RMZ_ATOMS_REQUIRED.toString(),
      tokenId: config.RMZ_TOKEN_ID,
      error: "Chronik membership verification failed",
    };
  }
};

export const isRmzMember = async (wallet: string): Promise<MembershipStatus> => {
  switch (config.MEMBERSHIP_MODE) {
    case "mock":
      return isMockRmzMember(wallet);
    case "chronik":
      return isChronikRmzMember(wallet);
    default:
      return {
        wallet: normalizeWallet(wallet),
        tier: "none",
        active: false,
        source: "mock",
        error: "Unknown membership mode",
      };
  }
};
