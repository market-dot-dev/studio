import allComponents from "@/components/site/insertables";
import type { PageContent, SiteDetails } from "@/types/site";
import { ComponentType } from "@/types/site";
import type { JSX, ReactNode } from "react";

// Explicitly type the components map
const componentsMap: Record<string, ComponentType> = {
  ...allComponents
};

type DynamicComponentProps = {
  tag: keyof JSX.IntrinsicElements;
  className?: string;
  children?: ReactNode;
  [key: string]: any; // For other attributes
};

// Elements that should be ignored during rendering
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

// HTML void elements that should not have closing tags
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

/**
 * Sanitizes HTML attribute names to valid React props
 * Converts kebab-case to camelCase and removes invalid characters
 */
function sanitizeAttributeName(attrName: string): string {
  // Convert kebab-case to camelCase (e.g., data-value to dataValue)
  const camelCased = attrName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  // Remove any remaining invalid characters (but keep the converted camelCase)
  const invalidChars = /[^a-zA-Z0-9_:.]/g;
  return camelCased.replace(invalidChars, "");
}

/**
 * Dynamic component for rendering arbitrary HTML elements
 */
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

/**
 * Renders DOM elements as React components
 *
 * @param element - DOM element(s) to render
 * @param index - Current element index for key generation
 * @param site - Site data context
 * @param page - Page data context
 * @param isPreview - Whether rendering in preview mode
 * @returns JSX representing the rendered element(s)
 */
const renderElement = (
  element: Element | Element[],
  index: number,
  site: SiteDetails | null = null,
  page: PageContent | null = null,
  isPreview: boolean = false
): JSX.Element => {
  // In case there are multiple root elements, wrap them in a fragment
  if (Array.isArray(element)) {
    return (
      <>
        {element.map((child, childIndex) =>
          renderElement(child, childIndex, site, page, isPreview)
        )}
      </>
    );
  }

  if (!element?.tagName) return <></>;
  const tag = element.tagName.toLowerCase();

  // Ignore certain elements
  if (ignoreElements.includes(tag)) return <></>;

  // Check if the element is a custom component
  if (tag in componentsMap) {
    const CustomComponent =
      isPreview && componentsMap[tag].preview
        ? componentsMap[tag].preview
        : componentsMap[tag].element;

    // Collect all props on elements
    const props: Record<string, any> = {};

    element.getAttributeNames().forEach((attr) => {
      // Sanitize attr as html attributes can be anything
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

    // If it is not just a UI component, pass site and page as props too
    if (!componentsMap[tag].ui) {
      if (site) props.site = site;
      if (page) props.page = page;
    }

    const children = Array.from(element.childNodes).map((child, childIndex) => {
      // If the child is a text node, return the text content
      if (child.nodeType === 3) return child.textContent;
      return renderElement(child as Element, childIndex, site, page, isPreview);
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
          // If the child is a text node, return the text content
          if (child.nodeType === 3) {
            return child.textContent;
          }
          return renderElement(child as Element, childIndex, site, page, isPreview);
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
