"use client";

import { Service, Feature } from '@prisma/client';
import React, { useCallback, useEffect, useState } from 'react';
import FeatureForm from '@/components/form/feature-form';
import { Switch } from '@tremor/react';

import {
  Mail,
  MessageCircle,
  Phone,
  Ticket,
  Clock,
  LucideIcon,
  Slack,
  Send,
  Gamepad2,
  X,
  AlarmClock,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon?: LucideIcon;
};

const categories: Category[] = [
  { id: 'email', name: 'Email', icon: Mail },
  { id: 'chat', name: 'Chat', icon: MessageCircle },
  { id: 'voice', name: 'Voice', icon: Phone },
  { id: 'ticketing', name: 'Ticketing', icon: Ticket },
  { id: 'sla', name: 'SLA', icon: Clock },
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

const Icon = ({ id }: { id: string }) => {
  const IconElement = {
    'email': Mail,
    'slack': Slack,
    'discord': Gamepad2,
    'telegram': Send,
    'phone': Phone,
    'sla': AlarmClock,
    'zendesk': Ticket,
  }[id] || X;

  return <IconElement className="inline-block" />
};

type ServiceCardProps = {
  service: Service;
  onUpdate: (service: Service) => void;
  selectedService?: Service | null;
  setSelectedService: (service: Service) => void;
  currentFeatureEnabled: boolean;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onUpdate, selectedService, setSelectedService, currentFeatureEnabled }) => {
  const isSelected = service.id === selectedService?.id;
  const selectedStyles = isSelected ? 'border-gray-600' : 'text-gray-700 hover:bg-gray-100';

  const handleToggle = () => {
    onUpdate({ ...service });
  };

  const handleClick = () => {
    setSelectedService(service);
  }

  return (
    <div className={`flex items-center justify-between mb-2 p-4 border-2 border-gray-300 rounded-md ${selectedStyles}`} onClick={handleClick}>
      <div className="flex items-center">
        <div className="ml-4">
          <div className="flex flex-row justify-between">
            <h4 className="font-semibold"><Icon id={service.id} /> &nbsp;{service.name}</h4>
            <Switch
              checked={currentFeatureEnabled}
              onChange={handleToggle}
              className={`${
                currentFeatureEnabled ? '' : 'bg-gray-200'
              } relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none`}
            >
              <span
                className={`${
                  currentFeatureEnabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
          </div>

          <p className="text-sm text-gray-600">{service.description}</p>
          
        </div>
      </div>
      
    </div>
  );
};

const Offerings: React.FC<{ services: Service[]; features: Feature[] }> = ({ services, features }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const filteredServices = services.filter((s) => s.category === selectedCategory.id);
  const [featuresList, setFeaturesList] = useState<Feature[]>(features); // Use a state for features
  const [selectedService, setSelectedService] = useState<Service>(filteredServices[0]);

  useEffect(() => {
    setSelectedService(filteredServices[0]);
  }, [selectedCategory]);

  const currentFeature = featuresList.find((f) => f.serviceId === selectedService.id);

  const handleFeatureSuccess = useCallback((updatedFeature: Feature) => {
    setFeaturesList((prevFeatures) => {
      const otherFeatures = prevFeatures.filter(f => f.id !== updatedFeature.id);
      return [...otherFeatures, updatedFeature];
    });
 }, []);


  return (
    <div className="flex flex-row gap-4 container mx-auto">
      <aside className="w-1/4">
        <div className="py-5 font-bold">
          Categories
        </div>
        <ul className="space-y-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          ))}
        </ul>
      </aside>
      <main className="w-1/2">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="py-5 font-bold">
            Options
          </div>
          <div className="border-t border-gray-200">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service} onUpdate={() => {}}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                currentFeatureEnabled={featuresList.find((f) => f.serviceId === service.id)?.isEnabled || false} />
            ))}
          </div>
        </div>
      </main>
      <aside className="w-1/4">
        <div className="py-5 font-bold">
          Details
        </div>
        { selectedService && 
          <FeatureForm initialFeature={currentFeature} serviceId={selectedService.id} onSuccess={handleFeatureSuccess}/> }
      </aside>
    </div>
  );
};

export default Offerings;