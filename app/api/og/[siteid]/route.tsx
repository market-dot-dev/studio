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
              backgroundColor: '#fff',
              height: '100%',
              width: '100%',
              textAlign: 'center',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              display: 'flex',
            }}
          >
            <img
              alt="Logo"
              width={255}
              height={225}
              src={site.logo ?? ''}
              style={{ margin: '0 75px' }}
            />
            <div
              style={{
                fontSize: 60,
                marginTop: 30,
                lineHeight: 1.8,
              }}
            >
              {site.user?.projectName ?? ''}
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 600,
        }
      )

}