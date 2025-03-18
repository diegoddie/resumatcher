"use server"

import { createClerkSupabaseClientSsr } from "@/utils/clerk/clerk-client";
import { JobPostInfo, JobReportInfo, MatchScoreInfo, UserCreditsInfo } from "../types/types";

export async function getUserSubscription({ id }: { id: string }): Promise<UserCreditsInfo | null> {
    if (!id) return null;
    try {
        const client = await createClerkSupabaseClientSsr();

        const { data, error } = await client.from("subscriptions").select("credits, plan").eq("user_id", id).single();

        if (error) {
            console.error("Error fetching user credits:", error);
            return null;
        }

        return data
    } catch (e) {
        console.error("Exception fetching user credits:", e);
        return null;
    }
}

export async function getUserJobReports({ id }: { id: string }): Promise<JobReportInfo[] | null> {
    if (!id) return null;
    try {
        const client = await createClerkSupabaseClientSsr();

        const { data, error } = await client.from("job_reports").select("id, filename, created_at, location, role, skills").eq("user_id", id).order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching user job report:", error);
            return null;
        }

        return data;
    } catch (e) {
        console.error("Exception fetching user job report:", e);
        return null;
    }
}

export async function getJobPostCountForReport({ reportId }: { reportId: string }): Promise<number> {
    if (!reportId) return 0;
    try {
        const client = await createClerkSupabaseClientSsr();

        const { data, error } = await client
            .from("job_report_posts")
            .select("job_post_id")
            .eq("job_report_id", reportId);

        if (error) {
            console.error("Error fetching job posts:", error);
            return 0;
        }

        return data.length;
    } catch (e) {
        console.error("Exception fetching job posts:", e);
        return 0;
    }
}

export async function getJobPostsForReport({ reportId }: { reportId: string }): Promise<JobPostInfo[] | null> {
    if (!reportId) return null;
    try {
        const client = await createClerkSupabaseClientSsr();

        const { data: jobPostIds, error } = await client.from("job_report_posts").select("job_post_id").eq("job_report_id", reportId);

        if (error) {
            console.error("Error fetching job posts:", error);
            return null;
        }

        const { data: jobPosts, error: jobPostsError } = await client.from("job_posts").select("id, role, company, location, description, salary, requirements, url").in("id", jobPostIds.map(post => post.job_post_id));

        if (jobPostsError) {
            console.error("Error fetching job posts:", jobPostsError);
            return null;
        }

        return jobPosts;
        
    } catch (e) {
        console.error("Exception fetching job posts:", e);
        return null;
    }
}

export async function getMatchScoreForJobPost({ jobPostId, jobReportId, userId }: { jobPostId: string, jobReportId: string, userId: string }): Promise<MatchScoreInfo | null>{
    if (!jobPostId || !jobReportId || !userId) {
        console.error("Missing required parameters:", { jobPostId, jobReportId, userId });
        return null;
    }
    
    try {
        const client = await createClerkSupabaseClientSsr();

        // Prima verifichiamo se esiste un match score con questi parametri
        const { data, error } = await client
            .from("match_scores")
            .select("score")
            .eq("job_post_id", jobPostId)
            .eq("job_report_id", jobReportId)
            .eq("user_id", userId)
            .single();

        if (error) {
            console.error("Error fetching match score:", error);
            return null;
        }

        return data;
    } catch (e) {
        console.error("Exception fetching match score:", e);
        return null;
    }
}
