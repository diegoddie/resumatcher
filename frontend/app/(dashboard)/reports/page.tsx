import { HistoryIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JobReportCard from "@/components/Dashboard/JobReportCard";

const Reports = () => {
  const item = [
    {
        id: "1",
        date: "2024-03-20",
        fileName: "John_Doe_CV.pdf",
        role: "Software Engineer",
        jobCount: 8,
        skills: ["React", "TypeScript", "Node.js"], 
        location: "Milan",
    },
    {
        id: "2",
        date: "2024-08-22",
        fileName: "Resume2.pdf",
        role: "Backend Developer",
        jobCount: 10,
        skills: ["Python", "Fastapi", "Django"],
        location: "Brescia",
    }
  ]

  return (
    <div className="p-5 md:p-9">
      <div className="flex flex-col space-y-7 md:space-y-9">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Job Reports
          </h1>
          <p className="text-muted-foreground">
            View your job reports and analytics.
          </p>
        </div>
     
        <div className="grid gap-5 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HistoryIcon className="h-5 w-5" />
                Job Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">2</div>
              <p className="text-sm text-muted-foreground">
                Last upload 12/07/2025
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HistoryIcon className="h-5 w-5" />
                Total Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">20</div>
              <p className="text-sm text-muted-foreground">
                Across all CV uploads
              </p>
            </CardContent>
          </Card>
        </div>
        {item.map((item) => (
          <JobReportCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Reports;
