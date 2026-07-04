import { auth } from "@clerk/nextjs/server";
import { redirect } from "@/lib/i18n/navigation";
import { getSupabase } from "@/lib/db/supabase";

interface CandidatePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function CandidateDetailPage({ params }: CandidatePageProps) {
  const { id, locale } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect({ href: "/sign-in", locale });
  }

  const sb = getSupabase();

  const { data: caller } = await sb
    .from("users")
    .select("role, organization_id")
    .eq("clerk_id", clerkId)
    .single();
  if (!caller || caller.role !== "EMPLOYER") {
    redirect({ href: "/", locale });
  }

  const organizationId = caller!.organization_id as string | null;
  // No organization → no candidates to view.
  if (!organizationId) {
    redirect({ href: "/employer", locale });
  }

  // Verify the requested report belongs to a student in the employer's org.
  // Chain: report.slug → session_id → assessment_sessions.user_id → users.organization_id
  const { data: report } = await sb
    .from("reports")
    .select("session_id")
    .eq("slug", id)
    .maybeSingle();

  if (!report) {
    redirect({ href: "/employer", locale });
  }

  const { data: session } = await sb
    .from("assessment_sessions")
    .select("user_id")
    .eq("id", report!.session_id as string)
    .maybeSingle();

  const { data: candidate } = session
    ? await sb
        .from("users")
        .select("organization_id")
        .eq("id", session.user_id as string)
        .maybeSingle()
    : { data: null };

  if (!candidate || candidate.organization_id !== organizationId) {
    // Candidate is outside the employer's organization — deny (closes IDOR).
    redirect({ href: "/employer", locale });
  }

  // Authorized — employer sees the same report as the candidate.
  redirect({ href: `/reports/${id}`, locale });
}
