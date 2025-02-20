import UserService from '@/app/services/UserService';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
  
  // const searchParams = req.nextUrl.searchParams;

  let user = await UserService.findUser(params.userid);

  const buttonText = 'View';
  const description = user?.projectName ? `${user.projectName} has premium services available on market.dev` : 'This project has premium services available on market.dev.';
  const svg = `
    <svg fill="none" width="700" height="100" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: center; font-family: Arial, sans-serif; padding: 12px; border: 1px solid #ccc; border-radius: 12px;">
          <div style="min-width: 60px">
            <div style="background: black; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
              <div style="background: white; border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
                <div style="background: black; border-radius: 50%; width: 38px; height: 38px;"></div>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; flex-grow: 1; gap: 2px">
            <div style="font-weight: bold; font-size: 1.2rem">Premium Services Available</div>
            <div style="font-size: 1.1rem; color: #999">${description}</div>
          </div>
          <div style="display: flex; flex-grow: 1; justify-content: center;">
            <button style="background: #333; padding: 0.5rem 1rem; color: white; font-size: 1.3rem; border-radius: 10px; width: 120px">
            <span style="display: flex; align-items: center; justify-content: center; gap: 0.5rem">
            <span>${buttonText}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
            </button>
          </div>
        </div>
      </foreignObject>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
