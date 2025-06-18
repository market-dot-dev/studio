"use client";

import { FileUploader } from "@/components/form/file-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AppWindowMac, Link } from "lucide-react";
import {
  ComponentPropsWithoutRef,
  createContext,
  FormHTMLAttributes,
  forwardRef,
  HTMLAttributes,
  useContext,
  useState
} from "react";
import { updateOrganization, type OrganizationFormResult } from "./organization-form-action";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "LU", name: "Luxembourg" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "NZ", name: "New Zealand" }
];

// Context to share form state and errors
interface OrganizationFormContextValue {
  errors?: Record<string, string>;
}

const OrganizationFormContext = createContext<OrganizationFormContextValue>({});

// Root form component
interface OrganizationFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "action"> {
  action?: (formData: FormData) => void | Promise<void>;
  errors?: Record<string, string>;
  onSuccess?: (result: OrganizationFormResult["data"]) => void | Promise<void>;
  onFormError?: (errors: Record<string, string>) => void | Promise<void>;
}

const OrganizationForm = forwardRef<HTMLFormElement, OrganizationFormProps>(
  (
    { className, action, errors: initialErrors, onSuccess, onFormError, children, ...props },
    ref
  ) => {
    const [errors, setErrors] = useState<Record<string, string>>(initialErrors || {});

    const formAction =
      action ||
      (async (formData: FormData) => {
        setErrors({});

        const result = await updateOrganization(formData);

        if (result.success && result.data) {
          if (onSuccess) {
            await onSuccess(result.data);
          }
        } else if (!result.success && result.errors) {
          setErrors(result.errors);
          if (onFormError) {
            await onFormError(result.errors);
          }
        }
      });

    return (
      <OrganizationFormContext.Provider value={{ errors }}>
        <form
          ref={ref}
          action={formAction}
          className={cn("flex flex-col gap-10", className)}
          {...props}
        >
          {errors._form && <p className="text-xs text-destructive">{errors._form}</p>}
          {children}
        </form>
      </OrganizationFormContext.Provider>
    );
  }
);
OrganizationForm.displayName = "OrganizationForm";

// Container for form fields
const OrganizationFormFields = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-6", className)} {...props} />
  )
);
OrganizationFormFields.displayName = "OrganizationFormFields";

// Organization name field
interface OrganizationNameFieldProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  required?: boolean;
}

const OrganizationNameField = forwardRef<HTMLDivElement, OrganizationNameFieldProps>(
  ({ className, defaultValue, required = true, ...props }, ref) => {
    const { errors } = useContext(OrganizationFormContext);
    const error = errors?.organizationName;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input
          id="organizationName"
          name="organizationName"
          placeholder="Your Organization Name"
          defaultValue={defaultValue}
          required={required}
          className={error ? "border-destructive" : ""}
          autoFocus
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
OrganizationNameField.displayName = "OrganizationNameField";

// Subdomain field
interface OrganizationSubdomainFieldProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  required?: boolean;
  showDescription?: boolean;
}

const OrganizationSubdomainField = forwardRef<HTMLDivElement, OrganizationSubdomainFieldProps>(
  ({ className, defaultValue, required = true, showDescription = true, ...props }, ref) => {
    const { errors } = useContext(OrganizationFormContext);
    const error = errors?.subdomain;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <Label htmlFor="subdomain">Domain</Label>
        <div className="flex items-center rounded bg-white shadow-border-sm">
          <Input
            id="subdomain"
            name="subdomain"
            placeholder="your-domain"
            defaultValue={defaultValue}
            className={cn("rounded-r-none border-0 shadow-none", error && "border-destructive")}
            required={required}
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers, and hyphens are allowed"
          />
          <span className="inline-flex h-9 items-center border-l border-stone-200 px-3 text-sm text-muted-foreground md:h-8">
            .market.dev
          </span>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {showDescription && (
          <p className="text-xs text-muted-foreground">
            Your dashboard,{" "}
            <span className="ml-px text-stone-700">
              <Link strokeWidth={2} className="inline size-3.5 shrink-0 -translate-y-0.5" />{" "}
              <span className="font-medium tracking-tight">Checkout Links</span>
            </span>{" "}
            &{" "}
            <span className="ml-px text-stone-700">
              <AppWindowMac strokeWidth={2} className="inline size-3.5 shrink-0 -translate-y-px" />{" "}
              <span className="font-medium tracking-tight">Landing Page</span>
            </span>{" "}
            will be available at this URL.
          </p>
        )}
      </div>
    );
  }
);
OrganizationSubdomainField.displayName = "OrganizationSubdomainField";

// Country field
interface OrganizationCountryFieldProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  required?: boolean;
}

const OrganizationCountryField = forwardRef<HTMLDivElement, OrganizationCountryFieldProps>(
  ({ className, defaultValue, required = true, ...props }, ref) => {
    const { errors } = useContext(OrganizationFormContext);
    const error = errors?.country;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <Label htmlFor="country">Country</Label>
        <Select name="country" defaultValue={defaultValue} required={required}>
          <SelectTrigger className={error ? "border-destructive" : ""}>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">Required for billing and tax purposes.</p>
      </div>
    );
  }
);
OrganizationCountryField.displayName = "OrganizationCountryField";

// Logo field
interface OrganizationLogoFieldProps extends HTMLAttributes<HTMLDivElement> {
  currentLogo?: string | null;
  uploaderClassName?: string;
}

const OrganizationLogoField = forwardRef<HTMLDivElement, OrganizationLogoFieldProps>(
  ({ currentLogo, uploaderClassName, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <Label htmlFor="logo">Logo</Label>
        <FileUploader
          fileUrl={currentLogo}
          accept="image/*"
          name="logo"
          className="sm:w-[120px] md:size-[110px]"
        />
      </div>
    );
  }
);
OrganizationLogoField.displayName = "OrganizationLogoField";

// Description field
interface OrganizationDescriptionFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  defaultValue?: string | null;
}

const OrganizationDescriptionField = forwardRef<HTMLDivElement, OrganizationDescriptionFieldProps>(
  ({ className, defaultValue, ...props }, ref) => {
    const { errors } = useContext(OrganizationFormContext);
    const error = errors?.description;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <Label htmlFor="description" className="mb-1">
          Organization Description
        </Label>
        <Textarea
          className={cn("min-h-40 relative", error && "border-destructive")}
          placeholder="Describe your organization"
          name="description"
          id="description"
          defaultValue={defaultValue ?? ""}
        />
        <p className="text-xs text-muted-foreground">
          Your organization description will be used in your{" "}
          <span className="ml-px text-stone-700">
            <AppWindowMac strokeWidth={2} className="inline size-3.5 shrink-0 -translate-y-px" />{" "}
            <span className="font-medium tracking-tight">Landing Page</span>
          </span>
          's homepage metadata and on any other page where you embed the{" "}
          <code className="rounded-sm border border-stone-300 bg-stone-150 px-0.5 py-px text-xxs font-medium">{`<SiteDescription>`}</code>
          .
        </p>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
OrganizationDescriptionField.displayName = "OrganizationDescriptionField";

// Layout helper for logo + name/subdomain fields
const OrganizationFormRow = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-6 sm:flex-row", className)} {...props} />
  )
);
OrganizationFormRow.displayName = "OrganizationFormRow";

// Layout helper for fields within a row
const OrganizationFormColumn = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-6", className)} {...props} />
  )
);
OrganizationFormColumn.displayName = "OrganizationFormColumn";

// Submit button
type OrganizationFormButtonProps = ComponentPropsWithoutRef<typeof SubmitButton>;

const OrganizationFormButton = forwardRef<HTMLButtonElement, OrganizationFormButtonProps>(
  ({ children = "Submit", ...props }, ref) => (
    <SubmitButton ref={ref} {...props}>
      {children}
    </SubmitButton>
  )
);
OrganizationFormButton.displayName = "OrganizationFormButton";

export {
  OrganizationCountryField,
  OrganizationDescriptionField,
  OrganizationForm,
  OrganizationFormButton,
  OrganizationFormColumn,
  OrganizationFormFields,
  OrganizationFormRow,
  OrganizationLogoField,
  OrganizationNameField,
  OrganizationSubdomainField
};
