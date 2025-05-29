import { HTMLElement, Node, NodeType, parse } from "node-html-parser";

/**
 * Adapter to make node-html-parser elements compatible with DOM Element interface
 * expected by the renderElement function
 */
export function createDOMCompatibleElement(element: HTMLElement): Element {
  // Create a proxy object to simulate DOM Element API
  const proxy = new Proxy(element, {
    get(target, prop) {
      // Handle special cases
      if (prop === "getAttributeNames") {
        return () => {
          // Return attribute names from the raw attributes object
          return Object.keys(target.attributes);
        };
      }

      if (prop === "getAttribute") {
        return (name: string) => {
          return target.getAttribute(name);
        };
      }

      if (prop === "tagName") {
        return target.tagName.toUpperCase(); // DOM API uses uppercase for tagName
      }

      if (prop === "nodeType") {
        // Map node-html-parser types to DOM nodeType values
        // 1 = Element, 3 = Text
        return target.nodeType === NodeType.ELEMENT_NODE
          ? 1
          : target.nodeType === NodeType.TEXT_NODE
            ? 3
            : 1;
      }

      if (prop === "childNodes") {
        // Map child nodes recursively
        const childNodes = target.childNodes.map((child) => {
          if (child.nodeType === NodeType.ELEMENT_NODE) {
            return createDOMCompatibleElement(child as HTMLElement);
          } else {
            // For text nodes, create a compatible version
            return createDOMCompatibleTextNode(child);
          }
        });
        return childNodes;
      }

      if (prop === "attributes") {
        // Create a proper DOM-like NamedNodeMap replacement
        interface AttrLike {
          name: string;
          value: string;
        }

        // Create an array of attribute-like objects
        const attrArray: AttrLike[] = Object.entries(target.attributes).map(([name, value]) => ({
          name,
          value: String(value)
        }));

        // Create an array-like object that mimics NamedNodeMap
        const namedNodeMapLike = Object.assign(Object.create(null), attrArray, {
          length: attrArray.length,
          item: (index: number) => (index < attrArray.length ? attrArray[index] : null),
          getNamedItem: (name: string) => {
            const attr = attrArray.find((a) => a.name === name);
            return attr || null;
          }
        });

        return namedNodeMapLike;
      }

      if (prop === "textContent") {
        return target.text;
      }

      // Default behavior for other properties
      return target[prop as keyof typeof target];
    }
  });

  return proxy as unknown as Element;
}

/**
 * Create a DOM-compatible text node from a node-html-parser Node
 */
function createDOMCompatibleTextNode(node: Node): Node {
  return new Proxy(node, {
    get(target, prop) {
      if (prop === "nodeType") {
        return 3; // Text node
      }

      if (prop === "textContent") {
        return target.text;
      }

      return target[prop as keyof typeof target];
    }
  });
}

/**
 * Parse HTML and return DOM-compatible elements
 */
export function parseHTML(html: string): Element[] {
  const root = parse(html);

  // Get all child elements and convert them to DOM-compatible elements
  return Array.from(root.childNodes)
    .filter((node) => node.nodeType === NodeType.ELEMENT_NODE)
    .map((node) => createDOMCompatibleElement(node as HTMLElement));
}
