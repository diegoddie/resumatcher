import { Eye, FileText } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { JobReportInfo } from "@/utils/supabase/types/types";
import Link from "next/link";

function JobReportCard({
  jobReport,
  matchCount,
}: {
  jobReport: JobReportInfo;
  matchCount: number;
}) {
  const MAX_SKILLS_TO_SHOW = 6;

  const visibleSkills = jobReport.skills.slice(0, MAX_SKILLS_TO_SHOW);
  const remainingSkillsCount = Math.max(
    0,
    jobReport.skills.length - MAX_SKILLS_TO_SHOW
  );
  const hasMoreSkills = remainingSkillsCount > 0;

  return (
    <Card className="border border-slate-500 shadow-xl">
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-full">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium tracking-tight">
                {jobReport.filename}
              </h3>
              <div className="flex flex-wrap items-center gap-1 md:gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                <span className="tracking-tight">{new Date(jobReport.created_at || '').toLocaleDateString()}</span>
                <span className="">•</span>
                <span className="tracking-tight">{jobReport.location}</span>
                <span className="">•</span>
                <span className="tracking-tight">{matchCount} matches found</span>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-gray-100 text-gray-700 dark:text-slate-300 dark:bg-slate-800 text-sm px-2 py-1 rounded">
              {jobReport.role}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-md tracking-tight text-gray-700 dark:text-slate-300">
            Key Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-slate-300 tracking-tight"
              >
                {skill}
              </span>
            ))}
            {hasMoreSkills && (
              <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-slate-300 tracking-tight">
                +{remainingSkillsCount} more
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 md:mt-0">
          <Link href={`/reports/${jobReport.id}`}>
            <Button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white w-full sm:w-auto cursor-pointer">
              <Eye className="h-4 w-4" />
              View Matches
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default JobReportCard;
