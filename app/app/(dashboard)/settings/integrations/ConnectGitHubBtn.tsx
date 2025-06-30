import { Button } from "@/components/ui/button";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";

interface ConnectGitHubBtnProps {
  installationUrl: string;
  className?: string;
}

export function ConnectGitHubBtn({ installationUrl, className }: ConnectGitHubBtnProps) {
  return (
    <Button asChild variant="outline" className={className}>
      <Link href={installationUrl}>
        <SiGithub className="size-4" />
        Install GitHub App
      </Link>
    </Button>
  );
}
