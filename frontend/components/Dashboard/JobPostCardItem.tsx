import { BriefcaseIcon, ExternalLinkIcon, LockIcon, MapPinIcon } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface JobPost {
  id: string;
  role: string;
  company: string;
  location: string;
  description?: string;
  matchScore: number;
  requirements?: string[];
  salary?: string;
  createdAt?: string;
  url?: string;
}

function JobPostCardItem({ item, isBlurred }: { item: JobPost, isBlurred: boolean }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
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
            <div className="text-xl md:text-3xl">{item.role}</div>
            <div className="flex items-center mt-1 text-muted-foreground text-sm">
              <BriefcaseIcon className="h-4 w-4 mr-1" />
              <span className="font-medium">{item.company}</span>
              <span className="mx-2">•</span>
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{item.location}</span>
            </div>
            <div className="text-md md:text-lg">
              {item?.salary}
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
              <div className={`text-2xl md:text-3xl font-bold ${getScoreColor(item.matchScore)}`}>
                {item.matchScore}%
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
                {truncateText(item.description || "", 100)}
            </div>
          <div className="flex flex-wrap gap-2">
            {item.requirements?.map((req, index) => (
              <Badge key={index} variant="secondary" className="text-sm md:text-md">
                {req}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-md cursor-pointer">
                <ExternalLinkIcon className="h-4 w-4" />
                Apply
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JobPostCardItem;
