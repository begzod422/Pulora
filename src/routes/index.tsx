import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, Route as RouteIcon, Users, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { GOALS } from "@/lib/goals";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PULORA — moliyaviy savodxonlik yordamchisi" },
      { name: "description", content: "Pul tejash, qarzdan chiqish, oila budjeti va daromadni oshirish uchun shaxsiy moliyaviy yordamchi." },
      { property: "og:title", content: "PULORA — pulingiz siz uchun ishlasin" },
      { property: "og:description", content: "Maqsad qo'ying, hisoblang va moliyaviy odatlaringizni kuzating." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, tx } = useI18n();
  const feats = [
    { i: Calculator, t: t("feat1_t"), d: t("feat1_d") },
    { i: RouteIcon, t: t("feat2_t"), d: t("feat2_d") },
    { i: Users, t: t("feat3_t"), d: t("feat3_d") },
  ];
  return (
    <main>
      <section className="relative overflow-hidden bg-glow">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 md:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-mint" /> {t("hero_kicker")}
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            {t("hero_title").split(" ").slice(0, -2).join(" ")}{" "}
            <span className="text-gold">{t("hero_title").split(" ").slice(-2).join(" ")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t("hero_sub")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-13 rounded-xl px-7 text-base shadow-gold">
              <Link to="/register">{t("hero_cta")} <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-13 rounded-xl px-7 text-base">
              <Link to="/tools">{t("hero_cta2")}</Link>
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-4 border-t border-border pt-8 md:max-w-2xl">
            {[["12 400+", t("stat1")], ["850 000", t("stat2")], ["5", t("stat3")]].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold md:text-3xl">{n}</div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-3">
        {feats.map((f) => (
          <div key={f.t} className="card-hover rounded-3xl border border-border bg-card p-7">
            <f.i className="size-8 text-primary" />
            <h3 className="mt-5 text-lg font-semibold">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {GOALS.map((g) => (
            <Link key={g.id} to="/register" className="card-hover rounded-2xl border border-border bg-surface p-5">
              <g.icon className="size-6 text-mint" />
              <div className="mt-4 font-semibold">{tx(g.title)}</div>
              <div className="mt-1 text-xs text-muted-foreground">{tx(g.tagline)}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
