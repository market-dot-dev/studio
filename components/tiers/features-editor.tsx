import { Flex, TextInput, Button, List, ListItem, Switch, Bold } from "@tremor/react";
import { IconButton } from "@radix-ui/themes";
import { useRef, useState } from "react";

import { FaEdit, FaCheck } from "react-icons/fa";

function EditableListItem({index, feature, setFeatures} : any) : JSX.Element {
    const [isEditing, setIsEditing] = useState(false);

    const inputRef = useRef<any>();

    const toggleEditing = () =>  {
        setIsEditing(!isEditing);
        if(!isEditing) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0)
        }
    };

    const handleChange = (e : any) => {
        setFeatures((features : any) => {
            const newFeatures = [...features];
            newFeatures[index] = {...newFeatures[index], content: e.target.value};
            return newFeatures;
        });
    }

    const toggleConnect = (index: number) => {
        setFeatures((features : any) => {
            const newFeatures = [...features];
            newFeatures[index] = {...newFeatures[index], disconnect: !newFeatures[index].disconnect};
            return newFeatures;
        });
    }

    return (
        <ListItem key={index} style={{
            ...(feature.disconnect ? {opacity: 0.3} : {})
            }}>
            {isEditing ? (
                <TextInput ref={inputRef as any} value={feature.content} onChange={handleChange} onBlur={toggleEditing} className="mr-4"/>
            ) : (
                <div onDoubleClick={toggleEditing} className="grow">{feature.content}</div>
            )}
            <div>
                <Flex className="gap-4">
                    <IconButton size="1" variant="ghost" onClick={toggleEditing}>
                        { isEditing ? <FaCheck height="14" width="14" /> : <FaEdit height="14" width="14" /> }
                    </IconButton>
                    <Switch checked={!feature.disconnect} onChange={() => toggleConnect(index)} />
                    
                </Flex>
            </div>
        </ListItem>
    )
}

export default function FeaturesEditor({features, setFeatures}: any) : JSX.Element {
    const [newFeature, setNewFeature] = useState('');

    const addFeature = () => {
        // if newFeature is empty, do nothing
        if(!newFeature) return;

		setFeatures([...features, {id: null, content: newFeature}]);
		
        setNewFeature('');
	}

    
    return (
        <>        
                <Flex flexDirection="col" alignItems="start" className="gap-1">
                    <Bold>Features</Bold>
                    <Flex className="gap-4">
                        <TextInput value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Enter feature text"/>
                        <Button onClick={addFeature}>Add</Button>
                    </Flex>
                </Flex>
                <div className="px-2 w-full">
                    <List>
                        { features.map((feature : any, index: number) => (
                            <EditableListItem key={index} index={index} feature={feature} setFeatures={setFeatures} />
                        ))}						
                    </List>
                </div>


        </>
    )

}