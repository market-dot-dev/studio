"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextInput, Switch } from '@tremor/react';
import { TextArea } from "@radix-ui/themes";
import { Service, Feature } from '@prisma/client';
import { update, create } from '@/app/services/feature-service';
import { getCurrentUser } from '@/app/services/UserService';

type Props = {
  service: Service;
  initialFeature?: Feature;
};

type FeatureAttributes = Partial<Feature>;

const ToggleSwitch: React.FC<{
  isEnabled: boolean;
  handleToggle: () => void;
}> = ({ isEnabled, handleToggle }) => (
  <Switch
    checked={isEnabled}
    onChange={handleToggle}
    className={`${isEnabled ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none`}
  >
    <span
      className={`${isEnabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
    />
  </Switch>
);

const FeatureForm: React.FC<Props> = ({ service, initialFeature }) => {
  const { register, handleSubmit, setValue, watch } = useForm<FeatureAttributes>({
    defaultValues: initialFeature || {
      name: '',
      uri: '',
      description: '',
      serviceId: service.id,
      isEnabled: false,
    }
  });

  // Watches the isEnabled value for live updates
  const isEnabled = watch("isEnabled");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue('id', initialFeature?.id || '');
    setValue('name', initialFeature?.name || '');
    setValue('uri', initialFeature?.uri || '');
    setValue('description', initialFeature?.description || '');
    setValue('serviceId', service.id || '');
    setValue('isEnabled', initialFeature?.isEnabled || false);
  }, [initialFeature, setValue]);

  const onSubmit = async (data: FeatureAttributes) => {
    setIsSaving(true);
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      setIsSaving(false);
      throw new Error("User is required to create a feature.");
    }
    
    const submissionData = { ...data, userId: currentUser.id, serviceId: service.id };

    let returnedFeature;
    
    if (initialFeature?.id) {
      returnedFeature = await update(initialFeature.id, submissionData);
    } else {
      returnedFeature = await create(submissionData);
    }
    
    if (returnedFeature && returnedFeature.id) {
      window.location.href = `/features`;
    } else {
      setIsSaving(false);
      console.error('Failed to get the feature ID after operation.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <TextInput placeholder="Enter feature name" {...register("name")} />
      <TextInput placeholder="Enter link" {...register("uri")} />
      <TextArea placeholder="Enter description" rows={3} {...register("description")} />
      <ToggleSwitch isEnabled={isEnabled || false} handleToggle={() => setValue('isEnabled', !isEnabled)} />
      <Button type="submit" disabled={isSaving}>{ initialFeature?.id ? 'Update' : 'Save'}</Button>
    </form>
  );
};

export default FeatureForm;