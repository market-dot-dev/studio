import { NextRequest } from "next/server";
import RepoService from "@/app/services/RepoService";

const encoder = new TextEncoder();
const secret = process.env.GITHUB_APP_WEBHOOK_SECRET ?? '';

async function verifySignature(secret: string, header: any, payload: any) {
  let parts = header.split("=");
  let sigHex = parts[1];

  let algorithm = { name: "HMAC", hash: { name: 'SHA-256' } };

  let keyBytes = encoder.encode(secret);
  let extractable = false;
  let key = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      algorithm,
      extractable,
      [ "sign", "verify" ],
  );

  let sigBytes = hexToBytes(sigHex);
  let dataBytes = encoder.encode(payload);
  let equal = await crypto.subtle.verify(
      algorithm.name,
      key,
      sigBytes,
      dataBytes,
  );

  return equal;
}

function hexToBytes(hex: string) {
  let len = hex.length / 2;
  let bytes = new Uint8Array(len);

  let index = 0;
  for (let i = 0; i < hex.length; i += 2) {
      let c = hex.slice(i, i + 2);
      let b = parseInt(c, 16);
      bytes[index] = b;
      index += 1;
  }

  return bytes;
}

const Actions = {
  CREATED: 'created', // app installed
  DELETED: 'deleted', // app uninstalled
  ACCOUNT_RENAMED: 'renamed', // account/org renamed, on which the app is installed
  MEMBER_REMOVED: 'member_removed', // member removed from organization
  MEMBER_ADDED: 'member_added', // member added to organization
  NEW_PERMISSIONS_ACCEPTED: 'new_permissions_accepted',
};

const AccountTypes = {
  USER: 'User',
  ORG: 'Organization'
}

export async function POST(req: NextRequest) {
  try {
    // Verify the request signature
    const signature = req.headers.get('X-Hub-Signature-256');
    
    
    const chunks = [];

    for await (const chunk of req.body as any) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString('utf-8');
    const parsedBody = JSON.parse(body);

    if (!signature || !(await verifySignature(secret, signature, body))) {
      return new Response('Bad Request', { status: 400 });
    } 

    // the parsedBody is an array when org/account is renamed;
    const payload = Array.isArray(parsedBody) ? parsedBody.find(item => item.action && item.account) : parsedBody;
    
    const { action, installation : { id: installationId }} = payload;
    
    switch (action) {
      case Actions.CREATED :
        const {account: { login, id, type } } = payload.installation;
        await RepoService.createInstallation(installationId, login, type === AccountTypes.ORG ? null : id);
        break;
      case Actions.DELETED:
        await RepoService.removeInstallation(installationId);
        break;
      case Actions.MEMBER_REMOVED:
        const { membership: { user : { id : removedId }} } = payload;
        await RepoService.removeGithubOrgMember(installationId, removedId);
        break;
      case Actions.MEMBER_ADDED:
        const { membership: { user : { id : addedId }} } = payload;
        await RepoService.addGithubOrgMember(installationId, addedId);
        break;
      case Actions.ACCOUNT_RENAMED:
        const { account: { login : newLogin } } = payload;
        await RepoService.renameInstallation(installationId, newLogin);
        break;
      case Actions.NEW_PERMISSIONS_ACCEPTED:
        const { account: { type: accountType, login: accountLogin } } = payload.installation;
        if( accountType === AccountTypes.ORG) {
          await RepoService.addGithubOrgMembers(installationId, accountLogin);
        }
        break;
    } 

    return new Response('ok', { status: 200 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
