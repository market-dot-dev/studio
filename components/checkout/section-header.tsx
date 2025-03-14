export default function SectionHeader({ headerName }: { headerName: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl md:text-3xl tracking-tight font-bold text-stone-800">{headerName}</h1>
    </div>
  );
}
