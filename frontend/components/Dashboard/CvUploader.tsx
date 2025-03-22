import { Card, CardContent } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";

interface StepUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function StepUpload({ onFileChange }: StepUploadProps) {
  return (
    <Card className="w-full border border-slate-500">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed border-slate-500">
            <label
              htmlFor="cv-upload"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2"
            >
              <UploadIcon className="h-10 w-10 text-foreground" />
              <span className="text-md font-medium text-foreground tracking-tight">
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
          <p className="text-sm text-foreground text-center max-w-md tracking-tight">
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