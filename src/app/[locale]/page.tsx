import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { Link, redirect } from "@/lib/i18n/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LandingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;

  const { userId } = await auth();
  if (userId) {
    redirect({ href: "/dashboard", locale });
  }

  const t = await getTranslations({ locale, namespace: "landing" });
  const td = await getTranslations({ locale, namespace: "dimensions" });

  const features = [
    { key: "dimensions" as const, icon: "📊" },
    { key: "ai" as const, icon: "🤖" },
    { key: "multilingual" as const, icon: "🌐" },
    { key: "antiCheat" as const, icon: "🛡️" },
  ];

  const dimensions = [
    "grit_perseverance", "risk_tolerance", "proactivity", "eq_self_regulation",
    "growth_mindset", "integrity", "strategic_thinking", "collaboration",
    "self_efficacy", "innovativeness", "action_orientation", "physical_mental_vitality",
  ] as const;

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-24 text-center">
            <Badge variant="secondary" className="mb-4">
              {t("hero.badge")}
            </Badge>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="font-semibold">
                  {t("hero.cta")}
                </Button>
              </Link>
              <Link href="/astro/quick">
                <Button variant="outline" size="lg">
                  {t("hero.secondaryCta")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ key, icon }) => (
                <Card key={key} className="bg-card">
                  <CardContent className="pt-6">
                    <div className="text-3xl">{icon}</div>
                    <h3 className="mt-3 font-semibold">
                      {t(`features.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t(`features.${key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 12 Dimensions */}
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold">
              {t("audience.dimensionsTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
              {t("audience.dimensionsSubtitle")}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {dimensions.map((dim) => (
                <Badge key={dim} variant="outline" className="px-3 py-1.5 text-sm">
                  {td(dim)}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-2xl font-bold">{t("audience.title")}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(["students", "founders", "colleges", "employers"] as const).map(
                (key) => (
                  <Card key={key} className="bg-card">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">
                        {t(`audience.${key}`)}
                      </p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
