import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function hmac(secret: string, msg: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const phoneSchema = z.string().regex(/^998\d{9}$/);

export const sendOtp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ phone: phoneSchema, lang: z.enum(["uz", "ru"]) }).parse(input),
  )
  .handler(async ({ data }) => {
    const email = process.env["ESKIZ_EMAIL"];
    const password = process.env["ESKIZ_PASSWORD"];
    const secret = process.env["OTP_SECRET"] || password || "pulora-dev-secret";

    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    const code = String(100000 + (bytes[0] % 900000));
    const exp = Date.now() + 5 * 60 * 1000;
    const token = await hmac(secret, `${data.phone}|${code}|${exp}`);

    if (!email || !password) {
      // SMS service not connected yet: test mode
      return { ok: true, token, exp, demoCode: code };
    }

    try {
      const loginBody = new FormData();
      loginBody.append("email", email);
      loginBody.append("password", password);
      const loginRes = await fetch("https://notify.eskiz.uz/api/auth/login", {
        method: "POST",
        body: loginBody,
      });
      const loginJson = (await loginRes.json()) as { data?: { token?: string } };
      const bearer = loginJson.data?.token;
      if (!bearer) throw new Error("Eskiz login failed");

      const smsBody = new FormData();
      smsBody.append("mobile_phone", data.phone);
      smsBody.append(
        "message",
        data.lang === "ru"
          ? `Kod podtverzhdeniya PULORA: ${code}`
          : `PULORA tasdiqlash kodi: ${code}`,
      );
      smsBody.append("from", process.env["ESKIZ_FROM"] || "4546");
      const smsRes = await fetch("https://notify.eskiz.uz/api/message/sms/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${bearer}` },
        body: smsBody,
      });
      if (!smsRes.ok) throw new Error(`Eskiz send failed ${smsRes.status}`);
      return { ok: true, token, exp };
    } catch (e) {
      console.error("SMS error", e);
      return { ok: false, token: "", exp: 0, error: "sms_failed" as const };
    }
  });

export const verifyOtp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        phone: phoneSchema,
        code: z.string().regex(/^\d{6}$/),
        token: z.string().min(10).max(200),
        exp: z.number(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    if (Date.now() > data.exp) return { ok: false, reason: "expired" as const };
    const secret =
      process.env["OTP_SECRET"] || process.env["ESKIZ_PASSWORD"] || "pulora-dev-secret";
    const expected = await hmac(secret, `${data.phone}|${data.code}|${data.exp}`);
    return expected === data.token
      ? { ok: true as const }
      : { ok: false, reason: "wrong" as const };
  });
