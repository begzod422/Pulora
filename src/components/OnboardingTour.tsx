import { useEffect, useState } from "react";
import { Sparkles, Target, Calculator, Crown, Languages, X } from "lucide-react";
import { useI18n, type T2 } from "@/lib/i18n";
import { DEVICE_KEY } from "@/lib/store";
import { Button } from "@/components/ui/button";

const STEPS: { icon: typeof Sparkles; title: T2; text: T2 }[] = [
  { icon: Sparkles, title: { uz: "PULORA'ga xush kelibsiz!", ru: "Добро пожаловать в PULORA!" }, text: { uz: "Qisqa yo'riqnoma: sayt qanday ishlashini 30 soniyada ko'rsatamiz.", ru: "Короткая инструкция: покажем, как всё работает, за 30 секунд." } },
  { icon: Target, title: { uz: "1. Maqsad tanlang", ru: "1. Выберите цель" }, text: { uz: "Ro'yxatdan o'ting, SMS kodni kiriting va maqsadingizni tanlang. Sahifangiz shunga moslashadi.", ru: "Зарегистрируйтесь, введите код из SMS и выберите цель. Страница подстроится под неё." } },
  { icon: Calculator, title: { uz: "2. Hisoblang", ru: "2. Считайте" }, text: { uz: "Kalkulyatorlar: jamg'arma, qarz va budjetni bir zumda hisoblang.", ru: "Калькуляторы: мгновенно считайте накопления, долги и бюджет." } },
  { icon: Crown, title: { uz: "3. Premium", ru: "3. Premium" }, text: { uz: "Chuqur tahlil va shaxsiy rejalar — Tariflar bo'limida.", ru: "Глубокий анализ и личные планы — в разделе Тарифы." } },
  { icon: Languages, title: { uz: "Til", ru: "Язык" }, text: { uz: "Yuqoridagi UZ / RU tugmasi orqali tilni almashtiring.", ru: "Меняйте язык кнопкой UZ / RU вверху." } },
];

export function OnboardingTour() {
  const { t, tx } = useI18n();
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(DEVICE_KEY)) setOpen(true);
  }, []);

  const close = () => {
    localStorage.setItem(DEVICE_KEY, String(Date.now()));
    setOpen(false);
  };

  if (!open) return null;
  const s = STEPS[i];
  const Icon = s.icon;
  const last = i === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-gold animate-in zoom-in-95">
        <button onClick={close} aria-label={t("tour_skip")} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="size-5" />
        </button>
        <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-gold text-primary-foreground">
          <Icon className="size-7" />
        </div>
        <h2 className="text-2xl font-bold">{tx(s.title)}</h2>
        <p className="mt-3 text-muted-foreground">{tx(s.text)}</p>
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, k) => (
              <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-1.5 bg-muted"}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {!last && <Button variant="ghost" onClick={close}>{t("tour_skip")}</Button>}
            <Button onClick={() => (last ? close() : setI(i + 1))}>{last ? t("tour_done") : t("tour_next")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
