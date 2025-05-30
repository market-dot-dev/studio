import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";

// Placeholder data - replace with actual data fetching based on inviteId
const invitationDetails = {
  organizationName: "Acme Inc.",
  inviterName: "Alice Wonderland",
  isValid: true // Assume valid for prototype
};

export default async function JoinPage(props: { params: Promise<{ inviteId: string }> }) {
  const { inviteId } = await props.params;
  const { organizationName, inviterName, isValid } = invitationDetails; // Use placeholder

  // TODO: Fetch actual invitation details based on inviteId
  // TODO: Handle invalid/expired inviteId

  if (!isValid) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is either invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 dark:bg-stone-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join {organizationName}</CardTitle>
          <CardDescription>
            You have been invited by {inviterName} to join the {organizationName} organization on
            Market.dev.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">Create an account or sign in to accept.</p>
          <Button
            className="w-full"
            onClick={() => alert(`Placeholder: Initiate GitHub OAuth for invite ${inviteId}`)} // Placeholder
          >
            <SiGithub className="mr-2 size-5" />
            Join with GitHub
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
