import { Grid, Col } from "@tremor/react";
export default function SkeletonTiers({cols} : {cols : number}) : JSX.Element {
    const colsArray = [];

    for (let i = 0; i < cols; i++) {
        colsArray.push(<Col key={i} className="flex flex-col p-6 mx-auto w-full max-w-xs ">
        <div className="bg-white w-full h-60 rounded-lg border border-gray-100 shadow"></div>
        </Col>);
    }

    return (
        <Grid numItems={cols} className="gap-12" >
            {colsArray}
        </Grid>
    )
}