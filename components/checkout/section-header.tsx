export default function SectionHeader({ headerName }: { headerName: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold tracking-tight text-stone-800 md:text-3xl">{headerName}</h1>
    </div>
  );
}
