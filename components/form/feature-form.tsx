import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextInput, Switch } from '@tremor/react';
import { TextArea } from "@radix-ui/themes";
import { Feature } from '@prisma/client'; // Assuming Service stays as is, importing it if needed
import { update, create } from '@/app/services/feature-service';
import { getCurrentUser } from '@/app/services/UserService';

type Props = {
  serviceId: string;
  initialFeature?: Feature;
  onSuccess: (feature: Feature) => void;
};

type FeatureAttributes = Omit<Feature, 'id'> & { id?: string }; // Making `id` optional for new entries

const ToggleSwitch: React.FC<{
  isEnabled: boolean;
  handleToggle: () => void;
}> = ({ isEnabled, handleToggle }) => (
  <Switch
    checked={isEnabled}
    onChange={handleToggle}
    className={`${isEnabled ? '' : 'bg-gray-200'
      } relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none`}
  >
    <span
      className={`${isEnabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
    />
  </Switch>
);

const FeatureForm: React.FC<Props> = ({ serviceId, initialFeature, onSuccess }) => {
  const { register, handleSubmit, setValue, watch } = useForm<FeatureAttributes>({
    defaultValues: initialFeature || {
      name: '',
      uri: '',
      description: '',
      serviceId,
      isEnabled: false,
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue('id', initialFeature?.id || '');
    setValue('name', initialFeature?.name || '');
    setValue('uri', initialFeature?.uri || '');
    setValue('description', initialFeature?.description || '');
    setValue('serviceId', serviceId || '');
    setValue('isEnabled', initialFeature?.isEnabled || false);
  }, [initialFeature, setValue, serviceId]);

  const onSubmit = useCallback(async (data: FeatureAttributes) => {
    setIsSaving(true);

    try {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        throw new Error("User is required to create or update a feature.");
      }
      
      const submissionData = Object.assign({}, data, { userId: currentUser.id, serviceId });

      let returnedFeature: Feature;
      
      if (initialFeature?.id) {
        returnedFeature = await update(initialFeature.id, submissionData);
      } else {
        returnedFeature = await create(submissionData);
      }
      
      onSuccess(returnedFeature);
    } catch (error) {
      console.error('Error in feature submission: ', error);
    } finally {
      setIsSaving(false);
    }
  }, [initialFeature, serviceId, onSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <TextInput placeholder="Enter feature name" {...register("name")} />
      <TextInput placeholder="Enter link" {...register("uri")} />
      <TextArea placeholder="Enter description" rows={3} {...register("description")} />
      <ToggleSwitch isEnabled={watch("isEnabled")} handleToggle={() => setValue('isEnabled', !watch('isEnabled'))} />
      <Button type="submit" disabled={isSaving}>{ initialFeature?.id ? 'Update' : 'Save'}</Button>
    </form>
  );
};

export default FeatureForm;