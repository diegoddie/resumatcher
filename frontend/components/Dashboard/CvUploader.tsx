import { Card, CardContent } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";

interface StepUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function StepUpload({ onFileChange }: StepUploadProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed border-input bg-muted/50">
            <label
              htmlFor="cv-upload"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2"
            >
              <UploadIcon className="h-10 w-10 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Click to upload your CV (PDF, DOCX)
              </span>
              <input
                id="cv-upload"
                type="file"
                accept=".pdf, .docx"
                className="hidden"
                onChange={onFileChange}
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Upload your CV in PDF or DOCX format. We&apos;ll analyze it to
            extract your skills and experience, then find jobs that match
            your profile.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default StepUpload;