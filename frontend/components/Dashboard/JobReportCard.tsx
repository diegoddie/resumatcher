import { BarChart3Icon, EyeIcon, MapPinIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { CalendarIcon } from "lucide-react";
import { FileTextIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

interface JobReport {
  id: string;
  date: string;
  role: string;
  fileName: string;
  jobCount: number;
  location: string;
  skills: string[];
}

function JobReportCard({ item }: { item: JobReport }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row items-start items justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg flex items-center">
                <FileTextIcon className="h-5 w-5 mr-2" />
                {item.fileName}
              </h3>
              <div className="flex items-center text-xs font-semibold md:font-normal md:text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {new Date(item.date).toLocaleDateString()}
                <span className="mx-2">•</span>
                <MapPinIcon className="h-4 w-4 mr-1" />
                {item.location}
                <span className="mx-2">•</span>
                <BarChart3Icon className="h-4 w-4 mr-1" />
                {item.jobCount} matches found
              </div>
            </div>
            <div className="flex items-center mt-4 md:mt-0 md:justify-end">
              <Badge variant="secondary" className="text-sm">
                {item.role}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="space-y-2">
          <div className="text-sm font-medium">Key Skills</div>
          <div className="flex flex-wrap gap-2">
            {item.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm rounded-xl"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end mt-6 md:mt-0">
          <Link href={`/reports/${item.id}`}>
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
