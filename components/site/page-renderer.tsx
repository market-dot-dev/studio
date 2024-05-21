import allComponents from '@/components/site/insertables';
import { deprecatedComponents } from '@/components/site/insertables';
const componentsMap = {
    ...allComponents,
    ...deprecatedComponents
} as any;

type DynamicComponentProps = {
    tag: keyof JSX.IntrinsicElements;
    className?: string;
    children?: React.ReactNode;
  };
  
  const ignoreElements = ["html", "head", "body", "script", "style", "title", "meta", "link", "noscript"];
  
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
  
  function sanitizeAttributeName(attrName: string) {
    // Define a regex pattern for invalid characters
    const invalidChars = /[^a-zA-Z0-9-_:.]/g;
    // Remove invalid characters
    const sanitized = attrName.replace(invalidChars, '');
    return sanitized;
  }

  const DynamicComponent: React.FC<DynamicComponentProps> = ({ tag, className, children, ...attributes }) => {
    const Tag = tag;
    return <Tag className={className} {...attributes}>{children}</Tag>;
  };
  
  // For recursively rendering elements
  const renderElement = (element: Element | Element[], index : number, site : any = null, page : any = null, isPreview : boolean = false): JSX.Element => {
    
    // in case there are multiple root elements, wrap them in a fragment
    if(Array.isArray(element)) {
      return (<>
        {element.map((child, index) => renderElement(child as Element, index, site, page, isPreview))}
      </>)
    } 
    
    if(!element?.tagName) return <></>;
    const tag = element.tagName.toLowerCase() as keyof JSX.IntrinsicElements;

    // ignore some elements
    if(ignoreElements.indexOf(tag) !== -1) return <></>;
    
    // Check if the element is a custom component
    
    if (tag in componentsMap) {
      const CustomComponent = isPreview && componentsMap[tag]['preview'] ? componentsMap[tag]['preview'] : componentsMap[tag]['element']

      // collect all props on elements
      let props = element.getAttributeNames().reduce((props : any, attr) => {
        // sanitize attr as html attributes can be anything
        const sanitizedAttr = sanitizeAttributeName(attr)
        
        const val = element.getAttribute(sanitizedAttr);
        
        if( val ) {
          if('class' === sanitizedAttr || 'classname' === sanitizedAttr.toLowerCase()) {
            props['className'] = val;
          } else {
            props[sanitizedAttr] = val;
          }
        }
        return props;
      }
    , {})
      // if it is not just a ui, pass site and page as props too
      if(! componentsMap[tag]['ui']) {
        props = {
          ...props, 
          ...( site? {site} : {}),
          ...( page? {page} : {})
        }
      }
      
      const children = Array.from(element.childNodes).map((child, index) => {
        if(child.nodeName.startsWith('#text')) return child.textContent
        return renderElement(child as Element, index, site, page, isPreview)
      });
      return <CustomComponent key={'component'+index} {...props}>{children}</CustomComponent>;
    }
    
    // const className = element.className;
    let className = element.getAttribute('class') + ' ' + element.getAttribute('classname');
    let attributes = {} as any;

    Array.from(element.attributes).forEach((item : any) => {
      
      if(item.name === 'style' || item.name === 'class') {
        return;
      }

      attributes[item.name] = item.value;
    });
    
    // Check if the element is a void element
    if (voidElements.indexOf(tag) !== -1) {
      return <DynamicComponent tag={tag} className={className} key={index} {...attributes} />;
    }
  
    if (element.children.length > 0) {
      return (
        <DynamicComponent tag={tag} className={className} key={index}  {...attributes}>
          { Array.from(element.childNodes).map((child, index) => child.nodeName.startsWith('#text') ? child.textContent : renderElement(child as Element, index as number, site, page, isPreview)) }
        </DynamicComponent>
      );
    } else {
      return <DynamicComponent tag={tag} className={className} key={index}  {...attributes}>{element.textContent}</DynamicComponent>;
    }
  };

  export default renderElement;