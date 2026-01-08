"use client";

import { useEffect, useState } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

type Me = {
  ok: boolean;
  name?: string;
  preferred_username?: string;
  oid?: string;
  tid?: string;
  scp?: string;
  error?: string;
};

export default function Dashboard() {
  const [me, setMe] = useState<Me | null>(null);
  const [status, setStatus] = useState("Not signed in");

  useEffect(() => {
    microsoftTeams.app.initialize().catch(() => {});
  }, []);

  const signIn = async () => {
    try {
      setStatus("Getting Teams SSO token...");
      const token = await microsoftTeams.authentication.getAuthToken();

      setStatus("Validating token...");
      const res = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data: Me = await res.json();
      setMe(data);

      if (!res.ok || !data.ok) {
        setStatus(data.error || "Auth failed");
        return;
      }

      setStatus("Signed in ✅");
    } catch (e: any) {
      setStatus(e?.message || "Sign-in failed");
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Dashboard</h1>

      <button
        onClick={signIn}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #334155",
          background: "#0f172a",
          color: "#e5e7eb",
          cursor: "pointer",
        }}
      >
        Sign in with Teams SSO
      </button>

      <p style={{ marginTop: 12, opacity: 0.9 }}>{status}</p>

      {me?.ok && (
        <div style={{ marginTop: 16, padding: 14, border: "1px solid #1f2937", borderRadius: 12, background: "#070d19" }}>
          <div><b>User:</b> {me.name}</div>
          <div><b>Email:</b> {me.preferred_username}</div>
          <div><b>Scope:</b> {me.scp}</div>
        </div>
      )}

      <div style={{ marginTop: 18, opacity: 0.9 }}>
        Next: add staff list + rota builder.
      </div>
    </div>
  );
}
