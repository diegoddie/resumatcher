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
    <Card className="w-full border border-slate-500">
      <CardContent className="pt-6">
        <div className="w-full space-y-4">
          <div className="flex items-center p-4 rounded-md border border-slate-500">
            <FileTextIcon className="h-8 w-8 mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-md font-medium truncate text-foreground tracking-tight">{file.name}</p>
              <p className="text-sm text-foreground tracking-tight">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onChangeFile} className="text-foreground tracking-tight">
              Change
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb] text-white tracking-tight text-md"
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