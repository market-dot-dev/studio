import { ReactNode } from "react";

export default function PageLayout({ children }: { children: ReactNode }) {
  return <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex flex-col space-y-6">{children}</div>
    </div>;
}
