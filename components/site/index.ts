import TestComponent from "./test-component";
import BoldHeadline from "./bold-headline";
import AnotherComponent from "./another-component";
const componentsMap = {
    testcomponent: {
        name: 'Test Component',
        tag: 'TestComponent',
        element: TestComponent
    },
    boldheadline: {
        name: 'Bold Headline',
        tag: 'BoldHeadline',
        element: BoldHeadline
    },
    anothercomponent: {
        name: 'Another Component',
        tag: 'AnotherComponent',
        element: AnotherComponent
    }

} as any;

export default componentsMap;