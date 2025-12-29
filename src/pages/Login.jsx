import React from "react";
import { Lock, Fingerprint, X } from "lucide-react";

export const Login = ({ onLogin }) => {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);

  const [showBiometricPrompt, setShowBiometricPrompt] = React.useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = React.useState(false);

  React.useEffect(() => {
    if (
      window.PublicKeyCredential &&
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable
    ) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
        (available) => {
          setIsBiometricAvailable(available);
          checkBiometricRegistration();
        }
      );
    }
  }, []);

  const checkBiometricRegistration = () => {
    const credentialId = localStorage.getItem("biometricCredentialId");
    return !!credentialId;
  };

  const handleBiometricLogin = async () => {
    try {
      const credentialId = localStorage.getItem("biometricCredentialId");
      if (!credentialId) return;

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [
            {
              id: Uint8Array.from(atob(credentialId), (c) => c.charCodeAt(0)),
              type: "public-key",
            },
          ],
          userVerification: "required",
        },
      });

      if (credential) {
        onLogin();
      }
    } catch (err) {
      console.error("Biometric login failed:", err);
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const registerBiometric = async () => {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "Bhagwat Library Admin",
          },
          user: {
            id: userId,
            name: "admin",
            displayName: "Admin User",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
            { type: "public-key", alg: -257 }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
        },
      });

      if (credential) {
        // Store the raw ID in localStorage (base64 encoded for string storage)
        const rawId = btoa(
          String.fromCharCode(...new Uint8Array(credential.rawId))
        );
        localStorage.setItem("biometricCredentialId", rawId);
        onLogin();
      }
    } catch (err) {
      console.error("Biometric registration failed:", err);
      // Fallback to normal login if registration fails/cancelled
      onLogin();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "admin853203") {
      // Check if biometric is available but not registered
      if (isBiometricAvailable && !checkBiometricRegistration()) {
        setShowBiometricPrompt(true);
      } else {
        onLogin();
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000); // Clear error after 2s
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#1e293b] rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
              Admin Access
            </h1>
            <p className="text-gray-400 text-center text-sm">
              Please enter the password to access the Bhagwat Library Admin
              Portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-white/5 border ${
                  error ? "border-danger animate-shake" : "border-white/10"
                } rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600 text-center tracking-widest`}
                placeholder="Enter Password"
                autoFocus
              />
              {error && (
                <p className="text-danger text-xs text-center mt-2 animate-in fade-in slide-in-from-top-1">
                  Incorrect password. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              Access Portal
            </button>
          </form>

          {isBiometricAvailable && checkBiometricRegistration() && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <button
                onClick={handleBiometricLogin}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Fingerprint size={20} className="text-primary" />
                Login with Fingerprint
              </button>
            </div>
          )}
        </div>

        {/* Biometric Prompt Modal */}
        {showBiometricPrompt && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#1e293b] w-full max-w-xs rounded-2xl border border-white/10 p-6 shadow-2xl transform transition-all scale-100">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
                  <Fingerprint size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Enable Fingerprint?
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Login faster next time using your device's fingerprint or face
                  ID.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => onLogin()}
                    className="flex-1 px-4 py-2 rounded-lg bg-transparent text-gray-400 font-medium hover:text-white transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={registerBiometric}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20"
                  >
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white/5 p-4 text-center">
          <p className="text-gray-500 text-xs">® Bhagwat Library</p>
        </div>
      </div>
    </div>
  );
};
