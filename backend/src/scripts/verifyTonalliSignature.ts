import { verifyTonalliSignature } from "../services/signature";

const [, , wallet, publicKey, signature, ...messageParts] = process.argv;

const message = messageParts.join(" ");

if (!wallet || !publicKey || !signature || !message) {
  console.error(
    "Usage: node dist/scripts/verifyTonalliSignature.js <wallet> <publicKey> <signature> <message>",
  );
  process.exit(1);
}

const result = verifyTonalliSignature({
  wallet,
  publicKey,
  signature,
  message,
});

console.log(JSON.stringify(result, null, 2));
