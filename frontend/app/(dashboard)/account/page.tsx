"use client";
import { CheckCircle2, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { disableUser, getUserSubscription } from "@/utils/supabase/actions/userActions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

function Account() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [disableLoading, setDisableLoading] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  const {
    data: subscription,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return getUserSubscription({ id: user.id });
    },
    enabled: !!user?.id,
  });

  const router = useRouter();
  const isPro = subscription?.plan === "pro";
  const endDate = subscription?.end_date ? new Date(subscription.end_date) : null;
  const formattedEndDate = endDate 
    ? format(endDate, "d MMMM yyyy", { locale: enUS }) 
    : null;
  const creditsLeft = subscription?.credits ?? 0;
  const showCreditsLoading = isLoading || !user?.id;

  const handleDisableAccount = async () => {
    setDisableLoading(true);

    try {
      if (!user?.id) return;
      await disableUser({ id: user.id });
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to disable account:", error);
    } finally {
      setDisableLoading(false);
    }
  };

  const handleUpgradeClick = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to subscribe");
      return;
    }
    
    setIsLoadingCheckout(true);
    try {
      const response = await axios.post('/api/stripe/create-checkout-session', {
        userId: user.id,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
      });
      
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to manage your subscription");
      return;
    }
    
    setIsLoadingCheckout(true);
    try {
      const response = await axios.post('/api/stripe/create-portal-session', {
        userId: user.id
      });
      
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className="p-5 md:p-9">
      <div className="flex flex-col space-y-7 md:space-y-9">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Account
          </h1>
          <p className="text-foreground text-md md:text-lg tracking-tight">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Card className="w-full md:w-1/2 border-slate-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl tracking-tight">
                Profile
              </CardTitle>
              <CardDescription className="tracking-tight text-md md:text-lg">
                Manage your profile information.
              </CardDescription>
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
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 rounded-full cursor-pointer">
                      <AvatarImage
                        src={user?.imageUrl}
                        alt={user?.fullName || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.fullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-medium tracking-tight">
                        {user?.fullName}
                      </p>
                      <p className="text-sm text-foreground tracking-tight">
                        {user?.emailAddresses[0].emailAddress}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between py-2 border-b border-slate-500">
                      <div>
                        <p className="font-medium tracking-tight text-md md:text-lg">
                          Current Plan
                        </p>
                        <p className="text-sm md:text-md text-muted-foreground tracking-tight">
                          {isPro ? "Pro" : "Free"} plan
                        </p>
                      </div>
                      <div className="flex flex-col xl:flex-row gap-2">
                        <Badge
                          variant="outline"
                          className="ml-auto tracking-tight border-slate-500"
                        >
                          {isPro ? "Unlimited Job Reports" : "3 Job Reports"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="ml-auto tracking-tight border-slate-500"
                        >
                          {isPro
                            ? "Unlimited Match Score / Job Report"
                            : "3 Match Score / Job Report"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium tracking-tight text-md md:text-lg">
                          Credits Remaining
                        </p>
                        <p className="text-sm md:text-md text-muted-foreground tracking-tight">
                          {isPro ? "Unlimited" : `${creditsLeft} Credits`}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="ml-auto tracking-tight border-slate-500"
                      >
                        {isPro ? "Unlimited" : `${creditsLeft} Credits`}
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="w-full md:w-1/2 border-slate-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl tracking-tight">
                {isPro ? "Manage Subscription" : "Upgrade to Pro"}
              </CardTitle>
              <CardDescription className="tracking-tight text-md md:text-lg">
                {isPro
                  ? "Manage your Pro subscription"
                  : "Get more features and unlimited credits."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {showCreditsLoading ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="text-sm text-muted-foreground">Loading subscription info...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-500/10 p-3 rounded-full">
                      <Zap className="h-6 w-6 text-yellow-500 " />
                    </div>
                    <div>
                        <p className="font-bold tracking-tight text-md md:text-lg">
                          {isPro ? "Pro Plan - $5.99/month" : "Pro Plan - $5.99/month"}
                        </p>
                        <p className="text-sm md:text-md text-muted-foreground tracking-tight">
                          {isPro
                            ? "Access to all features and unlimited credits"
                            : "Unlock unlimited Job Reports generation and match scores for every job"}
                        </p>
                    </div>
                  </div>
                  
                  {!isPro && (
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm md:text-md tracking-tight">
                          Unlimited Job Reports
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm md:text-md tracking-tight">
                          Match Score for every job post
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm md:text-md tracking-tight">
                          Priority support
                        </span>
                      </li>
                    </ul>
                  )}
                  
                  {isPro && formattedEndDate && (
                    <div className="rounded-md border p-4 bg-slate-50 dark:bg-slate-900">
                      <div className="font-medium">Active Subscription</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Your subscription will automatically renew on {formattedEndDate}.
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full cursor-pointer tracking-tight text-white bg-[#3b82f6] hover:bg-[#2563eb] text-lg transition-colors duration-300"
                onClick={isPro ? handleManageSubscription : handleUpgradeClick}
                disabled={isLoadingCheckout || showCreditsLoading}
              >
                {isLoadingCheckout ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : isPro ? "Manage Subscription" : "Upgrade to Pro"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Card className="border-slate-500">
          <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex flex-col">
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl tracking-tight">
                Disable Account
              </CardTitle>
              <CardDescription className="tracking-tight text-md md:text-lg">
                Temporarily disable your account
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="mt-4 md:mt-0 cursor-pointer tracking-tight text-white bg-red-500 hover:bg-red-700 text-md transition-colors duration-300"
                >
                  Disable
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-black border-slate-500">
                <DialogHeader>
                  <DialogTitle className="tracking-tight text-lg md:text-xl">
                    Are you sure?
                  </DialogTitle>
                  <DialogDescription className="tracking-tight text-sm md:text-md">
                    This action is irreversible. Your account will be
                    temporarily disabled.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button
                    variant="destructive"
                    onClick={handleDisableAccount}
                    disabled={disableLoading}
                    className="cursor-pointer tracking-tight text-white bg-red-500 hover:bg-red-700 text-lg transition-colors duration-300"
                  >
                    {disableLoading ? "Disabling..." : "Confirm Disable"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

export default Account