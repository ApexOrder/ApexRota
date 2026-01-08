"use client";

import { useEffect, useState } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

type Me = {
  ok: boolean;
  name?: string;
  preferred_username?: string;
  oid?: string;
  tid?: string;
  error?: string;
};

export default function Home() {
  const [inTeams, setInTeams] = useState(false);
  const [status, setStatus] = useState("Not signed in");
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    microsoftTeams.app
      .initialize()
      .then(() => setInTeams(true))
      .catch(() => setInTeams(false));
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
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Apex Rota (Teams Tab)</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Running inside Teams: <b>{inTeams ? "Yes" : "No"}</b>
      </p>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={signIn}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #333",
            cursor: "pointer",
          }}
        >
          Sign in with Teams SSO
        </button>
        <p style={{ marginTop: 12 }}>{status}</p>
      </div>

      {me && (
        <div style={{ marginTop: 20, padding: 16, borderRadius: 12, border: "1px solid #222" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Token claims</h2>
          <pre style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(me, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
