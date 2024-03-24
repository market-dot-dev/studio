"use client";

import { Service, Feature } from '@prisma/client';
import React, { ReactPropTypes, useCallback, useEffect, useState } from 'react';
import FeatureForm from '@/components/form/feature-form';
import { Badge, Button, Switch } from '@tremor/react';
import { update, create } from '@/app/services/feature-service';
import DrawerRight from '@/components/drawer-right';

import {
  Mail,
  MessageCircle,
  Phone,
  Ticket,
  Clock,
  LucideIcon,
  Pencil,
  Slack,
  Send,
  Gamepad2,
  X,
  AlarmClock,
  Volume2Icon,
  Users,
  ListTodo,
  Github,
  Milestone,
  Code,
  Wrench,
  Twitter,
  UserCircle,
  ListTodoIcon,
} from "lucide-react";
import { getCurrentUser } from '@/app/services/UserService';

type Category = {
  id: string;
  name: string;
  icon?: LucideIcon;
};

const categories: Category[] = [
  { id: 'chat', name: 'Chat', icon: MessageCircle },
  { id: 'voice', name: 'Live Support', icon: Phone },
  { id: 'email', name: 'Email Support', icon: Mail },
  { id: 'sla', name: 'SLA', icon: Clock },
  { id: 'staff', name: 'Dedicated Staff', icon: Users },
  { id: 'ticketing', name: 'Custom Ticketing', icon: Ticket },
  { id: 'ads', name: 'Promotions and Ads', icon: Volume2Icon},
  { id: 'custom', name: 'Custom Services', icon: Pencil}
];

type CategoryCardProps = {
  category: Category;
  selectedCategory: Category
  setSelectedCategory: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, selectedCategory, setSelectedCategory }) => {
  const isSelected = selectedCategory.id === category.id;

  const selectedStyles = isSelected ? 'border-gray-600' : 'text-gray-700 hover:bg-gray-100';

  return (
    <li
      key={category.id}
      className={`flex items-center p-2 cursor-pointer border-2 border-gray-300 rounded-md ${selectedStyles}`}
      onClick={() => setSelectedCategory(category)}
    >
      { category.icon ? <category.icon /> : null }
      <span className={`ml-2 ${isSelected ? 'font-bold' : 'font-normal'}`}>{category.name}</span>
    </li>
  );
};

export const Icon = ({ id }: { id: string }) => {
  const IconElement = {
    'email': Mail,
    'slack': Slack,
    'slackconnect': Slack,
    'discord': Gamepad2,
    'telegram': Send,
    'phone': Phone,
    'pair': Users,
    'walkthrough': Code,
    'oneone': Users,
    'sla': AlarmClock,
    'sla-24': AlarmClock,
    'sla-48': AlarmClock,
    'github-issues': Github,
    'other-ticketing': ListTodo,
    'zendesk': Ticket,
    'advertising': Volume2Icon,
    'advertising-github': Github,
    'advertising-social': Twitter,
    'custom': Pencil,
    'account-rep': UserCircle,
    'custom-integration': Wrench
  }[id] || X;

  return <IconElement className="inline-block" />
};

type ServiceCardProps = {
  service: Service;
  onUpdate: (service: Service) => void;
  selectedService?: Service | null;
  setSelectedService: (service: Service) => void;
  currentFeatureEnabled: boolean;
  isUpdating: boolean;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onUpdate, selectedService, setSelectedService, currentFeatureEnabled, isUpdating }) => {
  const isSelected = service.id === selectedService?.id;
  const selectedStyles = isSelected ? 'border-gray-600' : 'text-gray-700 hover:bg-gray-100';
  
  const [isEnabling, setIsEnabling] = useState(false);

  const handleToggle = () => {
    onUpdate({ ...service });
  };

  
  
  const handleClick = () => {
    setSelectedService(service);
  }

  return (
    <div className={`flex flex-col items-center justify-start mb-2 box-content p-4 border-2 ${currentFeatureEnabled ? `border-4 border-gray-800` : `border-gray-300`} rounded-md ${selectedStyles}`}>
      <div className="flex flex-col justify-between items-start grow gap-4">
        
        <div className="flex flex-col justify-start items-start gap-2">
          <div className="flex flex-row justify-between">
            <h4 className="font-semibold"><Icon id={service.id} /> &nbsp;{service.name}</h4>
          </div>
          <p className="text-sm text-gray-600">{service.description}</p>
        </div>
        
        {currentFeatureEnabled ? 
          <Button size="xs" variant="secondary" onClick={handleClick}>Configure</Button> 
          : 
          <Button size="xs" variant="primary" loading={isEnabling} disabled={isEnabling} onClick={handleClick}>Enable</Button>
        }
      </div>
      
    </div>
  );
};



const Offerings: React.FC<{ services: Service[]; features: Feature[] }> = ({ services, features }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [featuresList, setFeaturesList] = useState<Feature[]>(features);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleFeatureSuccess = (updatedFeature: Feature) => {
    setFeaturesList(prevFeatures => {
      const otherFeatures = prevFeatures.filter(f => f.id !== updatedFeature.id);
      return [...otherFeatures, updatedFeature];
    });
  };

  
  const currentFeature = featuresList.find((f) => f.serviceId === selectedService?.id);

  const enableFeature = async (currentFeature: Feature | undefined) => {
    
    let returnedFeature: Feature;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User is required to create or update a feature.");
    }
    const serviceId = selectedService?.id;

    const submissionData = Object.assign({}, { isEnabled: true }, { userId: currentUser.id, serviceId });
    setIsUpdating(true);
    try {
      if( currentFeature?.id ) {
        returnedFeature = await update(currentFeature.id, submissionData);
      } else {
        returnedFeature = await create(submissionData); 
      }

      handleFeatureSuccess(returnedFeature);

    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
    
  }

  useEffect(() => {
    if (selectedService) {
      const feature = featuresList.find((f) => f.serviceId === selectedService.id);
      if (!feature || !feature.isEnabled ) {
        enableFeature(feature).then(() => {
          setIsDrawerOpen(true);
        });
      } else {
        setIsDrawerOpen(true);
      }
    }
  
  }, [selectedService])

  
  const renderServices = (categoryId: string) => {
    return services.filter(service => service.category === categoryId).map(service => (
      <ServiceCard
        key={service.id}
        service={service} 
        onUpdate={() => {}} 
        isUpdating={isUpdating && service.id === selectedService?.id}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        currentFeatureEnabled={featuresList.find((f) => f.serviceId === service.id)?.isEnabled || false}
      />
    ));
  };

  return (
    <div className="flex flex-row gap-4 container mx-auto mt-6">
      <main className="flex-1">
        {categories.map(category => (
          <div key={category.id} className="mb-8">
            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {renderServices(category.id)}
            </div>
          </div>
        ))}
      </main>
      <aside className="w-1/4 sticky top-0" style={{ height: 'calc(100vh - 20px)', overflowY: 'auto' }}>
        <DrawerRight 
          isOpen={isDrawerOpen} 
          setIsOpen={(open) => {
            setIsDrawerOpen(open);
            setSelectedService(null);
          }} 
          title="Details">
            
          { selectedService &&
            <FeatureForm initialFeature={currentFeature} serviceId={selectedService.id} onSuccess={handleFeatureSuccess}/> 
          }
        </DrawerRight>
        
      </aside>
    </div>
  );
};

export default Offerings;