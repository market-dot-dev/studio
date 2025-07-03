import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        className={`w-full @2xl:w-fit ${className || ""}`}
      >
        <TabsList variant="background" className="w-full @2xl:w-fit">
          <TabsTrigger value="monthly" variant="background" className="w-full @2xl:w-fit">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" variant="background" className="w-full @2xl:w-fit">
            Yearly
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
