import { Card, CardContent } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";

function StepRedirecting() {
  return (
    <Card className="w-full border border-slate-500">
      <CardContent className="py-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2Icon className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold tracking-tight">Finding Perfect Job Matches</h2>
          <p className="text-center text-foreground tracking-tight">
            We&apos;re searching for jobs that match your profile...
          </p>
          <p className="text-center text-foreground tracking-tight">
            This may take a few minutes...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default StepRedirecting;