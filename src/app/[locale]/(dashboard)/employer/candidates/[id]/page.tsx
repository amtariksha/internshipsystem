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
    .select("role")
    .eq("clerk_id", clerkId)
    .single();
  if (!caller || caller.role !== "EMPLOYER") {
    redirect({ href: "/", locale });
  }

  // Redirect to report page — employer sees the same report as the candidate
  redirect({ href: `/reports/${id}`, locale });
}
