import { Card } from "@/components/ui/card";
import type { PageContent, SiteDetails } from "@/types/site";
import {
  Blockquote,
  Box,
  Code,
  Container,
  Em,
  Flex,
  Grid,
  Heading,
  Link,
  Quote,
  Text
} from "@radix-ui/themes";
import SiteDescription from "./site-description/site-description";
import SiteName from "./site-name/site-name";
import TiersClient from "./tiers/tiers-client";
import TiersInsert from "./tiers/tiers-insert";
import TiersServer from "./tiers/tiers-server";

import Section from "./section/section";

import ImageInsert from "./image/image-insert";

export type InsertableComponentProps = {
  site?: SiteDetails;
  page?: PageContent;
};

export type Insertable = {
  name: string;
  tag: string;
  description?: string;
  element: any;
  preview?: any;
  insert?: any; // component for inserting the element
  ui?: boolean;
  hidden?: boolean;
  attributes?: any;
};

export const siteComponents = {
  tiers: {
    name: "Tiers",
    tag: "Tiers",
    description: "Display tier panels",
    element: TiersServer,
    preview: TiersClient,
    insert: TiersInsert
  },
  sitename: {
    name: "Site Name",
    tag: "SiteName",
    description: "Display site name",
    element: SiteName
  } as Insertable,
  sitedescription: {
    name: "Site Description",
    tag: "SiteDescription",
    description: "Display site description",
    element: SiteDescription
  } as Insertable,

  image: {
    name: "Image",
    tag: "img",
    description: "Display image",
    insert: ImageInsert,
    ui: true
  } as Insertable
} as any;

export const standardComponents = {
  div: {
    name: "Div",
    tag: "div"
  },
  twFlex: {
    name: "Flex",
    tag: "div",
    attributes: {
      class: "flex flex-row gap-4"
    }
  },
  twFlexCol: {
    name: "Flex Col",
    tag: "div",
    attributes: {
      class: "flex flex-col gap-4"
    }
  },
  twGrid: {
    name: "Grid",
    tag: "div",
    attributes: {
      class: "grid grid-cols-3 gap-4"
    }
  },
  twContainer: {
    name: "Container",
    tag: "div",
    attributes: {
      class: "container mx-auto"
    }
  },
  twSection: {
    name: "Section",
    tag: "section"
  },
  twCard: {
    name: "Card",
    tag: "div",
    attributes: {
      class: "p-4"
    }
  }
};

export const layoutComponents = {
  flex: {
    name: "Flex",
    tag: "Flex",
    element: Flex,
    ui: true, // This is a UI component, not a site component, so props like site and pages are not available
    hidden: true
  },
  box: {
    name: "Box",
    tag: "Box",
    element: Box,
    ui: true,
    hidden: true
  },
  grid: {
    name: "Grid",
    tag: "Grid",
    element: Grid,
    ui: true,
    hidden: true
  },
  container: {
    name: "Container",
    tag: "Container",
    element: Container,
    ui: true, // This is a UI component, not a site component, so props like site and pages are not available
    hidden: true
  },
  section: {
    name: "Section",
    tag: "Section",
    element: Section,
    ui: true,
    hidden: true
  },
  card: {
    name: "Card",
    tag: "Card",
    element: Card,
    ui: true,
    hidden: true
  },
  image: {
    name: "Image",
    tag: "img",
    insert: ImageInsert,
    ui: true
  } as Insertable
} as any;

export const textComponents = {
  text: {
    name: "Text",
    tag: "Text",
    element: Text,
    ui: true
  } as Insertable,
  heading: {
    name: "Heading",
    tag: "Heading",
    element: Heading,
    ui: true
  } as Insertable,
  blockquote: {
    name: "Blockquote",
    tag: "Blockquote",
    element: Blockquote,
    ui: true
  } as Insertable,
  code: {
    name: "Code",
    tag: "Code",
    element: Code,
    ui: true
  } as Insertable,
  em: {
    name: "Em",
    tag: "Em",
    element: Em,
    ui: true
  } as Insertable,
  link: {
    name: "Link",
    tag: "Link",
    element: Link,
    ui: true
  } as Insertable,
  quote: {
    name: "Quote",
    tag: "Quote",
    element: Quote,
    ui: true
  } as Insertable
} as any;

export default {
  ...siteComponents
} as any;
