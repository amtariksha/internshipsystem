import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/db/supabase";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const sb = getSupabase();
  const { data: profile } = await sb.rpc("get_user_profile", {
    p_clerk_id: user.id,
  });

  const userProfile = profile?.[0] ?? null;

  return (
    <DashboardContent
      userName={user.firstName ?? "User"}
      educationalStage={userProfile?.educational_stage ?? null}
      fieldOfStudy={userProfile?.field_of_study ?? null}
      onboardingComplete={userProfile?.onboarding_complete ?? false}
    />
  );
}
