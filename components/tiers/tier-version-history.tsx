
import { Card, Flex, Text, TextInput, Button, Grid, Bold, Badge, Accordion, AccordionHeader, AccordionBody, AccordionList } from "@tremor/react";

import { CheckSquare2, Clock } from "lucide-react";

export default async function TierVersionHistory(params: any) {

    return (
            <Accordion>
                <AccordionHeader>
                    ${params.data[1].price}  (Created on Sept 30 2023)
                    <Badge className="ml-2">{params.data[1].customers} Active Customers</Badge>
                </AccordionHeader>
                <AccordionBody>
                    <Card className="p-3 my-4">
                        <Grid numItems={2} className="gap-2">
                            <div>
                                You currently have {params.data[1].customers} customers on this tier version. You can move all of them to the latest version of this tier.
                            </div>

                            <div className="text-right">
                                <Button size="xs" className="mr-2 p-1.5">
                                    <div className="text-xs">Upgrade to Latest Version</div>
                                </Button>
                                <Button size="xs" variant='secondary' className="p-1.5">
                                    <div className="text-xs">Manage</div>
                                </Button>
                            </div>


                        </Grid>
                    </Card>

                    <Grid numItems={2} className="gap-2">
                        <div className="py-2">
                            <Text className="font-bold mb-1">Features</Text>
                            {params.data[0].map((feature: any, index: any) => ( // Explicitly define the type of 'feature' and 'index' as 'any'
                                <div key={index}>
                                    <div className="p-0 flex gap-1 items-center text-xs"><CheckSquare2 width={16} /> {feature.title}</div>
                                </div>
                            ))}
                        </div>
                        <div className="py-2">
                            <Text className="font-bold mb-1">Price</Text>
                            <Text className="font-light">${params.data[1].price} /month</Text>

                            <div className="font-bold flex items-center text-sm gap-2 mt-4 mb-1">
                                <Clock width={16} /> History
                            </div>
                            <div className="font-light text-xs mb-2">
                                <ul>
                                    <li>• Updated on Oct 2 2023, 1:30pm UTC</li>
                                    <li>• Created on Sept 30 2023, 6:43pm UTC</li>
                                </ul>
                            </div>

                        </div>


                    </Grid>

                </AccordionBody>
            </Accordion>
    );


}