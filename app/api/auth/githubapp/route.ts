import { NextRequest } from "next/server";
import RepoService from "@/app/services/RepoService";

const Actions = {
  CREATED: 'created',
  DELETED: 'deleted',
  // REMOVED: 'removed', // removed repositories
  // ADDED: 'added', // added repositories
};

const AccountTypes = {
  USER: 'User',
  ORG: 'Organization'
}

export async function POST(req: NextRequest) {
  try {
    const chunks = [];

    for await (const chunk of req.body as any) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString('utf-8');
    const parsedBody = JSON.parse(body);
    
    const { action, installation: { id: installationId, account: { login, id, type } }} = parsedBody;
    
    if (Actions.CREATED === action) {
      await RepoService.createInstallation(installationId, login, type === AccountTypes.ORG ? null : id);
    } else if (Actions.DELETED === action) {
      await RepoService.removeInstallation(installationId);
    }

    return new Response('ok', { status: 200 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
