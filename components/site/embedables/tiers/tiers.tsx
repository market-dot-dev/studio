'use client'
import { Grid, Col } from '@tremor/react';
import Tier from '../tier';
import { useEffect } from 'react';
import { TiersEmbedSettingsProps } from './tiers-embed-settings';
import SkeletonTiers from '../../skeleton-tiers';
const transparentBody = 'body {background: transparent}';
// This renders the actual component for both server and client sides.
export default function Tiers({tiers, subdomain, settings}: { tiers : any[], subdomain: string, settings: TiersEmbedSettingsProps}) : JSX.Element {
    
    const cols = settings.cols ? settings.cols : 3;

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
                    <Grid numItems={cols} className="gap-12" >
                        {tiers.map((tier : any, index: number) => (
                            <Col key={index} className="flex flex-col p-6 mx-auto w-full max-w-xs ">
                                <Tier tier={tier} subdomain={subdomain} />
                            </Col>
                        ))}
                    </Grid> : 
                    <SkeletonTiers cols={cols} />
                    }
                </div>
                </section>
            </div>
            <style dangerouslySetInnerHTML={{__html: transparentBody}}></style>
        </>
    )
}