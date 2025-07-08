import { Separator } from "@/components/ui/separator";
import { SharedFeatureList } from "./shared-feature-list";

export function MobileFeaturesList() {
  return (
    <div className="mt-2 flex w-full flex-col @3xl:hidden">
      <p className="mb-1.5 text-sm font-semibold tracking-normal text-foreground">
        All plans include:
      </p>
      <Separator className="mb-2.5" />
      <SharedFeatureList />
    </div>
  );
}
