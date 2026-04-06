import React, { useState } from "react";
import Button from "../shared/Button";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "admin123";

async function hashPassword(pw: string): Promise<string> {
  const enc = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashTarget(): Promise<string> {
  return hashPassword(ADMIN_PASSWORD);
}

interface Props {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const [inputHash, targetHash] = await Promise.all([
      hashPassword(password),
      hashTarget(),
    ]);
    if (inputHash === targetHash) {
      sessionStorage.setItem("adminAuth", "true");
      onSuccess();
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Admin</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your password to manage questions
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading || !password}>
            {loading ? "Checking…" : "Login"}
          </Button>
        </form>
        <p className="text-xs text-gray-400 text-center">
          Default password: <code className="bg-gray-100 px-1 rounded">admin123</code>
        </p>
      </div>
    </div>
  );
}
