'use client'
import { Grid, Col } from '@tremor/react';
import Tier from '../tier';
import { useEffect } from 'react';
import { TiersEmbedSettingsProps } from './tiers-embed-settings';
import SkeletonTiers from '../../skeleton-tiers';
const transparentBody = 'body {background: transparent}';
// This renders the actual component for both server and client sides.
export default function Tiers({tiers, subdomain, settings}: { tiers : any[], subdomain: string, settings: TiersEmbedSettingsProps}) : JSX.Element {
    
    useEffect(() => {
        function postHeight() {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ height: height }, '*'); // Adjust as needed for security
        }

        // Call the function to post height to parent
        postHeight();

    }, []); 
    
    return (
        <>
            <div className="flex flex-col space-y-6">
                <section>
                    <div className="mx-auto max-w-screen-xl lg:py-4">
                        { tiers.length ? 
                            <Grid numItems={1} numItemsSm={1} numItemsMd={2} numItemsLg={3} className="gap-4 sm:gap-8 md:gap-12">
                                {tiers.map((tier: any, index: number) => (
                                    <Col key={index} className="flex flex-col p-4 sm:p-5 md:p-6 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md">
                                        <Tier tier={tier} subdomain={subdomain} darkmode={settings.darkmode} />
                                    </Col>
                                ))}
                            </Grid> : 
                            <SkeletonTiers  />
                        }
                    </div>
                </section>
            </div>

            <style dangerouslySetInnerHTML={{__html: transparentBody}}></style>
        </>
    )
}