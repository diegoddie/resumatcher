import { Database } from "./supabase";

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]
export type MatchScore = Database["public"]["Tables"]["match_scores"]["Row"]
export type JobPost = Database["public"]["Tables"]["job_posts"]["Row"]
export type JobReport = Database["public"]["Tables"]["job_reports"]["Row"]
export type JobReportPost = Database["public"]["Tables"]["job_report_posts"]["Row"]

export type UserCreditsInfo = {
    credits: number;
    plan: string;
};






