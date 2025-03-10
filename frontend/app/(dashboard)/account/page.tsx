"use client";
import { CheckCircle2, Zap } from "lucide-react";
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
import { useUser } from "@clerk/nextjs";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Account() {
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        setLoading(true);

        try{
            await user?.delete()
            router.push("/")
        } catch (error) {
            console.error("Failed to delete account:", error);
        } finally {
            setLoading(false);
        }
    }
    
  return (
    <div className="p-5 md:p-9">
      <div className="flex flex-col space-y-6 md:space-y-8">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Account
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 rounded-full cursor-pointer">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                <AvatarFallback className="rounded-lg">{user?.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
              <div>
                <p className="text-lg font-medium">{user?.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {user?.emailAddresses[0].emailAddress}
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <p className="text-sm text-muted-foreground">Free Plan</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <Badge variant="outline" className="ml-auto">
                    3 Job Reports
                    </Badge>
                    <Badge variant="outline" className="ml-auto">
                    3 Match Score / Job Report
                    </Badge>
                </div>

              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Credits Remaining</p>
                  <p className="text-sm text-muted-foreground">
                    3 credits left
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  3 Credits
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/2 justify-between space-y-3">
          <CardHeader>
            <CardTitle>Upgrade to Pro</CardTitle>
            <CardDescription>
              Get more features and unlimited credits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Zap className="h-6 w-6 text-yellow-600 " />
              </div>
              <div>
                <p className="font-medium">Pro Plan - $5.99/month</p>
                <p className="text-sm text-muted-foreground">
                  Unlock unlimited Job Reports generation and unlimited job matching scores
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited Job Reports</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-sm">Match Score for every job post</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full cursor-pointer">Upgrade to Pro</Button>
          </CardFooter>
        </Card>
        </div>


        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account
                </p>
              </div>
              <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="cursor-pointer">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action is irreversible. Your account will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading} className="cursor-pointer">
                  {loading ? "Deleting..." : "Confirm Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Account;
