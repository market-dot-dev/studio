import { Grid, Col } from '@tremor/react';
import Tier from './tier';

function SkeletonTiers({cols} : {cols : number}) : JSX.Element {
    return (
        <>
            {Array.from(Array(cols).keys()).map((index) => (
                <Col key={index} className="flex flex-col p-6 mx-auto w-full max-w-xs ">
                    <div className="bg-white w-full h-60 rounded-lg border border-gray-100 shadow"></div>
                </Col>
            ))}
        </>
    )
}
// This renders the actual component for both server and client sides.
export default function Tiers({tiers}: { tiers : any[]}) : JSX.Element {
    return (
        <div className="flex flex-col space-y-6">
            <section>
            <div className="mx-auto max-w-screen-xl lg:py-4">
                <Grid numItems={3} className="gap-12" >
                {
                    tiers.length ? tiers.map((tier : any, index: number) => (
                        <Col key={index} className="flex flex-col p-6 mx-auto w-full max-w-xs ">
                            <Tier tier={tier} />
                        </Col>
                    )) : <SkeletonTiers cols={3} />
                }
                </Grid>
            </div>
            </section>
        </div>
    )
}