"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { CreditCardIcon, HistoryIcon, Loader2, UploadIcon } from "lucide-react";
import Link from "next/link";
import { getUserSubscription } from "@/utils/supabase/actions/userActions";

export default function DashboardPage() {
  const { user } = useUser();

  const {
    data: subscription,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return getUserSubscription({ id: user.id });
    },
    enabled: !!user?.id,
  });
  
  const totalCredits = 3;
  const isPro = subscription?.plan === "pro";
  const creditsLeft = subscription?.credits ?? 0;
  const creditsUsed = totalCredits - creditsLeft;
  const progressPercentage = (creditsUsed / totalCredits) * 100;

  const showCreditsLoading = isLoading || !user?.id;

  return (
    <div className="p-5 md:p-9">
      <div className="flex flex-col space-y-7 md:space-y-9">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-foreground text-md md:text-lg tracking-tight">
            Welcome back! Here&apos;s an overview of your job search progress.
          </p>
        </div>

        <div className="grid gap-5 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col border-slate-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl tracking-tight">
                <UploadIcon className="h-5 w-5" />
                Upload CV
              </CardTitle>
              <CardDescription className="tracking-tight text-md md:text-lg">
                Upload your CV to find matching job opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end mt-auto">
              <Link href="/upload">
                <Button className="w-full cursor-pointer tracking-tight text-white bg-[#3b82f6] hover:bg-[#2563eb] text-lg transition-colors duration-300">Get Started</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="flex flex-col border-slate-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl tracking-tight">
                <HistoryIcon className="h-5 w-5" />
                View History
              </CardTitle>
              <CardDescription className="tracking-tight text-md md:text-lg">
                Check your previous reports and job matches
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <Link href="/reports">
                <Button variant="outline" className="w-full cursor-pointer tracking-tight text-white bg-black dark:bg-white dark:text-black dark:hover:bg-slate-300 hover:bg-black hover:text-white text-lg transition-colors duration-300">
                  View Job Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="flex flex-col border-slate-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl tracking-tight">
                <CreditCardIcon className="h-5 w-5" />
                Credits
              </CardTitle>
              <CardDescription className="tracking-tight text-md md:text-lg">Check your credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showCreditsLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : isError ? (
                <div className="flex justify-center items-center">
                  <p className="text-red-500">Error loading credits</p>
                </div>
              ) : isPro ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">PRO 🚀</span>
                    <span className="text-sm text-muted-foreground">
                      Unlimited
                    </span>
                  </div>
                  <Link href="/account">
                    <Button className="w-full cursor-pointer" variant="outline">
                      Change Plan
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold tracking-tight">
                      {creditsUsed}/{totalCredits}
                    </span>
                    <span className="text-md text-foreground tracking-tight">
                      Credits used
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <Link href="/account">
                    <Button className="w-full cursor-pointer tracking-tight text-white bg-black dark:bg-white dark:text-black dark:hover:bg-slate-300 hover:bg-black hover:text-white text-lg transition-colors duration-300" variant="outline">
                      Upgrade Plan
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
