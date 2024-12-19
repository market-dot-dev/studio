export default function DashedCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-center gap-6 rounded-[38px] border border-dashed border-gray-300 bg-[#FDFDFD] p-8">
      {children}
    </div>
  );
}
