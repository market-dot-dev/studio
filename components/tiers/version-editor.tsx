import { Flex, Card, TextInput, Button, List, ListItem, Title, Subtitle, Bold } from "@tremor/react";
import { IconButton, Checkbox } from "@radix-ui/themes";
import { useState } from "react";
// import { Cross2Icon } from "@radix-ui/react-icons";
// edit icon and delete icon from react-icons

import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";

function EditableListItem({index, feature, removeFeature, setFeatures} : any) : JSX.Element {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEditing = () => setIsEditing(!isEditing);

    const handleChange = (e : any) => {
        setFeatures((features : any) => {
            const newFeatures = [...features];
            newFeatures[index] = {...newFeatures[index], content: e.target.value};
            return newFeatures;
        });
    }

    return (
        <ListItem key={index}>
            {isEditing ? (
                <TextInput value={feature.content} onChange={handleChange} onBlur={toggleEditing}/>
            ) : (
                <div>{feature.content}</div>
            )}
            <div>
                <Flex className="gap-4">
                    <IconButton size="1" variant="ghost" onClick={toggleEditing}>
                        { isEditing ? <FaCheck height="14" width="14" /> : <FaEdit height="14" width="14" /> }
                    </IconButton>
                    <IconButton size="1" variant="ghost" onClick={() => removeFeature(index)}>
                        <FaTrash height="14" width="14" />
                    </IconButton>
                </Flex>
            </div>
        </ListItem>
    )
}

export default function VersionEditor({features, setFeatures}: any) : JSX.Element {
    const [newFeature, setNewFeature] = useState('');

    const addFeature = () => {
		setFeatures([...features, {id: null, content: newFeature}]);
		setNewFeature('');
	}

	const removeFeature = (index: number) => {
		// setFeatures(features.filter((feature: any, i: number) => i !== index));
        setFeatures((features : any) => {
            const newFeatures = [...features];
            newFeatures[index] = [...newFeatures[index], {deleted: true}];
            return newFeatures;
        });
	}
    
    return (
        <Card>
            <Flex flexDirection="col" alignItems="start" className="gap-4">
                <Title>Current Version</Title>
                
                <Flex flexDirection="col" alignItems="start" className="gap-1">
                    <Bold>Price</Bold>
                    <TextInput value="99.99" placeholder="Enter price"/>
                </Flex>
                
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
                            <EditableListItem key={index} index={index} feature={feature} removeFeature={removeFeature} setFeatures={setFeatures} />
                        ))}						
                    </List>
                </div>
            </Flex>

        </Card>
    )

}