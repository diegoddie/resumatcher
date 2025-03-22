'use client'

import JobPostCardItem from "@/components/Dashboard/JobPostCardItem";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getJobPostsForReport, getMatchScoreForJobPost, getUserSubscription } from "@/utils/supabase/actions/userActions";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const JobPost = () => {
    const params = useParams();
    const { user } = useUser();

    const reportId = Array.isArray(params.id) ? params.id[0] : params.id || "";

    // Otteniamo l'abbonamento dell'utente per verificare se è pro
    const { data: subscription } = useQuery({
        queryKey: ["subscription", user?.id],
        queryFn: () => getUserSubscription({ id: user?.id || "" }),
        enabled: !!user?.id,
    });

    const isPro = subscription?.plan === "pro";

    const { data: jobPosts, isLoading, isError } = useQuery({
        queryKey: ["jobPosts", reportId],
        queryFn: () => getJobPostsForReport({ reportId }),
        enabled: !!reportId,
    });

    const matchScoreQueries = useQueries({
        queries: jobPosts?.map((jobPost) => ({
            queryKey: ["matchScore", jobPost.id, reportId],
            queryFn: () => getMatchScoreForJobPost({
                jobPostId: jobPost.id,
                jobReportId: reportId,
                userId: user?.id || ""
            }),
            enabled: !!jobPost.id && !!reportId && !!user?.id,
        })) || [],
    });

    // Verifica se tutte le query match score sono ancora in caricamento
    const isLoadingScores = matchScoreQueries.some(query => query.isLoading);

    // Combiniamo i job posts con i match scores
    const jobsWithScores = useMemo(() => {
        if (!jobPosts || isLoadingScores) return [];
        return jobPosts.map((jobPost, index) => ({
            jobPost,
            matchScore: matchScoreQueries[index]?.data?.score ?? 0,
            isBlurred: !isPro && index >= 3, // Non blurrare se l'utente è pro
        }));
    }, [jobPosts, matchScoreQueries, isLoadingScores, isPro]);

    if (!reportId) {
        return (
            <div className="flex items-center justify-center">
                <p className="text-red-500">Error: Report ID is missing.</p>
            </div>
        );
    }

    return (
        <div className="p-5 md:p-9">
            <div className="flex flex-col space-y-7 md:space-y-9">
                <div className="flex flex-col space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Job Posts
                    </h1>
                    <p className="text-foreground text-md md:text-lg tracking-tight">
                        View details about the job posts we found for you.
                    </p>
                </div>
                {isLoading || isLoadingScores ? (
                    <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center">
                        <p className="text-red-500">Error loading job posts</p>
                    </div>
                ) : (
                    jobsWithScores.map(({ jobPost, matchScore, isBlurred }) => (
                        <JobPostCardItem
                            key={jobPost.id}
                            jobPost={jobPost}
                            isBlurred={isBlurred}
                            matchScore={matchScore}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default JobPost;
