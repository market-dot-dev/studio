import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput } from '@tremor/react';
import { Button } from '@/components/ui/button';
import { TextArea } from "@radix-ui/themes";
import { Feature, Service } from '@prisma/client'; // Assuming Service stays as is, importing it if needed
import { update, create } from '@/app/services/feature-service';
import { getCurrentUser } from '@/app/services/UserService';

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start gap-4 space-y-2 p-4"
    >
      <div className="flex w-full flex-col gap-2">
        <label htmlFor="name" className="text-sm font-bold text-gray-600">
          Service Name
        </label>
        <div className="text-xs text-gray-600">
          This is the name that appears on the features list for a Tier.
        </div>
        <TextInput
          placeholder=""
          {...register("name", { required: "Service name is required" })}
        />
        {errors.name ? (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        ) : (
          <></>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        <label htmlFor="name" className="text-sm font-bold text-gray-600">
          Relevant Link, Email, or Phone#
        </label>
        <TextInput
          placeholder=""
          {...register("uri", {
            required:
              requiresUri &&
              "Relevant Link, Email, or Phone# is required for this service",
          })}
        />
        {requiresUri && errors.uri && (
          <p className="text-xs text-red-500">{errors.uri.message}</p>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        <label
          htmlFor="description"
          className="text-sm font-bold text-gray-600"
        >
          Description
        </label>
        <TextArea
          placeholder="Detail fulfillment or workflow information"
          rows={3}
          {...register("description")}
          className="w-full"
        />
      </div>

      <input type="hidden" {...register("isEnabled")} />
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex gap-4">
          <Button
            loading={isSaving}
            loadingText={initialFeature?.isEnabled ? "Updating" : "Enabling"}
            onClick={enabledClick}
          >
            {initialFeature?.isEnabled ? "Update" : "Enable"}
          </Button>
          <Button variant="outline" onClick={hide}>
            Close
          </Button>
        </div>
        {initialFeature?.isEnabled && (
          <Button
            variant="destructive"
            loading={isSaving}
            loadingText="Disabling"
            onClick={disableClick}
          >
            Disable
          </Button>
        )}
      </div>
    </form>
  );
};

export default FeatureForm;