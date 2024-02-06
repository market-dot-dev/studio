"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Bold, Text, Grid, Col, Card, Select, Button, TextInput, SelectItem } from '@tremor/react';
import { TextArea } from "@radix-ui/themes"; // Corrected import for TextArea based on Radix UI
import { Service, Feature } from '@prisma/client';
import { update, create } from '@/app/services/feature-service';
import { getCurrentUser } from '@/app/services/UserService';

type Props = {
  service: Service[];
  initialFeature?: Feature;
};

type FeatureAttributes = Partial<Feature>;

const FeatureForm: React.FC<Props> = ({ service, initialFeature }) => {
  const { register, handleSubmit, setValue, watch } = useForm<FeatureAttributes>({
    defaultValues: {
      name: initialFeature?.name || '',
      uri: initialFeature?.uri || '',
      description: initialFeature?.description || '',
      serviceId: initialFeature?.serviceId || '',
    },
  });

  // This will watch the serviceId field for changes
  // Necessary if you're interacting with the serviceId outside of the standard form flow
  const serviceId = watch("serviceId");

  const onSubmit = async (data: FeatureAttributes) => {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      throw new Error("User is required to create a feature.");
    }
    
    // Include serviceId in submission data, as it could be set outside the standard form flow
    const submissionData = { ...data, serviceId, userId: currentUser.id };
    
    let returnedFeature;
    
    if (initialFeature?.id) {
      returnedFeature = await update(initialFeature.id, submissionData);
    } else {
      returnedFeature = await create(submissionData);
    }
    
    if (returnedFeature && returnedFeature.id) {
      window.location.href = `/services/${returnedFeature.id}`;
    } else {
      console.error('Failed to get the feature ID after operation.');
    }
  };

  useEffect(() => {
    if (initialFeature?.serviceId) {
      setValue('serviceId', initialFeature.serviceId);
    }
  }, [initialFeature, setValue]);

  return (

    <>

                <Grid numItems={5} className="gap-2 mb-4">


                    {/* 
                    NOTHING SELECTED
                    <Col numColSpan={2}>
                        <div className="text-lg font-bold mb-2">Details</div>

                        <div className="flex flex-col bg-gray-50 h-full pt-24 text-center h-full rounded-xl">
                            Please select a fulfillment option to view details.
                        </div>
                    </Col>
                    */}

                    
                    {/* COLUMN 1: SERVICE OFFERING CATEGORIES */}
                    <Col numColSpan={1}>
                        <div className="text-lg font-bold mb-2">Categories</div>

                        <div className="flex flex-col pt-1">
                            {service.map((s) => (
                                // <Card className={feature.selected ? "border-2 border-slate-800 p-2 mb-2" : "p-2 mb-2"} key={s.index}>
                                <Card className={s.selected ? "border-2 border-slate-800 p-2 mb-2" : "p-2 mb-2"} key={s.index}>
                                    <div className="flex flex-row justify-items-center text-center gap-2">
                                        {/* {feature.icon} */}
                                        <Bold>{s.name}</Bold>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Col>

{/* 
                    <Col numColSpan={2}>
                        <div className="text-lg font-bold mb-2">Options</div>
                        <div className="flex flex-col h-4/5">
                            {directContactDetails && (
                                <div className="flex flex-col overflow-auto px-1 pt-1">
                                    {directContactDetails.map((subcategory, subIndex) => (
                                        <Card className={subcategory.checked ? "border-2 border-slate-800 p-2 mb-2" : "p-2 mb-2"} key={subIndex}>
                                            <div className="flex flex-row items-center justify-between gap-2">
                                                {subcategory.icon}
                                                <Bold>{subcategory.title}</Bold>
                                                <div className="ml-auto">
                                                    <Switch defaultChecked={subcategory.checked} />
                                                </div>
                                            </div>
                                            <div className="text-sm">{subcategory.description}</div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>

                    <Col numColSpan={2}>
                        <div className="text-lg font-bold mb-2">Details</div>

                        <div className="flex flex-col px-1">
                            <label className="text-sm font-light">URL</label>
                            <TextInput className="mb-4" placeholder="Enter your Discord server URL" />
                            <label className="text-sm font-light">Details</label>
                            <Textarea placeholder="Enter details about your Discord." />
                        </div>
                    </Col> */}
                </Grid>
    
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Manually manage Select state */}
      <Select 
        defaultValue={initialFeature?.serviceId || ""} 
        onValueChange={(value) => setValue('serviceId', value) } // Directly update the form state
      >
        <SelectItem value="">Select a service</SelectItem>
        {service.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.name}
          </SelectItem>
        ))}
      </Select>
      <TextInput
        placeholder="Enter feature name"
        {...register("name")}
      />
      <TextInput
        placeholder="Enter URI"
        {...register("uri")}
      />
      <TextArea
        placeholder="Enter description"
        rows={3}
        {...register("description")}
      />
      <Button type="submit">Save</Button>
    </form>

    </>
  );
};

export default FeatureForm;