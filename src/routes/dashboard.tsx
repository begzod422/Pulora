import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Lightbulb, Lock, Crown, RefreshCw, LineChart, FileText, Bell } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { goalById } from "@/lib/goals";
import { getChecklist, getUser, setChecklist, type PuloraUser } from "@/lib/store";
import { TOOL_MAP } from "@/components/Calculators";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Mening sahifam — PULORA" },
      { name: "description", content: "Shaxsiy moliyaviy maqsadingiz bo'yicha qadamlar, hisob-kitob va maslahatlar." },
      { property: "og:title", content: "Mening sahifam — PULORA" },
      { property: "og:description", content: "Maqsadingizga qadam-baqadam yaqinlashing." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t, tx, lang } = useI18n();
  const navigate = useNavigate();
  const [user, setUser] = useState<PuloraUser | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const u = getUser();
    if (!u?.verified) return void navigate({ to: "/register", replace: true });
    if (!u.goal) return void navigate({ to: "/goal", replace: true });
    setUser(u);
    setChecks(getChecklist(u.goal));
  }, [navigate]);

  const goal = goalById(user?.goal);
  if (!user || !goal) return null;
  const Tool = TOOL_MAP[goal.tool];
  const done = goal.steps.filter((_, i) => checks[i]).length;
  const pct = Math.round((done / goal.steps.length) * 100);

  const toggle = (i: number) => {
    const next = { ...checks, [i]: !checks[i] };
    setChecks(next);
    setChecklist(goal.id, next);
  };

  const locked = [
    { i: LineChart, t: lang === "uz" ? "Oylik tahlil hisobotlari" : "Ежемесячные отчёты-анализы" },
    { i: FileText, t: lang === "uz" ? "Shaxsiy 12 oylik reja" : "Личный план на 12 месяцев" },
    { i: Bell, t: lang === "uz" ? "To'lov eslatmalari" : "Напоминания о платежах" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card bg-glow p-8 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground">{t("hello")}, {user.name}</p>
            <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold md:text-5xl">
              <goal.icon className="size-9 text-primary md:size-12" /> {tx(goal.title)}
            </h1>
            <p className="mt-3 max-w-lg text-muted-foreground">{tx(goal.tagline)}</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/goal"><RefreshCw className="size-4" /> {t("change_goal")}</Link>
          </Button>
        </div>
        <div className="mt-8 max-w-md">
          <div className="flex justify-between text-sm"><span>{t("progress")}</span><span className="font-semibold">{pct}%</span></div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="rounded-3xl border border-border bg-card p-7 lg:col-span-3">
          <h2 className="text-xl font-semibold">{t("your_steps")}</h2>
          <ul className="mt-5 grid gap-2">
            {goal.steps.map((s, i) => (
              <li key={i}>
                <button onClick={() => toggle(i)} className="flex w-full items-center gap-4 rounded-xl bg-surface p-4 text-left transition-colors hover:bg-accent">
                  <span className={`grid size-7 shrink-0 place-items-center rounded-lg border ${checks[i] ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                    {checks[i] && <Check className="size-4" />}
                  </span>
                  <span className={checks[i] ? "text-muted-foreground line-through" : ""}>{tx(s)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-border bg-card p-7 lg:col-span-2">
          <h2 className="mb-5 text-xl font-semibold">{t("quick_tool")}</h2>
          <Tool />
        </section>
      </div>

      <section className="mt-6">
        <h2 className="mb-4 text-xl font-semibold">{t("tips")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {goal.tips.map((tip, i) => (
            <div key={i} className="rounded-3xl border border-border bg-surface p-6">
              <Lightbulb className="size-6 text-mint" />
              <h3 className="mt-4 font-semibold">{tx(tip.title)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tx(tip.text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-primary/40 bg-card p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold"><Crown className="size-6 text-primary" /> Premium</h2>
          <Button asChild><Link to="/pricing">{t("see_plans")}</Link></Button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {locked.map((l) => (
            <div key={l.t} className="flex items-center gap-3 rounded-xl bg-surface p-4 opacity-80">
              <l.i className="size-5 text-muted-foreground" />
              <span className="flex-1 text-sm">{l.t}</span>
              <Lock className="size-4 text-primary" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
