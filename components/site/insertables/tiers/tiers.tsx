import { Grid, Col } from '@tremor/react';
import Tier from './tier';

// This renders the actual component for both server and client sides.
export default function Tiers({tiers}: { tiers : any[]}) : JSX.Element {
    return (
        <div className="flex flex-col space-y-6">
            <section>
            <div className="mx-auto max-w-screen-xl lg:py-4">
                <Grid numItems={3} className="gap-12" >
                {tiers.map((tier : any, index: number) => (
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