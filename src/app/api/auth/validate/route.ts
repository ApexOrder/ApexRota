import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

const tenantId = process.env.AAD_TENANT_ID!;
const clientId = process.env.AAD_CLIENT_ID!;

const issuer = `https://login.microsoftonline.com/${tenantId}/v2.0`;
const jwksUrl = new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`);
const JWKS = createRemoteJWKSet(jwksUrl);

export async function POST(req: Request) {
  try {
    const { token } = (await req.json()) as { token?: string };
    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
    }

    const { payload } = await jwtVerify(token, JWKS, {
      issuer,
      audience: clientId,
    });

    return NextResponse.json({
      ok: true,
      name: payload.name,
      preferred_username: payload.preferred_username,
      oid: payload.oid,
      tid: payload.tid,
      scp: payload.scp,
      roles: payload.roles,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Token validation failed" },
      { status: 401 }
    );
  }
}
