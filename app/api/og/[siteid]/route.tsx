import { ImageResponse } from '@vercel/og'
import SiteService from '@/app/services/SiteService'
import { Site } from '@prisma/client';

type SiteInfo = Partial<Site> & {
  user: {
    projectName: string;
    projectDescription: string;
  };
};

// Get nav items for the site of the current admin
export async function GET(
  _req: Request,
  { params }: { params: { siteid: string } },
) {

  const site = await SiteService.getSiteInfo(params.siteid) as SiteInfo;

  return new ImageResponse(
    (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            paddingLeft: '50px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundImage: 'linear-gradient(to bottom, #B4B4B4, #EEEEEE)',
            justifyContent: 'flex-end',
            backgroundColor: '#FFF',
            fontWeight: 800,
          }}
        >
          { site.logo ? <img
              alt="Logo"
              width={65}
              src={site.logo ?? ''}
            /> :
              <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M57.4372 32.5C57.4372 46.2726 46.2724 57.4374 32.4999 57.4374C18.7273 57.4374 7.5625 46.2726 7.5625 32.5C7.5625 18.7275 18.7273 7.56268 32.4999 7.56268C46.2724 7.56268 57.4372 18.7275 57.4372 32.5Z" fill="black" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M32.5 60.8973C48.1834 60.8973 60.8973 48.1834 60.8973 32.5C60.8973 16.8166 48.1834 4.10267 32.5 4.10267C16.8166 4.10267 4.10267 16.8166 4.10267 32.5C4.10267 48.1834 16.8166 60.8973 32.5 60.8973ZM32.5 65C50.4493 65 65 50.4493 65 32.5C65 14.5507 50.4493 0 32.5 0C14.5507 0 0 14.5507 0 32.5C0 50.4493 14.5507 65 32.5 65Z" fill="black" />
              </svg>
          }
          
          <div
            style={{
              fontSize: 60,
              lineHeight: 1.2,
              color: '#000',
            }}
          >
            {site.user?.projectName ?? ''}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1,
              color: '#000',
              marginBottom: '50px',
            }}
          >
            {site.subdomain + '.gitwallet.co' ?? ''}
          </div>
        </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  )

}