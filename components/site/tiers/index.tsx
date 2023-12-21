import { getTiersForUser } from "@/lib/tiers/fetchers"
import { Grid, Col } from '@tremor/react';
import Tier from "./tier";

// This component will be used to render the preview while editing the page
export function TiersPreview({site, page, ...props}: { site : any, page : any, props : any}) {
    return (
        <div>Tiers Preview for client side</div>
    )
}

// This is the component that will render at the frontend of the site, facing the customer
export async function Tiers({site, page, ...props}: { site : any, page : any, props : any}) {
    const tiers = site?.userId ? await getTiersForUser(site.userId) : [];
    
    return (
        <div className="flex flex-col space-y-6">
            <section>
            <div className="mx-auto max-w-screen-xl lg:py-4">
                <Grid numItems={3} className="gap-12" >
                {tiers.map((tier : any, index) => (
                    <Col key={index} className="flex flex-col p-6 mx-auto w-full max-w-xs ">
                        <Tier tier={tier} />
                    </Col>
                ))}
                </Grid>
            </div>
            </section>
        </div>
    )
}