import { BaseEmailTemplate } from "@/app/components/email/base-template";
import { SessionUser } from "@/app/models/Session";
import { sendEmail } from "@/app/services/email-service";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Check admin permissions
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Cast the session user to include our custom fields
  const user = session.user as unknown as SessionUser;

  // Verify user is an admin
  if (user.roleId !== "admin") {
    return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { users, subject, content } = body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ message: "No users provided" }, { status: 400 });
    }

    if (!subject) {
      return NextResponse.json({ message: "Subject is required" }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }

    // Create HTML email template using BaseEmailTemplate
    const createEmailContent = (user: any) => {
      let formattedContent = content
        .replace(/{name}/g, user.name || "there")
        .replace(/{email}/g, user.email || "");

      // Convert newlines to <br/> tags for HTML emails
      formattedContent = formattedContent.replace(/\n/g, "<br/>");

      return BaseEmailTemplate({
        previewText: subject,
        children: formattedContent
      });
    };

    // Send emails to all users
    const results = await Promise.allSettled(
      users.map(async (user: any) => {
        if (!user.email) {
          return { success: false, email: user.email, reason: "No email address" };
        }

        const html = createEmailContent(user);
        const text = content
          .replace(/{name}/g, user.name || "there")
          .replace(/{email}/g, user.email || "");

        try {
          await sendEmail(user.email, subject, text, html);
          return { success: true, email: user.email };
        } catch (error) {
          console.error("Failed to send email to", user.email, error);
          return {
            success: false,
            email: user.email,
            reason: error instanceof Error ? error.message : "Unknown error"
          };
        }
      })
    );

    // Calculate stats
    const totalSent = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
    const totalFailed = results.filter(
      (r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.success)
    ).length;

    return NextResponse.json({
      message: `Successfully sent ${totalSent} emails. Failed to send ${totalFailed} emails.`,
      results,
      stats: {
        totalSent,
        totalFailed,
        total: users.length
      }
    });
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
