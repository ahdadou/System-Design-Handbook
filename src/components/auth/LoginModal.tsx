"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, User, Eye, EyeOff, AlertCircle, BookOpen } from "lucide-react";
import { useLearningStore } from "@/lib/store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useLearningStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const success = login(username, password);
    setLoading(false);
    if (success) {
      onSuccess();
    } else {
      setError("Invalid username or password");
    }
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="w-full max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-2xl p-8 relative shadow-2xl"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--ui-border)" }}
              >
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
                  style={{ color: "var(--ui-text-3)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--ui-text-3)";
                  }}
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="text-center mb-7">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6d54e8] to-[#0d9488] flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold font-heading" style={{ color: "var(--ui-text)" }}>
                    Welcome back
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "var(--ui-text-2)" }}>
                    Sign in to continue your learning journey
                  </p>
                </div>

                {/* Demo credentials hint */}
                <div
                  className="mb-5 px-4 py-3 rounded-xl text-xs flex items-start gap-2"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--ui-border)" }}
                >
                  <span className="mt-0.5">💡</span>
                  <div>
                    <span style={{ color: "var(--ui-text-3)" }}>Demo  </span>
                    <span style={{ color: "var(--ui-text-2)" }}>
                      username: <span style={{ color: "var(--ui-accent)" }}>demo</span>
                      {"  ·  "}
                      password: <span style={{ color: "var(--ui-accent)" }}>academy123</span>
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--ui-text-2)" }}>
                      Username
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: "var(--ui-text-3)" }}
                      />
                      <input
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setError(""); }}
                        placeholder="Enter username"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                        style={{
                          background: "var(--bg-elevated)",
                          border: `1px solid ${error ? "var(--ui-danger)" : "var(--ui-border)"}`,
                          color: "var(--ui-text)",
                        }}
                        onFocus={(e) => {
                          if (!error) e.currentTarget.style.borderColor = "var(--ui-accent)";
                        }}
                        onBlur={(e) => {
                          if (!error) e.currentTarget.style.borderColor = "var(--ui-border)";
                        }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--ui-text-2)" }}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: "var(--ui-text-3)" }}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        placeholder="Enter password"
                        className="w-full pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none transition-all"
                        style={{
                          background: "var(--bg-elevated)",
                          border: `1px solid ${error ? "var(--ui-danger)" : "var(--ui-border)"}`,
                          color: "var(--ui-text)",
                        }}
                        onFocus={(e) => {
                          if (!error) e.currentTarget.style.borderColor = "var(--ui-accent)";
                        }}
                        onBlur={(e) => {
                          if (!error) e.currentTarget.style.borderColor = "var(--ui-border)";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: "var(--ui-text-3)" }}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        className="flex items-center gap-2 text-xs"
                        style={{ color: "var(--ui-danger)" }}
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !username || !password}
                    className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "var(--ui-accent)" }}
                    onMouseEnter={(e) => {
                      if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                        />
                        Signing in…
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
