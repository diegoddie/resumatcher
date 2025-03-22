import {
  BriefcaseIcon,
  ExternalLinkIcon,
  LockIcon,
  MapPinIcon,
} from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { JobPostInfo } from "@/utils/supabase/types/types";
import Link from "next/link";

function JobPostCardItem({
  jobPost,
  isBlurred,
  matchScore,
}: {
  jobPost: JobPostInfo;
  isBlurred: boolean;
  matchScore: number;
}) {
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
    <Card className="border border-slate-500">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="text-xl md:text-3xl tracking-tight break-words whitespace-normal">
              {truncateText(jobPost.role, 40)}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center mt-1 text-foreground text-sm md:text-md gap-y-1 md:gap-x-2">
              <div className="flex items-center gap-1">
                <BriefcaseIcon className="h-4 w-4" />
                <span className="font-medium tracking-tight text-sm">
                  {truncateText(jobPost.company, 18)}
                </span>
              </div>

              <span className="hidden md:inline">•</span>

              <div className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                <span className="tracking-tight font-medium text-sm">{jobPost.location}</span>
              </div>
            </div>

            <div className="text-md md:text-lg tracking-tight">
              {jobPost?.salary}
            </div>
          </div>
          <div className="text-right">
            {isBlurred ? (
              <>
                <div className="flex items-center gap-1 text-gray-400 blur-sm">
                  <LockIcon className="w-5 h-5" />
                  <span className="text-lg font-bold">%</span>
                </div>
                <div className="flex items-center gap-1">
                  <LockIcon className="w-4 h-4 text-foreground" />
                  <div className="text-xs text-foreground tracking-tight">
                    Pro
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`text-2xl md:text-3xl tracking-tight font-bold ${getScoreColor(
                    matchScore
                  )}`}
                >
                  {matchScore}%
                </div>
                <div className="text-xs text-foreground tracking-tight">
                  Match Score
                </div>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-foreground tracking-tight">
            {truncateText(jobPost.description || "", 100)}
          </div>
          <div className="flex flex-wrap gap-2">
            {jobPost.requirements?.map((req, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-slate-300 tracking-tight"
              >
                {req}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              {isBlurred ? (
                <Button
                  disabled
                  variant="outline"
                  size="sm"
                  className="text-md cursor-pointer tracking-tight bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-300 border-none"
                >
                  <LockIcon className="h-4 w-4" />
                  Pro
                </Button>
              ) : (
                <Link href={jobPost.url || ""} target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-md cursor-pointer tracking-tight bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors duration-300 border-none"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                    Apply
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JobPostCardItem;
