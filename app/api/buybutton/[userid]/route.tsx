import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
  
  const searchParams = req.nextUrl.searchParams;
  const buttonText = searchParams.get('buttonText') || 'Buy';

  const svg = `
    <svg fill="none" width="570" height="100" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: center; font-family: Arial, sans-serif; padding: 6px;">
          <div style="background: black; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
            <div style="background: white; border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
              <div style="background: black; border-radius: 50%; width: 38px; height: 38px;">
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; flex-grow: 1; gap: 4px">
            <div style="font-weight: bold; font-size: 1.2rem">Gitwallet</div>
            <div>Premium services available on Gitwallet</div>
          </div>
          <div style="display: flex; flex-grow: 1; justify-content: center;">
            <button style="background: black; padding: 0.5rem 1rem; color: white; font-size: 1.3rem; border-radius: 10px; width: 180px">${buttonText}</button>
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
