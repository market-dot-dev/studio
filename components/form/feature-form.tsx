import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextInput } from '@tremor/react';
import { TextArea } from "@radix-ui/themes";
import { Feature, Service } from '@prisma/client'; // Assuming Service stays as is, importing it if needed
import { update, create } from '@/app/services/feature-service';
import { getCurrentUser } from '@/app/services/UserService';
import { CheckSquare } from "lucide-react";


type Props = {
  service: Service;
  initialFeature?: Feature;
  onSuccess: (feature: Feature) => void;
  requiresUri?: boolean;
  hide: () => void;
};

type FeatureAttributes = Omit<Feature, 'id'> & { id?: string }; // Making `id` optional for new entries

const FeatureForm: React.FC<Props> = ({ service, initialFeature, onSuccess, requiresUri, hide }) => {
  const serviceId = service.id;
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FeatureAttributes>({
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
    setValue('name', initialFeature?.name ? initialFeature.name : !initialFeature?.isEnabled ? service.name : '');
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
      
      const submissionData = Object.assign({}, data, { userId: currentUser.id, serviceId});

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
  
  

  const enabledClick = () => {
    setValue('isEnabled', true);
    handleSubmit(onSubmit)();
  };

  const disableClick = () => {
    setValue('isEnabled', false);
    handleSubmit(onSubmit)();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 flex flex-col gap-4 items-start p-4">
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="name" className="text-sm text-gray-600 font-bold">Service Name</label>
        <div className="text-gray-600 text-xs">This is the name that appears on the features list for a Tier.</div>
        <TextInput placeholder=""
              {...register("name", { required: "Service name is required" })}
        />
        {errors.name ? <p className="text-red-500 text-xs">{errors.name.message}</p> : <></>}
      </div>
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="name" className="text-sm text-gray-600 font-bold">Relevant Link, Email, or Phone#</label>
          <TextInput placeholder=""
            {...register("uri", {
              required: requiresUri && "Relevant Link, Email, or Phone# is required for this service",
            })}
          />
        { (requiresUri && errors.uri) && <p className="text-red-500 text-xs">{errors.uri.message}</p> }
      </div>
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="description" className="text-sm text-gray-600 font-bold">Description</label>
        <TextArea placeholder="Detail fulfillment or workflow information" rows={3} {...register("description")} className="w-full" />
      </div>
      
      <input type="hidden" {...register("isEnabled")} />
      <div className="flex gap-4 items-center justify-between w-full">
      
        <div className="flex gap-4">
          <Button onClick={enabledClick} disabled={isSaving} loading={isSaving}>
            {initialFeature?.isEnabled ? 'Update' : 'Enable'}
          </Button>
          <Button variant="secondary" onClick={hide}>Close</Button>
        </div>
        { initialFeature?.isEnabled && <Button variant="secondary" color="red" size="xs" onClick={ disableClick } disabled={isSaving} loading={isSaving}>Disable</Button> }
      </div>
    </form>
  );
};

export default FeatureForm;