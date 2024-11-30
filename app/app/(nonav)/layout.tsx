import { ReactNode } from "react";

export default async function NoNavLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
