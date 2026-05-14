import { Address, Ecc, fromHex, magicHash, shaRmd160, toHex, verifyMsg } from "ecash-lib";

interface VerifyMockSignatureParams {
  wallet: string;
  challengeId: string;
  signature: string;
}

interface VerifyTonalliSignatureParams {
  wallet: string;
  publicKey: string;
  signature: string;
  message: string;
}

export interface TonalliSignatureVerificationResult {
  valid: boolean;
  reason?: string;
  derivedWallet?: string;
}

const decodeBase64 = (value: string): Uint8Array => {
  const binary = Buffer.from(value, "base64").toString("binary");
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const normalizeWallet = (wallet: string): string => Address.parse(wallet.trim()).cash().toString();

const deriveWalletFromPublicKey = (publicKey: string): string => {
  const ecc = new Ecc();
  const publicKeyBytes = fromHex(publicKey.trim());
  const compressedPublicKey =
    publicKeyBytes.length === 65 ? ecc.compressPk(publicKeyBytes) : publicKeyBytes;

  return Address.p2pkh(shaRmd160(compressedPublicKey)).toString();
};

export const verifyMockSignature = ({
  wallet,
  challengeId,
  signature,
}: VerifyMockSignatureParams): boolean => {
  // This is not real cryptographic verification.
  // The production implementation must verify wallet signatures produced by supported eCash wallets.
  // This mock exists only to test the control-plane flow end to end during the prototype phase.
  return signature === `mock-signature:${wallet}:${challengeId}`;
};

export const verifyTonalliSignature = ({
  wallet,
  publicKey,
  signature,
  message,
}: VerifyTonalliSignatureParams): TonalliSignatureVerificationResult => {
  let normalizedWallet: string;
  let normalizedDerivedWallet: string;
  let normalizedPublicKeyHex: string;

  try {
    normalizedWallet = normalizeWallet(wallet);
  } catch {
    return {
      valid: false,
      reason: "wallet is not a valid eCash address",
    };
  }

  try {
    normalizedDerivedWallet = normalizeWallet(deriveWalletFromPublicKey(publicKey));
    normalizedPublicKeyHex = toHex(fromHex(publicKey.trim())).toLowerCase();
  } catch {
    return {
      valid: false,
      reason: "publicKey is not valid hex or could not be converted to an eCash address",
    };
  }

  if (normalizedDerivedWallet !== normalizedWallet) {
    return {
      valid: false,
      reason: "publicKey does not derive the requested wallet",
      derivedWallet: normalizedDerivedWallet,
    };
  }

  const signatureValid = verifyMsg(
    message,
    signature.trim(),
    normalizedWallet,
  );

  if (!signatureValid) {
    return {
      valid: false,
      reason: "signature did not verify against the canonical challenge message",
      derivedWallet: normalizedDerivedWallet,
    };
  }

  try {
    const recoveredPublicKey = new Ecc().recoverSig(
      decodeBase64(signature.trim()),
      magicHash(message),
    );
    const recoveredHex = toHex(recoveredPublicKey).toLowerCase();
    const compressedRecoveredHex = toHex(new Ecc().compressPk(recoveredPublicKey)).toLowerCase();

    if (
      normalizedPublicKeyHex !== recoveredHex &&
      normalizedPublicKeyHex !== compressedRecoveredHex
    ) {
      return {
        valid: false,
        reason: "signature recovered a different publicKey than the Tonalli payload",
        derivedWallet: normalizedDerivedWallet,
      };
    }
  } catch {
    return {
      valid: false,
      reason: "signature could not be decoded or recovered",
      derivedWallet: normalizedDerivedWallet,
    };
  }

  return {
    valid: true,
    derivedWallet: normalizedDerivedWallet,
  };
};
