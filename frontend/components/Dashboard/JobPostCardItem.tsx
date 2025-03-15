import { BriefcaseIcon, ExternalLinkIcon, LockIcon, MapPinIcon } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { JobPost } from "@/utils/supabase/types/types";
import Link from "next/link";

function JobPostCardItem({ jobPost, isBlurred, matchScore }: { jobPost: JobPost, isBlurred: boolean, matchScore: number }) {
  const getScoreColor = (matchScore: number) => {
    if (matchScore >= 90) return "text-green-500";
    if (matchScore >= 75) return "text-emerald-500";
    if (matchScore >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="text-xl md:text-3xl">{jobPost.role}</div>
            <div className="flex items-center mt-1 text-muted-foreground text-sm">
              <BriefcaseIcon className="h-4 w-4 mr-1" />
              <span className="font-medium">{jobPost.company}</span>
              <span className="mx-2">•</span>
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{jobPost.location}</span>
            </div>
            <div className="text-md md:text-lg">
              {jobPost?.salary}
            </div>
          </div>
          <div className="text-right">
            {isBlurred ? (
                <>
              <div className="flex items-center gap-1 text-gray-400 blur-sm">
                <LockIcon className="w-5 h-5" />
                <span className="text-lg font-bold">??%</span>
              </div>
              <div className="flex items-center gap-1">
                <LockIcon className="w-4 h-4 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">Pro</div>
              </div>
              </>
            ) : (
              <>
              <div className={`text-2xl md:text-3xl font-bold ${getScoreColor(matchScore)}`}>
                {matchScore}%
              </div>
              <div className="text-xs text-muted-foreground">Match Score</div>
              </>
            )}
            
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
                {truncateText(jobPost.description || "", 100)}
            </div>
          <div className="flex flex-wrap gap-2">
            {jobPost.requirements?.map((req, index) => (
              <Badge key={index} variant="secondary" className="text-sm md:text-md">
                {req}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <Link href={jobPost.url || ""} target="_blank">
                <Button variant="outline" size="sm" className="text-md cursor-pointer">
                  <ExternalLinkIcon className="h-4 w-4" />
                  Apply
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JobPostCardItem;
