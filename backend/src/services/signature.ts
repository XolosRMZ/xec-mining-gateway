interface VerifyMockSignatureParams {
  wallet: string;
  challengeId: string;
  signature: string;
}

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
