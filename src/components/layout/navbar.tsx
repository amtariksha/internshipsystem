"use client";

import { useTranslations } from "next-intl";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const { isSignedIn } = useAuth();

  const navLinks = [
    ...(isSignedIn
      ? [
          { href: "/" as const, label: t("dashboard") },
          { href: "/start" as const, label: t("assessment") },
        ]
      : []),
    { href: "/astro/quick" as const, label: t("astroCareer") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4"
      >
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-mono text-lg font-bold tracking-tight"
            aria-label={`${tc("appName")} — ${t("home")}`}
          >
            AEDHAS
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />

          {isSignedIn ? (
            <UserButton />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <SignInButton mode="redirect">
                <Button
                  variant="ghost"
                  size="default"
                  aria-label={tc("signIn")}
                >
                  {tc("signIn")}
                </Button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <Button size="default" aria-label={tc("signUp")}>
                  {tc("signUp")}
                </Button>
              </SignUpButton>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>AEDHAS</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4">
                {navLinks.map(({ href, label }) => (
                  <SheetClose key={href} render={<Link href={href} />}>
                    <span className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
                      {label}
                    </span>
                  </SheetClose>
                ))}
              </div>
              {!isSignedIn && (
                <div className="mt-auto flex flex-col gap-2 p-4">
                  <SignInButton mode="redirect">
                    <Button
                      variant="outline"
                      className="w-full"
                      aria-label={tc("signIn")}
                    >
                      {tc("signIn")}
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="redirect">
                    <Button className="w-full" aria-label={tc("signUp")}>
                      {tc("signUp")}
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
