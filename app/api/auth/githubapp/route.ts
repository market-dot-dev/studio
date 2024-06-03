import { NextRequest } from "next/server";
import RepoService from "@/app/services/RepoService";

const Actions = {
  CREATED: 'created', // app installed
  DELETED: 'deleted', // app uninstalled
  ACCOUNT_RENAMED: 'renamed', // account/org renamed, on which the app is installed
  MEMBER_REMOVED: 'member_removed', // member removed from organization
  MEMBER_ADDED: 'member_added', // member added to organization
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

    // the parsedBody is an array when org/account is renamed;
    const payload = Array.isArray(parsedBody) ? parsedBody.find(item => item.action && item.account) : parsedBody;
    
    const { action, installation : { id: installationId }} = payload;
    
    switch (action) {
      case Actions.CREATED :
        const {account: { login, id, type } } = parsedBody.installation;
        await RepoService.createInstallation(installationId, login, type === AccountTypes.ORG ? null : id);
        break;
      case Actions.DELETED:
        await RepoService.removeInstallation(installationId);
        break;
      case Actions.MEMBER_REMOVED:
        const { membership: { user : { id : removedId }} } = parsedBody;
        await RepoService.removeGithubOrgMember(installationId, removedId);
        break;
      case Actions.MEMBER_ADDED:
        const { membership: { user : { id : addedId }} } = parsedBody;
        await RepoService.addGithubOrgMember(installationId, addedId);
        break;
      case Actions.ACCOUNT_RENAMED:
        const { account: { login : newLogin } } = payload;
        await RepoService.renameInstallation(installationId, newLogin);
        break;
    } 

    return new Response('ok', { status: 200 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
