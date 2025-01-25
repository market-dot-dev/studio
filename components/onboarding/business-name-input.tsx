import { TextInput } from "@tremor/react";

export default function BusinessNameInput({
  userGithubUsername,
}: {
  userGithubUsername: string | null;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-900">Business Name</label>
      <TextInput
        name="businessName"
        defaultValue={userGithubUsername ?? ""}
        placeholder={"Business Name"}
        className="bg-white"
        required
      />
    </div>
  );
}
