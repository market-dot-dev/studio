import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LocationEntryInput() {
  return (
    <div className="space-y-2">
      <Label htmlFor="location">Where are you based out of?</Label>
      <Input
        id="location"
        placeholder="Toronto, Canada"
        className="bg-white"
        name="location"
        required
      />
    </div>
  );
}
