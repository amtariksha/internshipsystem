import { redirect } from "next/navigation";

interface CandidatePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function CandidateDetailPage({ params }: CandidatePageProps) {
  const { id, locale } = await params;
  // Redirect to report page — employer sees the same report as the candidate
  redirect(`/${locale}/reports/${id}`);
}
