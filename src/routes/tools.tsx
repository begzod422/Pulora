import { createFileRoute } from "@tanstack/react-router";
import { PiggyBank, Unlink, PieChart, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SavingsCalc, DebtCalc, BudgetCalc, IncomeCalc } from "@/components/Calculators";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Moliyaviy kalkulyatorlar — PULORA" },
      { name: "description", content: "Jamg'arma, qarz, 50/30/20 budjet va soatlik daromad kalkulyatorlari." },
      { property: "og:title", content: "Moliyaviy kalkulyatorlar — PULORA" },
      { property: "og:description", content: "Pulingizni bir zumda hisoblang." },
    ],
  }),
  component: Tools,
});

function Tools() {
  const { t, lang } = useI18n();
  const items = [
    { i: PiggyBank, t: lang === "uz" ? "Jamg'arma" : "Накопления", C: SavingsCalc },
    { i: Unlink, t: lang === "uz" ? "Qarz" : "Долг", C: DebtCalc },
    { i: PieChart, t: lang === "uz" ? "Budjet 50/30/20" : "Бюджет 50/30/20", C: BudgetCalc },
    { i: Clock, t: lang === "uz" ? "Vaqtingiz narxi" : "Цена вашего времени", C: IncomeCalc },
  ];
  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-4xl font-bold md:text-6xl">{t("nav_tools")}</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map(({ i: Icon, t: title, C }) => (
          <section key={title} className="rounded-3xl border border-border bg-card p-7">
            <h2 className="mb-5 flex items-center gap-3 text-xl font-semibold"><Icon className="size-6 text-primary" /> {title}</h2>
            <C />
          </section>
        ))}
      </div>
    </main>
  );
}
