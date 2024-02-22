import { Grid, Col } from "@tremor/react";
export default function SkeletonTiers() : JSX.Element {
    const colsArray = [];

    for (let i = 0; i < 3; i++) {
        colsArray.push(<Col key={i} className="flex flex-col p-4 sm:p-5 md:p-6 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="bg-white w-full h-60 rounded-lg border border-gray-100 shadow"></div>
        </Col>);
    }

    return (
        <Grid numItems={1} numItemsSm={1} numItemsMd={2} numItemsLg={3} className="w-full gap-4 sm:gap-8 md:gap-12" >
            {colsArray}
        </Grid>
    )
}