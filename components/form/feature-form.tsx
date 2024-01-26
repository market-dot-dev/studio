"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Select, Button, TextInput, SelectItem } from '@tremor/react';
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
  );
};

export default FeatureForm;