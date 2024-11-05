import { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pencil, Save, X } from "lucide-react";

interface Props {
  label: string;
  value: string;
  description?: string;
  onSave?: (value: string) => void;
}

export default function SettingsCard(props: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(props.value);

  const isEditable = !!props.onSave;

  const handleSave = () => {
    if (props.onSave) {
      props.onSave(value);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setValue(props.value);
    setIsEditing(false);
  };

  return (
    <Card className="w-full mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-medium leading-none">{props.label}</h3>
            {props.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {props.description}
              </p>
            )}
            {!isEditing ? (
              <p className="text-base mt-5">{value}</p>
            ) : (
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-5 w-full"
              />
            )}
          </div>
          {isEditable && !isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleCancel} size="sm">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
