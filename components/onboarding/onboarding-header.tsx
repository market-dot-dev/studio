export function OnboardingHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-2 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
