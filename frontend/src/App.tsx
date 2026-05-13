import { useState } from "react";

import {
  getSessionStatus,
  requestChallenge,
  revokeSession,
  verifyChallenge,
} from "./api";
import {
  ApiError,
  ChallengeResponse,
  SessionStatusResponse,
  VerifyResponse,
} from "./types";

const DEFAULT_PLACEHOLDER =
  "ecash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a";

type LatestResponse =
  | ChallengeResponse
  | VerifyResponse
  | SessionStatusResponse
  | { revoked: boolean }
  | ApiError
  | null;

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "error" in error) {
    return String((error as ApiError).error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error";
};

function App() {
  const [wallet, setWallet] = useState("");
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null);
  const [session, setSession] = useState<VerifyResponse | null>(null);
  const [sessionStatus, setSessionStatus] =
    useState<SessionStatusResponse | null>(null);
  const [latestResponse, setLatestResponse] = useState<LatestResponse>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const mockSignature =
    wallet.trim() && challenge?.challengeId
      ? `mock-signature:${wallet.trim()}:${challenge.challengeId}`
      : "";

  const handleRequestChallenge = async () => {
    const trimmedWallet = wallet.trim();

    if (!trimmedWallet) {
      setErrorMessage("Enter a wallet address before requesting a challenge.");
      setSuccessMessage("");
      return;
    }

    setLoadingAction("challenge");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await requestChallenge(trimmedWallet);
      setChallenge(response);
      setSession(null);
      setSessionStatus(null);
      setLatestResponse(response);
      setSuccessMessage("Challenge created.");
    } catch (error) {
      const apiError = {
        error: getErrorMessage(error),
      } satisfies ApiError;
      setLatestResponse(apiError);
      setErrorMessage(apiError.error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerify = async () => {
    if (!challenge || !mockSignature) {
      return;
    }

    setLoadingAction("verify");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await verifyChallenge(
        wallet.trim(),
        challenge.challengeId,
        mockSignature,
      );
      setSession(response);
      setSessionStatus(null);
      setLatestResponse(response);
      setSuccessMessage("Session token issued.");
    } catch (error) {
      const apiError = {
        error: getErrorMessage(error),
      } satisfies ApiError;
      setLatestResponse(apiError);
      setErrorMessage(apiError.error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCheckStatus = async () => {
    if (!session?.sessionToken) {
      return;
    }

    setLoadingAction("status");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await getSessionStatus(session.sessionToken);
      setSessionStatus(response);
      setLatestResponse(response);
      setSuccessMessage(response.active ? "Session is active." : "Session is inactive.");
    } catch (error) {
      const apiError = {
        error: getErrorMessage(error),
      } satisfies ApiError;
      setLatestResponse(apiError);
      setErrorMessage(apiError.error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRevoke = async () => {
    if (!session?.sessionToken) {
      return;
    }

    setLoadingAction("revoke");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await revokeSession(session.sessionToken);
      setLatestResponse(response);
      setSessionStatus(null);
      setSuccessMessage("Session revoked. You can check status again to confirm.");
    } catch (error) {
      const apiError = {
        error: getErrorMessage(error),
      } satisfies ApiError;
      setLatestResponse(apiError);
      setErrorMessage(apiError.error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="app-shell">
      <main className="container">
        <header className="hero card">
          <p className="eyebrow">Membership Portal Prototype</p>
          <h1>eCash México Mining Gateway</h1>
          <p className="subtitle">
            Prototype 2 for the eCash México Sovereign Mining Infrastructure
            Teyolia campaign.
          </p>
        </header>

        <section className="card">
          <div className="section-heading">
            <h2>Wallet Input</h2>
            <span className="status-badge neutral">Step 1</span>
          </div>
          <label className="field-label" htmlFor="wallet">
            Wallet address
          </label>
          <div className="input-row">
            <input
              id="wallet"
              type="text"
              value={wallet}
              onChange={(event) => setWallet(event.target.value)}
              placeholder={DEFAULT_PLACEHOLDER}
            />
            <button
              type="button"
              onClick={handleRequestChallenge}
              disabled={loadingAction !== null}
            >
              {loadingAction === "challenge" ? "Requesting..." : "Request Challenge"}
            </button>
          </div>

          {challenge && (
            <div className="result-grid">
              <div>
                <span className="result-label">Challenge ID</span>
                <pre className="code-block">{challenge.challengeId}</pre>
              </div>
              <div>
                <span className="result-label">Expires At</span>
                <pre className="code-block">{challenge.expiresAt}</pre>
              </div>
              <div className="result-full">
                <span className="result-label">Challenge Message</span>
                <pre className="code-block">{challenge.message}</pre>
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <div className="section-heading">
            <h2>Mock Signature</h2>
            <span className="status-badge neutral">Step 2</span>
          </div>
          <span className="result-label">Generated signature</span>
          <pre className="code-block dimmed">
            {mockSignature || "Request a challenge to generate the mock signature."}
          </pre>
          <p className="note">
            This is a mock signature for prototype testing only. Production will
            use real wallet signature verification.
          </p>
          <button
            type="button"
            onClick={handleVerify}
            disabled={!challenge || !mockSignature || loadingAction !== null}
          >
            {loadingAction === "verify"
              ? "Verifying..."
              : "Verify & Issue Session Token"}
          </button>

          {session && (
            <div className="result-grid">
              <div>
                <span className="result-label">Token Type</span>
                <pre className="code-block">{session.tokenType}</pre>
              </div>
              <div>
                <span className="result-label">Plan</span>
                <pre className="code-block">{session.plan}</pre>
              </div>
              <div>
                <span className="result-label">Expires In</span>
                <pre className="code-block">{session.expiresIn} seconds</pre>
              </div>
              <div className="result-full">
                <span className="result-label">Session Token</span>
                <pre className="code-block">{session.sessionToken}</pre>
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <div className="section-heading">
            <h2>Session Status</h2>
            <span
              className={`status-badge ${
                sessionStatus?.active ? "success" : "neutral"
              }`}
            >
              Step 3
            </span>
          </div>
          <div className="action-row">
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={!session || loadingAction !== null}
            >
              {loadingAction === "status"
                ? "Checking..."
                : "Check Session Status"}
            </button>
          </div>

          {sessionStatus && (
            <div className="result-grid">
              <div>
                <span className="result-label">Active</span>
                <div>
                  <span
                    className={`status-badge ${
                      sessionStatus.active ? "success" : "danger"
                    }`}
                  >
                    {sessionStatus.active ? "active" : "inactive"}
                  </span>
                </div>
              </div>
              <div>
                <span className="result-label">Plan</span>
                <pre className="code-block">{sessionStatus.plan ?? "n/a"}</pre>
              </div>
              <div className="result-full">
                <span className="result-label">Wallet</span>
                <pre className="code-block">{sessionStatus.wallet ?? "n/a"}</pre>
              </div>
              <div className="result-full">
                <span className="result-label">Expires At</span>
                <pre className="code-block">
                  {sessionStatus.expiresAt ?? "n/a"}
                </pre>
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <div className="section-heading">
            <h2>Revoke Session</h2>
            <span className="status-badge neutral">Step 4</span>
          </div>
          <button
            type="button"
            className="button-secondary"
            onClick={handleRevoke}
            disabled={!session || loadingAction !== null}
          >
            {loadingAction === "revoke" ? "Revoking..." : "Revoke Session"}
          </button>
        </section>

        <section className="card">
          <div className="section-heading">
            <h2>Debug Panel</h2>
            <span className="status-badge neutral">JSON</span>
          </div>
          <pre className="code-block debug-panel">
            {JSON.stringify(
              latestResponse ?? { message: "No API response yet." },
              null,
              2,
            )}
          </pre>
        </section>

        {(errorMessage || successMessage) && (
          <section className="feedback-stack">
            {errorMessage && <p className="feedback error">{errorMessage}</p>}
            {successMessage && (
              <p className="feedback success">{successMessage}</p>
            )}
          </section>
        )}

        <footer className="footer card">
          <p>Open infrastructure. No custody. Built for the eCash ecosystem.</p>
          <div className="footer-links">
            <a
              href="https://github.com/xolosArmy/xec-mining-gateway"
              target="_blank"
              rel="noreferrer"
            >
              GitHub repo
            </a>
            <a
              href="https://www.teyolia.cash/campaigns/campaign-1778614261973"
              target="_blank"
              rel="noreferrer"
            >
              Teyolia campaign
            </a>
            <a href="https://ecash.mx" target="_blank" rel="noreferrer">
              eCash México
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
