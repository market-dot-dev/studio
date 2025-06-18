import { getInvitationDetails } from "@/app/services/team-management-service";
import { requireUser } from "@/app/services/user-context-service";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AcceptInviteBtn } from "./accept-invite-btn";

const BackBtn = () => (
  <Button asChild variant="outline" className="w-full">
    <Link href="/">Go to Dashboard</Link>
  </Button>
);

export default async function JoinPage(props: {
  params: Promise<{ inviteId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { inviteId } = await props.params;
  const { error } = await props.searchParams;
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
            <BackBtn />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Handle acceptance error
  if (error === "acceptance-failed") {
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
            <BackBtn />
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
            <BackBtn />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join {invitation.organization.name}</CardTitle>
          <CardDescription>
            You've been invited to join this organization on Market.dev.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-3">
          <p className="text-center text-sm text-muted-foreground">
            By accepting, you'll be able to access this organization and collaborate with the team.
          </p>
          <AcceptInviteBtn
            inviteId={inviteId}
            userId={user.id}
            organizationId={invitation.organizationId}
          />
          <BackBtn />
        </CardFooter>
      </Card>
    </div>
  );
}
