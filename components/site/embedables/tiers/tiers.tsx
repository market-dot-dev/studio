'use client'
import { Grid, Col, Button } from '@tremor/react';
import { use, useEffect, useRef, useState } from 'react';
import { TiersEmbedSettingsProps } from './tiers-embed-settings';
import SkeletonTiers from '../../skeleton-tiers';
import TierCard from '@/components/tiers/tier-card';
import Link from 'next/link';

const transparentBody = 'body {background: transparent}';
// This renders the actual component for both server and client sides.
export default function Tiers({tiers, subdomain, settings, hasActiveFeatures}: { tiers : any[], subdomain: string, settings: TiersEmbedSettingsProps, hasActiveFeatures?: boolean}) : JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);
    const [alteredStyle, setAlteredStyle] = useState<any>({
        transformOrigin: 'top left',
    });
    const [containerHeight, setContainerHeight] = useState<number>(0);

    useEffect(() => {
        function postHeight() {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ height: height }, '*'); // Adjust as needed for security
        }

        // Call the function to post height to parent
        postHeight();

    }, []); 

    const handleResize = () => {
        if (containerRef.current) {
            // get width of container
            const width = containerRef.current.getBoundingClientRect().width;
            
            // window width
            const windowWidth = window.innerWidth;
            const scale = width / windowWidth;
            
            // set the scale
            if (scale < 1) {
                setAlteredStyle({
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                });
            } else {
                setAlteredStyle({
                    transform: 'none',
                });
            }

            setContainerHeight(containerRef.current.children[0].getBoundingClientRect().height);
        }
    };

    useEffect(() => {
        if(!containerRef.current) return;

        // Initial call
        handleResize();
        
        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [containerRef.current]);
    
    return (
      <>
        <div className="flex w-full flex-col space-y-6">
          <div ref={containerRef} style={{ height: containerHeight + "px" }}>
            {alteredStyle.scale !== null ? (
              <div className="mx-auto w-[100vw] lg:py-4" style={alteredStyle}>
                {tiers.length ? (
                  <Grid
                    numItems={1}
                    numItemsSm={1}
                    numItemsLg={3}
                    className="mx-auto w-full max-w-screen-2xl gap-6"
                  >
                    {tiers.map((tier: any, index: number) => (
                      <Col key={index} className="w-full max-w-lg lg:max-w-xs">
                        <TierCard
                          tier={tier}
                          url={subdomain}
                          darkMode={settings.darkmode}
                          hasActiveFeatures={hasActiveFeatures}
                        >
                          <Link href={`/checkout/${tier.id}`} target="_blank">
                            <Button variant="primary" className="w-full">
                              Get Started
                            </Button>
                          </Link>
                        </TierCard>
                      </Col>
                    ))}
                  </Grid>
                ) : (
                  <SkeletonTiers />
                )}
              </div>
            ) : null}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: transparentBody }}></style>
      </>
    );
}