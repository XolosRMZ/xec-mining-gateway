import { MembershipStatus } from "../types";

const APPROVED_WALLETS = new Set([
  "ecash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
]);

export const isRmzMember = async (wallet: string): Promise<MembershipStatus> => {
  const normalizedWallet = wallet.trim().toLowerCase();

  // Prototype 5 uses a hardcoded registry. A later phase will replace this
  // with Chronik-backed RMZ token verification and real membership rules.
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
