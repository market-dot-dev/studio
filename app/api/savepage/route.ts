import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const existingPage = await prisma.page.findFirst({
      where: { siteId: data.siteId },
    });

    let page;
    if (existingPage) {
      // Update existing page
      page = await prisma.page.update({
        where: { id: existingPage.id },
        data: { content: data.content },
      });
    } else {
      // Create new page
      page = await prisma.page.create({
        data: {
          siteId: data.siteId,
          content: data.content,
          // other fields...
        },
      });
    }

    await prisma.$disconnect();

    return new Response(JSON.stringify(page), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error saving page' }), { status: 500 });
  }
}
