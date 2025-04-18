import allComponents, { deprecatedComponents } from "@/components/site/insertables";
import type { JSX, ReactNode } from "react";

// Create a proper type for the component map
type ComponentType = {
  element: React.ComponentType<any>;
  preview?: React.ComponentType<any>;
  ui?: boolean;
};

// Explicitly type the components map
const componentsMap: Record<string, ComponentType> = {
  ...allComponents,
  ...deprecatedComponents
};

type DynamicComponentProps = {
  tag: keyof JSX.IntrinsicElements;
  className?: string;
  children?: ReactNode;
  [key: string]: any; // For other attributes
};

const ignoreElements = [
  "html",
  "head",
  "body",
  "script",
  "style",
  "title",
  "meta",
  "link",
  "noscript"
];

const voidElements = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

function sanitizeAttributeName(attrName: string): string {
  // Convert kebab-case to camelCase (e.g., data-value to dataValue)
  const camelCased = attrName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  // Remove any remaining invalid characters (but keep the converted camelCase)
  const invalidChars = /[^a-zA-Z0-9_:.]/g;
  return camelCased.replace(invalidChars, "");
}

const DynamicComponent: React.FC<DynamicComponentProps> = ({
  tag,
  className,
  children,
  ...attributes
}) => {
  const Tag = tag as any; // Use 'as any' here to avoid JSX element type issues
  return (
    <Tag className={className} {...attributes}>
      {children}
    </Tag>
  );
};

// @TODO: These typings should be universal for all "maintainer-site" pages
// Define proper site and page types (replace with your actual types)
interface Site {
  user?: {
    projectDescription?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Page {
  [key: string]: any;
}

// For recursively rendering elements
const renderElement = (
  element: Element | Element[],
  index: number,
  site: Site | null = null,
  page: Page | null = null,
  isPreview: boolean = false,
  hasActiveFeatures?: boolean
): JSX.Element => {
  // in case there are multiple root elements, wrap them in a fragment
  if (Array.isArray(element)) {
    return (
      <>
        {element.map((child, childIndex) =>
          renderElement(child, childIndex, site, page, isPreview, hasActiveFeatures)
        )}
      </>
    );
  }

  if (!element?.tagName) return <></>;
  const tag = element.tagName.toLowerCase();

  // ignore some elements
  if (ignoreElements.includes(tag)) return <></>;

  // Check if the element is a custom component
  if (tag in componentsMap) {
    const CustomComponent =
      isPreview && componentsMap[tag].preview
        ? componentsMap[tag].preview
        : componentsMap[tag].element;

    // collect all props on elements
    const props: Record<string, any> = {};

    element.getAttributeNames().forEach((attr) => {
      // sanitize attr as html attributes can be anything
      const sanitizedAttr = sanitizeAttributeName(attr);
      const val = element.getAttribute(attr);

      if (val) {
        if (sanitizedAttr === "class" || sanitizedAttr.toLowerCase() === "classname") {
          props.className = val;
        } else {
          props[sanitizedAttr] = val;
        }
      }
    });

    // if it is not just a ui, pass site and page as props too
    if (!componentsMap[tag].ui) {
      if (site) props.site = site;
      if (page) props.page = page;
      if (hasActiveFeatures !== undefined) props.hasActiveFeatures = hasActiveFeatures;
    }

    const children = Array.from(element.childNodes).map((child, childIndex) => {
      // if the child is a text node, return the text content
      if (child.nodeType === 3) return child.textContent;
      return renderElement(child as Element, childIndex, site, page, isPreview, hasActiveFeatures);
    });

    return (
      <CustomComponent key={`component-${index}`} {...props}>
        {children}
      </CustomComponent>
    );
  }

  // Handle regular HTML elements
  const classAttribute = element.getAttribute("class") || "";
  const classNameAttribute = element.getAttribute("classname") || "";
  const className = `${classAttribute} ${classNameAttribute}`.trim();

  const attributes: Record<string, string> = {};

  Array.from(element.attributes).forEach((attr) => {
    if (attr.name === "style" || attr.name === "class" || attr.name === "classname") {
      return;
    }
    attributes[sanitizeAttributeName(attr.name)] = attr.value;
  });

  // Check if the element is a void element
  if (voidElements.includes(tag)) {
    return (
      <DynamicComponent
        tag={tag as keyof JSX.IntrinsicElements}
        className={className || undefined}
        key={index}
        {...attributes}
      />
    );
  }

  // Handle elements with children
  if (element.childNodes.length > 0) {
    return (
      <DynamicComponent
        tag={tag as keyof JSX.IntrinsicElements}
        className={className || undefined}
        key={index}
        {...attributes}
      >
        {Array.from(element.childNodes).map((child, childIndex) => {
          // if the child is a text node, return the text content
          if (child.nodeType === 3) {
            return child.textContent;
          }
          return renderElement(
            child as Element,
            childIndex,
            site,
            page,
            isPreview,
            hasActiveFeatures
          );
        })}
      </DynamicComponent>
    );
  }

  // Handle elements with just text content
  return (
    <DynamicComponent
      tag={tag as keyof JSX.IntrinsicElements}
      className={className || undefined}
      key={index}
      {...attributes}
    >
      {element.textContent}
    </DynamicComponent>
  );
};

export default renderElement;
