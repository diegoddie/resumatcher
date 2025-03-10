import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FileTextIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepFileSelectedProps {
  file: File;
  isUploading: boolean;
  onUpload: () => void;
  onChangeFile: () => void;
}

function StepFileSelected({ 
  file, 
  isUploading, 
  onUpload, 
  onChangeFile 
}: StepFileSelectedProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="w-full space-y-4">
          <div className="flex items-center p-4 rounded-md border bg-muted/30">
            <FileTextIcon className="h-8 w-8 mr-3 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onChangeFile}>
              Change
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full cursor-pointer"
          onClick={onUpload}
          disabled={isUploading}
        >
          {isUploading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? "Uploading and Analyzing..." : "Upload and Analyze"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default StepFileSelected;