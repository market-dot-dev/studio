import { UsersRound, UserRound } from "lucide-react";

export type TeamType = "team" | "individual";

export default function TeamSelectionRadioGroup({
  teamType,
  setTeamType,
}: {
  teamType: TeamType | null;
  setTeamType: (teamType: TeamType) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-900">
        Are you a team or independent?
      </label>
      <div className="space-y-2">
        <label className="block w-full rounded-tremor-default focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200">
          <div className="flex cursor-pointer items-center justify-between rounded-tremor-default border bg-white p-4 shadow-sm hover:bg-gray-50 [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-marketing-swamp">
            <div className="flex items-center">
              <UsersRound className="mr-3 h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-900">We&apos;re a team</span>
            </div>
            <input
              type="radio"
              name="team-type"
              value="team"
              checked={teamType === "team"}
              onChange={(e) => setTeamType("team")}
              required
              className="text-gray-500 checked:text-marketing-swamp focus:outline-none focus:ring-0"
            />
          </div>
        </label>
        <label className="block w-full rounded-tremor-default focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-200">
          <div className="flex cursor-pointer items-center justify-between rounded-tremor-default border bg-white p-4 shadow-sm hover:bg-gray-50 [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-1 [&:has(input:checked)]:ring-marketing-swamp">
            <div className="flex items-center">
              <UserRound className="mr-3 h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-900">It&apos;s just me</span>
            </div>
            <input
              type="radio"
              name="team-type"
              value="individual"
              checked={teamType === "individual"}
              onChange={(e) => setTeamType("individual")}
              required
              className="text-gray-500 checked:text-marketing-swamp focus:outline-none focus:ring-0"
            />
          </div>
        </label>
      </div>
    </div>
  );
}
