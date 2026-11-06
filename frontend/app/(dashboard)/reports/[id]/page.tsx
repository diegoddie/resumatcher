'use client'

import JobPostCardItem from "@/components/Dashboard/JobPostCardItem";
import { useQuery } from "@tanstack/react-query";
import { getJobPostsForReport, getMatchScoresForReport, getUserSubscription } from "@/utils/supabase/actions/userActions";
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

    const { data: matchScores, isPending: isLoadingScores } = useQuery({
        queryKey: ["matchScores", reportId],
        queryFn: () => getMatchScoresForReport({ reportId }),
        enabled: !!reportId && !!user?.id,
    });

    // Combiniamo i job posts con i match scores, dal migliore al peggiore
    const jobsWithScores = useMemo(() => {
        if (!jobPosts) return [];
        const scoresByPost = new Map((matchScores ?? []).map((matchScore) => [matchScore.job_post_id, matchScore]));
        return jobPosts
            .map((jobPost) => ({
                jobPost,
                matchScore: scoresByPost.get(jobPost.id)?.score ?? 0,
                matchDetails: scoresByPost.get(jobPost.id)?.details ?? null,
            }))
            .sort((a, b) => b.matchScore - a.matchScore)
            .map((job, index) => ({
                ...job,
                isBlurred: !isPro && index >= 3, // I free vedono i 3 migliori, non blurrare se l'utente è pro
            }));
    }, [jobPosts, matchScores, isPro]);

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
                    jobsWithScores.map(({ jobPost, matchScore, matchDetails, isBlurred }) => (
                        <JobPostCardItem
                            key={jobPost.id}
                            jobPost={jobPost}
                            isBlurred={isBlurred}
                            matchScore={matchScore}
                            matchDetails={matchDetails}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default JobPost;
