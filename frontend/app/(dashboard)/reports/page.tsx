"use client";

import { HistoryIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JobReportCard from "@/components/Dashboard/JobReportCard";
import { useUser } from "@clerk/nextjs";
import {
  getJobPostCountForReport,
  getUserJobReports,
} from "@/utils/supabase/actions/userActions";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Reports = () => {
  const { user } = useUser();

  const {
    data: jobReports,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobReports", user?.id],
    queryFn: () => getUserJobReports({ id: user?.id || "" }),
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnMount: true,
  });

  const jobPostCountQueries = useQueries({
    queries: (jobReports || []).map((report) => ({
      queryKey: ["jobPostCount", report.id],
      queryFn: () => getJobPostCountForReport({ reportId: report.id }),
      enabled: !!jobReports,
    })),
  });

  const totalMatches = jobPostCountQueries.reduce(
    (acc, curr) => acc + (curr.data || 0),
    0
  );
  const isLoadingAll =
    isLoading || jobPostCountQueries.some((query) => query.isLoading);

  return (
    <div className="p-5 md:p-9">
      <div className="flex flex-col space-y-7 md:space-y-9">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Job Reports
          </h1>
          <p className="text-foreground text-md md:text-lg tracking-tight">
            View your job reports and analytics.
          </p>
        </div>

        <div className="grid gap-5 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col border-slate-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl tracking-tight">
                <HistoryIcon className="h-5 w-5" />
                Job Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAll ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-4xl font-bold tracking-tight">
                    {jobReports?.length || 0}
                  </div>
                  <p className="text-sm text-foreground tracking-tight">
                    {jobReports && jobReports.length > 0
                      ? `Last upload ${new Date(
                          jobReports[0].created_at || ""
                        ).toLocaleDateString()}`
                      : "No reports yet"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="flex flex-col border-slate-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl tracking-tight">
                <HistoryIcon className="h-5 w-5" />
                Total Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAll ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-4xl font-bold tracking-tight">{totalMatches}</div>
                  <p className="text-sm text-foreground tracking-tight">
                    Across all CV uploads
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        {isLoadingAll ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center">
            <p className="text-red-500">Error loading reports</p>
          </div>
        ) : jobReports && jobReports.length > 0 ? (
          jobReports?.map((jobReport, index) => (
            <JobReportCard
              key={jobReport.id}
              jobReport={jobReport}
              matchCount={jobPostCountQueries[index]?.data || 0}
            />
          ))
        ) : (
          <div className="flex items-center justify-center flex-col gap-4">
            <p className="text-foreground tracking-tight">No reports yet</p>
            <Link href="/upload">
              <Button size="lg" className="cursor-pointer tracking-tight text-white bg-[#3b82f6] hover:bg-[#2563eb] text-lg transition-colors duration-300">Start here</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
