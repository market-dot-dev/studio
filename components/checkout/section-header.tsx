export default function SectionHeader({ headerName }: { headerName: string }) {
  return (
    <div className="mb-4">
      <strong className="mb-2 text-slate-600">{headerName}</strong>
    </div>
  );
}
