"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

interface PlanetPosition {
  longitude: number;
  sign: string;
  signSanskrit: string;
  degree: number;
  house: number;
}

interface HousePosition {
  sign: string;
  signSanskrit: string;
  degree: number;
}

interface DashaData {
  currentMahadasha: string;
  dashaYears: number;
  birthNakshatra: number;
  nakshatraLord: string;
}

interface CareerSuggestion {
  career: string;
  score: number;
  reasoning: string;
}

interface KundliResult {
  destinyNumber: number;
  soulNumber: number;
  personalityNumber: number;
  sunSign: string;
  moonSign: string;
  ascendant: string;
  ascendantSanskrit: string;
  planetaryData: Record<string, PlanetPosition>;
  houseData: Record<string, HousePosition>;
  dashaData: DashaData;
  topCareers: CareerSuggestion[];
}

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const PLANET_ORDER = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

function formatPlace(place: GeoResult): string {
  return [place.name, place.admin1, place.country].filter(Boolean).join(", ");
}

export default function AstroFullPage() {
  const t = useTranslations("astro");

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeResults, setPlaceResults] = useState<GeoResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<GeoResult | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KundliResult | null>(null);

  async function searchPlace() {
    const query = placeQuery.trim();
    if (query.length < 2) {
      setPlaceResults([]);
      return;
    }
    setIsGeocoding(true);
    try {
      const url = `${GEOCODE_URL}?name=${encodeURIComponent(
        query
      )}&count=5&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) {
        setPlaceResults([]);
        return;
      }
      const data = await res.json();
      setPlaceResults(Array.isArray(data.results) ? data.results : []);
    } catch {
      setPlaceResults([]);
    } finally {
      setIsGeocoding(false);
    }
  }

  function handlePlaceInput(value: string) {
    setPlaceQuery(value);
    setSelectedPlace(null);
  }

  function selectPlace(place: GeoResult) {
    setSelectedPlace(place);
    setPlaceQuery(formatPlace(place));
    setPlaceResults([]);
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!selectedPlace) {
      setError(t("full.selectPlaceError"));
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/astro/full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          dob,
          birthTime,
          latitude: selectedPlace.latitude,
          longitude: selectedPlace.longitude,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || t("full.genericError"));
        return;
      }
      setResult(await res.json());
    } catch {
      setError(t("full.genericError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{t("full.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("full.description")}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("full.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("quick.nameLabel")}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pradeep / प्रदीप"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">{t("quick.dobLabel")}</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthTime">{t("full.birthTimeLabel")}</Label>
                  <Input
                    id="birthTime"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="place">{t("full.birthPlaceLabel")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="place"
                      value={placeQuery}
                      onChange={(e) => handlePlaceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          searchPlace();
                        }
                      }}
                      placeholder={t("full.birthPlacePlaceholder")}
                      autoComplete="off"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={searchPlace}
                      disabled={isGeocoding}
                    >
                      {isGeocoding ? t("full.searching") : t("full.searchPlace")}
                    </Button>
                  </div>

                  {placeResults.length > 0 && (
                    <ul className="mt-1 divide-y divide-border rounded-lg border border-border">
                      {placeResults.map((place) => (
                        <li key={place.id}>
                          <button
                            type="button"
                            onClick={() => selectPlace(place)}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                          >
                            {formatPlace(place)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedPlace && (
                    <p className="text-xs text-muted-foreground">
                      {t("full.coordinates")}: {selectedPlace.latitude.toFixed(4)},{" "}
                      {selectedPlace.longitude.toFixed(4)}
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("full.generating") : t("full.analyze")}
                </Button>
              </form>

              <p className="mt-4 text-center text-sm">
                <Link
                  href="/astro/quick"
                  className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {t("full.backToQuick")}
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Numerology numbers */}
              <Card>
                <CardContent className="grid grid-cols-3 gap-4 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {result.destinyNumber}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("results.destinyNumber")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {result.soulNumber}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("results.soulNumber")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {result.personalityNumber}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("results.personalityNumber")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Signs + Ascendant */}
              <Card>
                <CardContent className="flex flex-wrap justify-around gap-4 pt-6">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">
                      {result.sunSign}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {t("results.sunSign")}
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">
                      {result.moonSign}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {t("results.moonSign")}
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">
                      {result.ascendant} ({result.ascendantSanskrit})
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {t("results.ascendant")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Dasha */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t("results.currentDasha")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-around gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">
                      {result.dashaData.currentMahadasha}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("results.mahadasha")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">
                      {result.dashaData.nakshatraLord}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("results.nakshatraLord")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">
                      {result.dashaData.birthNakshatra}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("results.birthNakshatra")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Planetary positions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t("results.planetaryPositions")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {PLANET_ORDER.filter(
                    (planet) => result.planetaryData[planet]
                  ).map((planet) => {
                    const data = result.planetaryData[planet];
                    return (
                      <div
                        key={planet}
                        className="flex items-center justify-between border-b border-border py-1 text-sm last:border-0"
                      >
                        <span className="font-medium">{planet}</span>
                        <span className="text-muted-foreground">
                          {data.sign} {data.degree}&deg; &middot;{" "}
                          {t("results.house")} {data.house}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Careers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t("results.topCareers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.topCareers.map((career, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {career.career}
                        </span>
                        <span className="font-mono text-xs text-primary">
                          {career.score}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {career.reasoning}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <p className="text-center text-xs text-muted-foreground">
                {t("disclaimer")}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
