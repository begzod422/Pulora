import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { GOALS } from "@/lib/goals";
import { getUser, saveUser } from "@/lib/store";

export const Route = createFileRoute("/goal")({
  head: () => ({
    meta: [
      { title: "Maqsadingiz nima? — PULORA" },
      { name: "description", content: "Moliyaviy maqsadingizni tanlang: tejash, qarzdan chiqish, reja, oila budjeti yoki daromad." },
      { property: "og:title", content: "Maqsadingiz nima? — PULORA" },
      { property: "og:description", content: "Bitta maqsad tanlang — PULORA sizga moslashadi." },
    ],
  }),
  component: GoalPage,
});

function GoalPage() {
  const { t, tx } = useI18n();
  const navigate = useNavigate();
  useEffect(() => {
    if (!getUser()?.verified) navigate({ to: "/register", replace: true });
  }, [navigate]);

  const pick = (id: (typeof GOALS)[number]["id"]) => {
    const u = getUser();
    if (!u) return;
    saveUser({ ...u, goal: id });
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-glow px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-5xl font-bold tracking-tight md:text-7xl">{t("goal_title")}</h1>
        <p className="mt-4 text-center text-lg text-muted-foreground">{t("goal_sub")}</p>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map((g) => (
            <button key={g.id} onClick={() => pick(g.id)} className="card-hover group rounded-3xl border border-border bg-card p-7 text-left">
              <div className="grid size-14 place-items-center rounded-2xl bg-accent text-primary transition-colors group-hover:bg-gold group-hover:text-primary-foreground">
                <g.icon className="size-7" />
              </div>
              <div className="mt-6 flex items-center justify-between text-xl font-semibold">
                {tx(g.title)} <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{tx(g.tagline)}</p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
