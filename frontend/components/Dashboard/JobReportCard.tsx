import { BarChart3Icon, EyeIcon, MapPinIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { CalendarIcon } from "lucide-react";
import { FileTextIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { JobReport } from "@/utils/supabase/types/types";

function JobReportCard({ 
  jobReport,
  matchCount,
 }: { jobReport: JobReport, matchCount: number }) {

  const MAX_SKILLS_TO_SHOW = 6;

  const visibleSkills = jobReport.skills.slice(0, MAX_SKILLS_TO_SHOW);
  const remainingSkillsCount = Math.max(0, jobReport.skills.length - MAX_SKILLS_TO_SHOW);
  const hasMoreSkills = remainingSkillsCount > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row items-start items justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg flex items-center">
                <FileTextIcon className="h-5 w-5 mr-2" />
                {jobReport.filename}
              </h3>
              <div className="flex items-center text-xs font-semibold md:font-normal md:text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {new Date(jobReport.created_at || '').toLocaleDateString()}
                <span className="mx-2">•</span>
                <MapPinIcon className="h-4 w-4 mr-1" />
                {jobReport.location}
                <span className="mx-2">•</span>
                <BarChart3Icon className="h-4 w-4 mr-1" />
                {matchCount} matches found
              </div>
            </div>
            <div className="flex items-center mt-4 md:mt-0 md:justify-end">
              <Badge variant="secondary" className="text-sm">
                {jobReport.role}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="space-y-2">
          <div className="text-sm font-medium">Key Skills</div>
          <div className="flex flex-wrap gap-2"> 
            {visibleSkills.map((skill, index) => ( 
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-sm rounded-xl" 
              > 
                {skill} 
              </Badge> 
            ))}
            
            {/* Badge per le skill rimanenti */}
            {hasMoreSkills && (
              <Badge 
                variant="outline" 
                className="text-sm rounded-xl" 
              >
                +{remainingSkillsCount} more
              </Badge>
            )}
          </div> 
        </div>
        <div className="flex items-center justify-end mt-6 md:mt-0">
          <Link href={`/reports/${jobReport.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-md cursor-pointer"
            >
              <EyeIcon className="h-5 w-5" />
              View Matches
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default JobReportCard;
