import componentsMap from '@/components/site/insertables';

type DynamicComponentProps = {
    tag: keyof JSX.IntrinsicElements;
    className?: string;
    children?: React.ReactNode;
  };
  
  
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
  
  const DynamicComponent: React.FC<DynamicComponentProps> = ({ tag, className, children }) => {
    const Tag = tag;
    return <Tag className={className}>{children}</Tag>;
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
    
    // Check if the element is a custom component
    if (tag in componentsMap) {
      const CustomComponent = isPreview && componentsMap[tag]['preview'] ? componentsMap[tag]['preview'] : componentsMap[tag]['element']
      const props = {
        ...( site? {site} : {}),
        ...( page? {page} : {}),
      }
      return <CustomComponent key={'component'+index} {...props} />;
    }
  
    const className = element.className;
  
    // Check if the element is a void element
    if (voidElements.indexOf(tag) !== -1) {
      return <DynamicComponent tag={tag} className={className} key={index} />;
    }
  
    if (element.children.length > 0) {
      return (
        <DynamicComponent tag={tag} className={className} key={index}>
          {Array.from(element.children).map((child, index) => renderElement(child as Element, index as number, site, page, isPreview))}
        </DynamicComponent>
      );
    } else {
      return <DynamicComponent tag={tag} className={className} key={index}>{element.textContent}</DynamicComponent>;
    }
  };

  export default renderElement;