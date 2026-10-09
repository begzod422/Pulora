import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { User, Lock, Phone, Loader2, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { digitsOnly, formatPhoneLocal } from "@/lib/format";
import { setPending, sha256 } from "@/lib/store";
import { sendOtp } from "@/lib/otp.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Ro'yxatdan o'tish — PULORA" },
      { name: "description", content: "PULORA'da bepul hisob yarating: ism, parol va telefon raqam." },
      { property: "og:title", content: "Ro'yxatdan o'tish — PULORA" },
      { property: "og:description", content: "Bir daqiqada moliyaviy yordamchingizni ishga tushiring." },
    ],
  }),
  component: Register,
});

function Field({ icon: Icon, children }: { icon: typeof User; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-input bg-background/60 px-4 focus-within:border-primary">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      {children}
    </div>
  );
}

function Register() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const send = useServerFn(sendOtp);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!z.string().trim().min(2).max(50).safeParse(name).success) return setErr(t("err_name"));
    if (pass.length < 6 || pass.length > 100) return setErr(t("err_pass"));
    const local = digitsOnly(phone);
    if (local.length !== 9) return setErr(t("err_phone"));
    const full = "998" + local;
    setBusy(true);
    try {
      const res = await send({ data: { phone: full, lang } });
      if (!res.ok) return setErr(t("err_sms"));
      setPending({
        user: { name: name.trim(), phone: full, passwordHash: await sha256(pass), verified: false },
        token: res.token,
        exp: res.exp,
        demoCode: "demoCode" in res ? res.demoCode : undefined,
      });
      navigate({ to: "/verify" });
    } catch {
      setErr(t("err_sms"));
    } finally {
      setBusy(false);
    }
  };

  const input = "h-12 w-full bg-transparent outline-none placeholder:text-muted-foreground/60";

  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-glow px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-border bg-card p-8">
        <h1 className="text-3xl font-bold">{t("reg_title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("reg_sub")}</p>
        <div className="mt-8 grid gap-3">
          <Field icon={User}>
            <input className={input} placeholder={t("name")} value={name} onChange={(e) => setName(e.target.value)} maxLength={50} autoComplete="name" />
          </Field>
          <Field icon={Lock}>
            <input className={input} type={show ? "text" : "password"} placeholder={t("password")} value={pass} onChange={(e) => setPass(e.target.value)} maxLength={100} autoComplete="new-password" />
            <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground" aria-label="toggle">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </Field>
          <Field icon={Phone}>
            <span className="font-semibold">+998</span>
            <input className={input} type="tel" inputMode="numeric" placeholder="90 123 45 67" value={phone} onChange={(e) => setPhone(formatPhoneLocal(e.target.value))} autoComplete="tel-national" />
          </Field>
        </div>
        {err && <p className="mt-4 text-sm text-destructive">{err}</p>}
        <Button type="submit" disabled={busy} className="mt-6 h-12 w-full rounded-xl text-base">
          {busy ? <><Loader2 className="size-4 animate-spin" /> {t("sending")}</> : t("send_code")}
        </Button>
      </form>
    </main>
  );
}
