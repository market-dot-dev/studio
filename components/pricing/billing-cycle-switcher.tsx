import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface BillingCycleSwitcherProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
  className?: string;
}

export function BillingCycleSwitcher({ isAnnual, onToggle, className }: BillingCycleSwitcherProps) {
  return (
    <div className="flex w-full items-center justify-center">
      <Tabs
        value={isAnnual ? "yearly" : "monthly"}
        onValueChange={(value) => onToggle(value === "yearly")}
        className={cn("w-full @3xl:w-fit tracking-normal", className)}
      >
        <TabsList variant="background" className="w-full @3xl:w-fit">
          <TabsTrigger value="monthly" variant="background" className="w-full @3xl:w-fit">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" variant="background" className="w-full @3xl:w-fit">
            Yearly
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
