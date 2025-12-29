import React from "react";
import { Lock } from "lucide-react";

export const Login = ({ onLogin }) => {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "admin853203") {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000); // Clear error after 2s
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f172a] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-sm bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden shadow-primary/5 dark:shadow-none transition-all duration-300">
        <div className="p-8">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
              Admin Access
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-center text-sm">
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
                className={`w-full bg-slate-50 dark:bg-white/5 border ${
                  error
                    ? "border-danger animate-shake"
                    : "border-slate-200 dark:border-white/10"
                } rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600 text-center tracking-widest shadow-inner dark:shadow-none`}
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
        </div>
        <div className="bg-slate-50 dark:bg-white/5 p-4 text-center border-t border-slate-100 dark:border-none">
          <p className="text-slate-400 dark:text-gray-500 text-xs">
            ® Bhagwat Library
          </p>
        </div>
      </div>
    </div>
  );
};
