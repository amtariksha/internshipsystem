export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-4 py-3">
        <span className="font-mono text-sm font-bold">AEDHAS Assessment</span>
      </header>
      <main className="flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
