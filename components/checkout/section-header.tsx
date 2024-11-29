import { Bold } from "@tremor/react";

export default function SectionHeader({ headerName }: { headerName: string }) {
  return (
    <div className="mb-4">
      <Bold className="mb-2 text-slate-600">{headerName}</Bold>
    </div>
  );
}
