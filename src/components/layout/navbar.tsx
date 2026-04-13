"use client";

import { useTranslations } from "next-intl";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Link } from "@/lib/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-mono text-lg font-bold tracking-tight">
            AEDHAS
          </Link>
          {isSignedIn && (
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("dashboard")}
              </Link>
              <Link
                href="/start"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("assessment")}
              </Link>
              <Link
                href="/astro/quick"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("astroCareer")}
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="redirect">
                <Button variant="ghost" size="sm">
                  {tc("signIn")}
                </Button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <Button size="sm">{tc("signUp")}</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
