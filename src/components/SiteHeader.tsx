import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Coins, LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getUser, logout, type PuloraUser } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const [user, setUser] = useState<PuloraUser | null>(null);
  const navigate = useNavigate();
  useEffect(() => setUser(getUser()), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2" data-tour="logo">
          <span className="grid size-9 place-items-center rounded-xl bg-gold text-primary-foreground">
            <Coins className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">PULORA</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <Link to="/tools" data-tour="tools" className="hidden rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground sm:block" activeProps={{ className: "text-foreground" }}>
            {t("nav_tools")}
          </Link>
          <Link to="/pricing" data-tour="pricing" className="hidden rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground sm:block" activeProps={{ className: "text-foreground" }}>
            {t("nav_pricing")}
          </Link>
          <div data-tour="lang" className="flex rounded-lg border border-border p-0.5">
            {(["uz", "ru"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>
          {user?.verified ? (
            <>
              <Button asChild size="sm" className="ml-2">
                <Link to="/dashboard">{t("nav_home")}</Link>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label={t("nav_logout")}
                onClick={() => {
                  logout();
                  navigate({ to: "/", replace: true });
                  setUser(null);
                }}
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="ml-2">
              <Link to="/register">{t("nav_start")}</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
