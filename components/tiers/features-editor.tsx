import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
      <div
        key={index}
        style={{
          ...(feature.disconnect ? { opacity: 0.3 } : {}),
        }}
      >
        {isEditing ? (
          <Input
            ref={inputRef as any}
            value={feature.content}
            onChange={handleChange}
            onBlur={toggleEditing}
            className="mr-4"
          />
        ) : (
          <div onDoubleClick={toggleEditing} className="grow">
            {feature.content}
          </div>
        )}
        <div>
          <div className="flex gap-4">
            <Button size="icon" variant="ghost" onClick={toggleEditing}>
              {isEditing ? (
                <FaCheck height="14" width="14" />
              ) : (
                <FaEdit height="14" width="14" />
              )}
            </Button>
            <Switch
              checked={!feature.disconnect}
              onCheckedChange={() => toggleConnect(index)}
            />
          </div>
        </div>
      </div>
    );
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
            <div className="flex flex-col items-start gap-1">
                <Label>Features</Label>
                <div className="flex gap-4">
                    <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Enter feature text"/>
                    <Button onClick={addFeature}>Add</Button>
                </div>
            </div>
            <div className="flex flex-col px-2 w-full">
                  { features.map((feature : any, index: number) => (
                      <EditableListItem key={index} index={index} feature={feature} setFeatures={setFeatures} />
                  ))}						
            </div>
        </>
    )
}