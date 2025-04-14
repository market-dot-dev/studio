"use client";

import FeatureForm from "@/components/form/feature-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Feature, Service } from "@prisma/client";
import React, { useEffect, useState } from "react";

import {
  AlarmClock,
  Brain,
  Bug,
  Clock,
  Code,
  Gamepad2,
  GitBranch,
  Github,
  ListTodo,
  LucideIcon,
  Mail,
  MessageCircle,
  Milestone,
  Pencil,
  Phone,
  Send,
  ShieldAlert,
  Slack,
  Ticket,
  Twitter,
  UserCircle,
  Users,
  Volume2Icon,
  Wrench,
  X
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon?: LucideIcon;
};

const categories: Category[] = [
  { id: "chat", name: "Chat Support", icon: MessageCircle },
  { id: "voice", name: "Live Support", icon: Phone },
  { id: "email", name: "Email Support", icon: Mail },
  { id: "sla", name: "Service Level Agreements (SLA)", icon: Clock },
  { id: "staff", name: "Dedicated Staff", icon: Users },
  { id: "ticketing", name: "Custom Ticketing", icon: Ticket },
  { id: "maintainence", name: "Open Source Project Maintainence", icon: GitBranch },
  { id: "ads", name: "Promotions and Ads", icon: Volume2Icon },
  { id: "custom", name: "Custom Services", icon: Pencil }
];

type CategoryCardProps = {
  category: Category;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  selectedCategory,
  setSelectedCategory
}) => {
  const isSelected = selectedCategory.id === category.id;

  const selectedStyles = isSelected ? "border-gray-600" : "text-gray-700 hover:bg-gray-100";

  return (
    <li
      key={category.id}
      className={`flex cursor-pointer items-center rounded-md border-2 border-gray-300 p-2 ${selectedStyles}`}
      onClick={() => setSelectedCategory(category)}
    >
      {category.icon ? <category.icon /> : null}
      <span className={`ml-2 ${isSelected ? "font-bold" : "font-normal"}`}>{category.name}</span>
    </li>
  );
};

const Icon = ({ id }: { id: string }) => {
  const IconElement =
    {
      email: Mail,
      slack: Slack,
      slackconnect: Slack,
      discord: Gamepad2,
      telegram: Send,
      phone: Phone,
      pair: Users,
      walkthrough: Code,
      oneone: Users,
      sla: AlarmClock,
      "sla-24": AlarmClock,
      "sla-48": AlarmClock,
      "github-issues": Github,
      "other-ticketing": ListTodo,
      zendesk: Ticket,
      advertising: Volume2Icon,
      "advertising-github": Github,
      "advertising-social": Twitter,
      custom: Pencil,
      "account-rep": UserCircle,
      expert: Brain,
      "custom-integration": Wrench,
      "priority-features": Milestone,
      "priority-bugs": Bug,
      "project-maintainence": GitBranch,
      "security-cve": ShieldAlert
    }[id] || X;

  return <IconElement className="inline-block" />;
};

type ServiceCardProps = {
  service: Service;
  onUpdate: (service: Service) => void;
  selectedService?: Service | null;
  setSelectedService: (service: Service) => void;
  currentFeatureEnabled: boolean;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onUpdate,
  selectedService,
  setSelectedService,
  currentFeatureEnabled
}) => {
  const isSelected = service.id === selectedService?.id;
  const selectedStyles = isSelected ? "border-gray-600" : "text-gray-700 hover:bg-gray-100";

  const handleToggle = () => {
    onUpdate({ ...service });
  };

  const handleClick = () => {
    setSelectedService(service);
  };

  return (
    <div
      className={`mb-2 box-content flex flex-col items-stretch justify-start rounded-md border border-gray-200 p-4 ${selectedStyles}`}
    >
      <div className="flex grow flex-col items-start justify-between gap-4">
        <div className="flex flex-col items-start justify-start gap-2">
          <div className="flex flex-row justify-between">
            <h4 className="font-semibold">
              <Icon id={service.id} /> &nbsp;{service.name}
            </h4>
          </div>
          <p className="text-sm text-gray-600">{service.description}</p>
        </div>

        {currentFeatureEnabled ? (
          <div className="flex w-full items-center justify-between">
            <Button size="sm" variant="secondary" onClick={handleClick}>
              Configure
            </Button>
            <Badge size="sm" variant="success">
              Enabled
            </Badge>
          </div>
        ) : (
          <Button size="sm" onClick={handleClick}>
            Enable
          </Button>
        )}
      </div>
    </div>
  );
};

const Offerings: React.FC<{ services: Service[]; features: Feature[] }> = ({
  services,
  features
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [featuresList, setFeaturesList] = useState<Feature[]>(features);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFeatureSuccess = (updatedFeature: Feature) => {
    setFeaturesList((prevFeatures) => {
      const otherFeatures = prevFeatures.filter((f) => f.id !== updatedFeature.id);
      return [...otherFeatures, updatedFeature];
    });
    setDialogOpen(false);
  };

  useEffect(() => {
    if (selectedService) {
      setDialogOpen(true);
    }
  }, [selectedService]);

  // Close dialog handler
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedService(null);
  };

  const renderServices = (categoryId: string) => {
    return services
      .filter((service) => service.category === categoryId)
      .map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onUpdate={() => {}}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          currentFeatureEnabled={
            featuresList.find((f) => f.serviceId === service.id)?.isEnabled || false
          }
        />
      ));
  };

  // Find the current feature if a service is selected
  const currentFeature = selectedService
    ? featuresList.find((f) => f.serviceId === selectedService.id)
    : null;

  return (
    <>
      <div className="container mx-auto mt-6 flex flex-row gap-4">
        <main className="flex-1">
          {categories.map((category) => (
            <div key={category.id} className="mb-8">
              <h3 className="mb-2 text-xl font-bold">{category.name}</h3>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {renderServices(category.id)}
              </div>
            </div>
          ))}
        </main>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent onInteractOutside={handleDialogClose} className="gap-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>Details</DialogTitle>
              {currentFeature?.isEnabled && (
                <Badge size="sm" variant="success" className="!font-semibold">
                  Enabled
                </Badge>
              )}
            </div>
          </DialogHeader>
          {selectedService && (
            <FeatureForm
              initialFeature={currentFeature || undefined}
              service={selectedService}
              onSuccess={handleFeatureSuccess}
              requiresUri={selectedService.requiresUri}
              hide={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Offerings;
