import { acceptInvitation, getInvitationDetails } from "@/app/services/team-management-service";
import { requireUser } from "@/app/services/user-context-service";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function JoinPage(props: { params: Promise<{ inviteId: string }> }) {
  const { inviteId } = await props.params;
  const user = await requireUser();
  const invitation = await getInvitationDetails(inviteId);

  // Handle invalid invitation
  if (!invitation || invitation.expiresAt < new Date()) {
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
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Check if user's email matches the invitation
  if (user.email !== invitation.email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Email Mismatch</CardTitle>
            <CardDescription>
              This invitation was sent to <strong>{invitation.email}</strong>, but you're signed in
              as <strong>{user.email}</strong>. Please contact the person who invited you to send a
              new invitation to your current email address.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Accept the invitation automatically
  try {
    await acceptInvitation(inviteId, user.id);
    redirect("/?message=invitation-accepted");
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              There was an error accepting the invitation. You may already be a member of this
              organization.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}
