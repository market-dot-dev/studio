export default function DashedCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-center items-center gap-6 rounded-lg border border-dashed border-gray-300/80 bg-stone-200/25 p-6 md:p-9">
      {children}
    </div>
  );
}
