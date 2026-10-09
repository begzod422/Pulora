import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquareText, Loader2, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPhoneLocal } from "@/lib/format";
import { clearPending, getPending, saveUser, setPending, type Pending } from "@/lib/store";
import { sendOtp, verifyOtp } from "@/lib/otp.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Kodni tasdiqlash — PULORA" },
      { name: "description", content: "Telefoningizga yuborilgan 6 xonali kodni kiriting." },
      { property: "og:title", content: "Kodni tasdiqlash — PULORA" },
      { property: "og:description", content: "SMS orqali raqamingizni tasdiqlang." },
    ],
  }),
  component: Verify,
});

function Verify() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const verify = useServerFn(verifyOtp);
  const resend = useServerFn(sendOtp);
  const [p, setP] = useState<Pending | null>(null);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const pend = getPending();
    if (!pend) navigate({ to: "/register", replace: true });
    else setP(pend);
  }, [navigate]);

  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "");
    if (d.length > 1) {
      const arr = d.slice(0, 6).split("");
      setCode([...arr, ...Array(6 - arr.length).fill("")]);
      refs.current[Math.min(arr.length, 5)]?.focus();
      return;
    }
    const next = [...code];
    next[i] = d;
    setCode(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const submit = async () => {
    if (!p) return;
    const c = code.join("");
    if (c.length !== 6) return;
    setBusy(true);
    setErr("");
    try {
      const r = await verify({ data: { phone: p.user.phone, code: c, token: p.token, exp: p.exp } });
      if (!r.ok) {
        setErr(r.reason === "expired" ? t("ver_expired") : t("ver_wrong"));
        return;
      }
      saveUser({ ...p.user, verified: true });
      clearPending();
      navigate({ to: "/goal" });
    } finally {
      setBusy(false);
    }
  };

  const doResend = async () => {
    if (!p) return;
    const r = await resend({ data: { phone: p.user.phone, lang } });
    if (!r.ok) return setErr(t("err_sms"));
    const np = { ...p, token: r.token, exp: r.exp, demoCode: "demoCode" in r ? r.demoCode : undefined };
    setPending(np);
    setP(np);
    setWait(60);
    setErr("");
  };

  if (!p) return null;

  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-glow px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold text-primary-foreground">
          <MessageSquareText className="size-7" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">{t("ver_title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("ver_sub")}</p>
        <p className="mt-1 font-semibold">+998 {formatPhoneLocal(p.user.phone.slice(3))}</p>

        {p.demoCode && (
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-accent p-3 text-left text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{t("ver_demo")} <b className="tracking-widest">{p.demoCode}</b></span>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-2">
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
                if (e.key === "Enter") submit();
              }}
              className="size-12 rounded-xl border border-input bg-background/60 text-center text-xl font-bold outline-none focus:border-primary"
            />
          ))}
        </div>
        {err && <p className="mt-4 text-sm text-destructive">{err}</p>}
        <Button onClick={submit} disabled={busy || code.join("").length !== 6} className="mt-6 h-12 w-full rounded-xl text-base">
          {busy ? <Loader2 className="size-4 animate-spin" /> : t("ver_btn")}
        </Button>
        <button onClick={doResend} disabled={wait > 0} className="mt-4 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50">
          {t("ver_resend")} {wait > 0 && `(${wait})`}
        </button>
      </div>
    </main>
  );
}
