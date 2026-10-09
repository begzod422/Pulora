import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, Zap, Gem, Sprout } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Tariflar — PULORA Premium" },
      { name: "description", content: "PULORA Premium: 1 oy 40 000 so'm, 3 oy 100 000 so'm, Premium 450 000 so'm." },
      { property: "og:title", content: "Tariflar — PULORA Premium" },
      { property: "og:description", content: "Chuqur tahlil va shaxsiy moliyaviy rejalar." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const { t, lang } = useI18n();
  const uz = lang === "uz";
  const plans = [
    { icon: Sprout, name: t("free"), price: "0", per: "", feats: uz ? ["Barcha kalkulyatorlar", "1 ta maqsad", "Asosiy maslahatlar"] : ["Все калькуляторы", "1 цель", "Базовые советы"], free: true },
    { icon: Zap, name: uz ? "1 oylik" : "1 месяц", price: "40 000", per: uz ? "/ 1 oy" : "/ 1 мес.", feats: uz ? ["Cheksiz maqsadlar", "Oylik tahlil", "To'lov eslatmalari"] : ["Безлимит целей", "Ежемесячный анализ", "Напоминания о платежах"] },
    { icon: Crown, name: uz ? "3 oylik" : "3 месяца", price: "100 000", per: uz ? "/ 3 oy" : "/ 3 мес.", popular: true, feats: uz ? ["1 oylikdagi hammasi", "Shaxsiy 12 oylik reja", "Oila a'zolari bilan ulashish", "17% tejash"] : ["Всё из 1 месяца", "Личный план на 12 мес.", "Общий доступ для семьи", "Экономия 17%"] },
    { icon: Gem, name: "Premium", price: "450 000", per: uz ? "/ cheksiz" : "/ навсегда", feats: uz ? ["Barcha imkoniyatlar", "Mutaxassis bilan 1:1 konsultatsiya", "Ustuvor yordam", "Yangi funksiyalar birinchi"] : ["Все возможности", "Консультация 1:1 с экспертом", "Приоритетная поддержка", "Новые функции первыми"] },
  ];
  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <div className="text-center">
        <h1 className="text-4xl font-bold md:text-6xl">{t("pricing_title")}</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("pricing_sub")}</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div key={p.name} className={`relative flex flex-col rounded-3xl border p-7 ${p.popular ? "border-primary bg-card shadow-gold" : "border-border bg-surface"}`}>
            {p.popular && <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-primary-foreground">{t("popular")}</span>}
            <p.icon className="size-7 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{p.name}</h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold tabular-nums">{p.price}</span>
              <span className="text-sm text-muted-foreground">{t("sum")} {p.per}</span>
            </div>
            <ul className="mt-6 grid flex-1 gap-2.5 text-sm">
              {p.feats.map((f) => <li key={f} className="flex gap-2"><Check className="size-4 shrink-0 text-mint" /> {f}</li>)}
            </ul>
            <Button variant={p.popular ? "default" : "outline"} disabled={p.free} className="mt-7 h-11 rounded-xl" onClick={() => toast(t("soon"))}>
              {t("choose")}
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
