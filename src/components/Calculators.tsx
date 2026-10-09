import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import { NumberInput } from "./NumberInput";

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-accent p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold text-gold tabular-nums">{value}</div>
    </div>
  );
}

export function SavingsCalc() {
  const { t, lang } = useI18n();
  const [goal, setGoal] = useState(12_000_000);
  const [monthly, setMonthly] = useState(1_000_000);
  const [have, setHave] = useState(0);
  const months = monthly > 0 ? Math.max(0, Math.ceil((goal - have) / monthly)) : 0;
  return (
    <div className="grid gap-4">
      <NumberInput label={lang === "uz" ? "Maqsad summasi" : "Целевая сумма"} value={goal} onChange={setGoal} suffix={t("sum")} />
      <NumberInput label={lang === "uz" ? "Hozir bor" : "Уже есть"} value={have} onChange={setHave} suffix={t("sum")} />
      <NumberInput label={lang === "uz" ? "Oyiga tejayman" : "Откладываю в месяц"} value={monthly} onChange={setMonthly} suffix={t("sum")} />
      <Result label={lang === "uz" ? "Maqsadga yetish muddati" : "Срок до цели"} value={`${months} ${t("months")}`} />
    </div>
  );
}

export function DebtCalc() {
  const { t, lang } = useI18n();
  const [debt, setDebt] = useState(10_000_000);
  const [rate, setRate] = useState(28);
  const [pay, setPay] = useState(1_000_000);
  const r = rate / 100 / 12;
  let months = 0;
  let total = 0;
  let bal = debt;
  while (bal > 0 && months < 600) {
    bal = bal * (1 + r) - pay;
    total += pay;
    months++;
    if (pay <= debt * r) { months = Infinity; break; }
  }
  if (bal < 0) total += bal;
  const ok = Number.isFinite(months);
  return (
    <div className="grid gap-4">
      <NumberInput label={lang === "uz" ? "Qarz summasi" : "Сумма долга"} value={debt} onChange={setDebt} suffix={t("sum")} />
      <NumberInput label={lang === "uz" ? "Yillik foiz" : "Годовая ставка"} value={rate} onChange={(v) => setRate(Math.min(v, 200))} suffix="%" />
      <NumberInput label={lang === "uz" ? "Oylik to'lov" : "Ежемесячный платёж"} value={pay} onChange={setPay} suffix={t("sum")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label={lang === "uz" ? "Yopish muddati" : "Срок погашения"} value={ok ? `${months} ${t("months")}` : "∞"} />
        <Result label={lang === "uz" ? "Ortiqcha to'lov" : "Переплата"} value={ok ? `${formatNumber(Math.max(0, total - debt))} ${t("sum")}` : "—"} />
      </div>
    </div>
  );
}

export function BudgetCalc() {
  const { t, lang } = useI18n();
  const [income, setIncome] = useState(8_000_000);
  const rows = [
    { k: 0.5, l: lang === "uz" ? "Ehtiyojlar (50%)" : "Нужды (50%)", c: "bg-chart-1" },
    { k: 0.3, l: lang === "uz" ? "Xohishlar (30%)" : "Желания (30%)", c: "bg-chart-2" },
    { k: 0.2, l: lang === "uz" ? "Jamg'arma (20%)" : "Накопления (20%)", c: "bg-chart-3" },
  ];
  return (
    <div className="grid gap-4">
      <NumberInput label={lang === "uz" ? "Oylik daromad" : "Месячный доход"} value={income} onChange={setIncome} suffix={t("sum")} />
      <div className="flex h-3 overflow-hidden rounded-full">
        {rows.map((r) => <div key={r.l} className={r.c} style={{ width: `${r.k * 100}%` }} />)}
      </div>
      {rows.map((r) => (
        <div key={r.l} className="flex items-center justify-between rounded-xl bg-accent px-4 py-3">
          <span className="flex items-center gap-2 text-sm"><span className={`size-2.5 rounded-full ${r.c}`} />{r.l}</span>
          <span className="font-semibold tabular-nums">{formatNumber(income * r.k)} {t("sum")}</span>
        </div>
      ))}
    </div>
  );
}

export function IncomeCalc() {
  const { t, lang } = useI18n();
  const [income, setIncome] = useState(6_000_000);
  const [hours, setHours] = useState(176);
  const [extra, setExtra] = useState(2_000_000);
  const hourly = hours > 0 ? income / hours : 0;
  return (
    <div className="grid gap-4">
      <NumberInput label={lang === "uz" ? "Oylik daromad" : "Месячный доход"} value={income} onChange={setIncome} suffix={t("sum")} />
      <NumberInput label={lang === "uz" ? "Oylik ish soati" : "Рабочих часов в месяц"} value={hours} onChange={setHours} />
      <NumberInput label={lang === "uz" ? "Qo'shimcha daromad maqsadi" : "Цель доп. дохода"} value={extra} onChange={setExtra} suffix={t("sum")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Result label={lang === "uz" ? "1 soatingiz narxi" : "Цена вашего часа"} value={`${formatNumber(hourly)} ${t("sum")}`} />
        <Result label={lang === "uz" ? "Yillik qo'shimcha" : "Доп. за год"} value={`${formatNumber(extra * 12)} ${t("sum")}`} />
      </div>
    </div>
  );
}

export const TOOL_MAP = { savings: SavingsCalc, debt: DebtCalc, budget: BudgetCalc, income: IncomeCalc };
