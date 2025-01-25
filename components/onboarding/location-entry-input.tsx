import { TextInput } from "@tremor/react";

export default function LocationEntryInput() {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        Where are you based out of?
      </label>
      <TextInput
        placeholder="Toronto, Canada"
        className="bg-white text-gray-900"
        name="location"
        required
      />
    </div>
  );
}
