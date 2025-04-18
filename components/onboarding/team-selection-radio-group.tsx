import { UserRound, UsersRound } from "lucide-react";
import { Label } from "../ui/label";

export type TeamType = "team" | "individual";

export default function TeamSelectionRadioGroup({
  teamType,
  setTeamType
}: {
  teamType: TeamType | null;
  setTeamType: (teamType: TeamType) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>Are you a team or independent?</Label>
      <div className="space-y-2">
        <label className="block w-full rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-200">
          <div className="shadow-border-sm hover:shadow-border [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-marketing-swamp flex cursor-pointer items-center justify-between rounded bg-white p-4 pt-3.5 transition-[box-shadow,colors] [&:has(input:checked)]:ring-2">
            <div className="flex items-center">
              <UsersRound className="mr-2.5 size-[18px] text-stone-500" />
              <span className="text-sm font-medium text-stone-900">We&apos;re a team</span>
            </div>
            <input
              type="radio"
              name="team-type"
              value="team"
              aria-label="We're a team"
              checked={teamType === "team"}
              onChange={(e) => setTeamType("team")}
              required
              className="checked:text-marketing-swamp text-stone-500 focus:outline-none focus:ring-0"
            />
          </div>
        </label>
        <label className="block w-full rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-200">
          <div className="shadow-border-sm hover:shadow-border [&:has(input:checked)]:border-marketing-swamp [&:has(input:checked)]:ring-marketing-swamp flex cursor-pointer items-center justify-between rounded bg-white p-4 [&:has(input:checked)]:ring-1">
            <div className="flex items-center">
              <UserRound className="mr-3 size-5 text-stone-500" />
              <span className="text-sm font-medium text-stone-900">It&apos;s just me</span>
            </div>
            <input
              type="radio"
              name="team-type"
              value="individual"
              aria-label="It's just me"
              checked={teamType === "individual"}
              onChange={(e) => setTeamType("individual")}
              required
              className="checked:text-marketing-swamp text-stone-500 focus:outline-none focus:ring-0"
            />
          </div>
        </label>
      </div>
    </div>
  );
}
