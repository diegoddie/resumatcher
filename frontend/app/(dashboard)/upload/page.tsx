"use client";

import StepFileSelected from "@/components/Dashboard/CvFileSelected";
import CvUploader from "@/components/Dashboard/CvUploader";
import StepConfirmation from "@/components/Dashboard/StepConfirmation";
import StepRedirecting from "@/components/Dashboard/StepRedirecting";
import { Badge } from "@/components/ui/badge";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTrigger,
} from "@/components/ui/stepper";
import { CVData } from "@/lib/schemas/cvDataSchema";
import { fileSchema } from "@/lib/schemas/fileSchema";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserSubscription } from "@/utils/supabase/actions/userActions";

function UploadCv() {
  const { user } = useUser();
  const queryClient = useQueryClient();

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

  const isPro = subscription?.plan === "pro";
  const creditsLeft = subscription?.credits ?? 0;
  const showCreditsLoading = isLoading || !user?.id;
  
  const steps = [0, 1, 2, 3];
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const stepTitles = [
    "Upload Your CV",
    "Confirm Your File",
    "Review CV Data",
    "Finding Matches"
  ];
  
  const stepDescriptions = [
    "Upload your CV to find matching job opportunities",
    "Check your file before analysis",
    "AI analyzed your CV. Please review the data before confirming.",
    "We're finding the best job matches for your profile"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
  
    if (!selectedFile) return;
  
    const validation = fileSchema.safeParse(selectedFile);
    
    if (!validation.success) {
      alert(validation.error.issues[0].message);
      return;
    }
  
    setFile(selectedFile);
    setCurrentStep(1);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user?.id || "");
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/summarize`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const cvData: CVData = response.data;

      setCvData(cvData);
      toast.success("CV analyzed successfully by AI, please review the data before confirming.", {
        richColors: true,
      });

      setCurrentStep(currentStep + 1);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.warning(`Error: ${err.response.data.detail}`, {
          richColors: true,
          action: {
            label: 'Upgrade to Pro',
            onClick: () => {
              router.push('/account');
            }
          }
        });
      } else {
        toast.warning("An unexpected error occurred. Please try again.", {
          richColors: true,
          duration: 4000,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCvDataChange = (updatedCvData: CVData) => {
    setCvData(updatedCvData);
  };

  const handleConfirm = async() => {
    if (!cvData) return;
    if (!file) return;

    setCurrentStep(currentStep + 1);

    try {
      // Crea l'oggetto JobSearchRequest come richiesto dal backend
      const jobSearchRequest = {
        user_id: user?.id || "",
        role: cvData.role,
        location: cvData.location,
        skills: cvData.skills, // Passa l'array direttamente
        years_experience: cvData.years_experience || 0,
        filename: file.name || "uploaded_cv.pdf"
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search`, jobSearchRequest, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Invalida la cache per la query dei report
        queryClient.invalidateQueries({ queryKey: ["reports"] });
        
        // Invalida la cache per la query dei crediti/subscription
        queryClient.invalidateQueries({ queryKey: ["subscription", user?.id] });
        
        toast.success("Job search completed successfully, redirecting to job reports page", {
          richColors: true,
          duration: 4000,
        });
        setTimeout(() => {
          router.push("/reports");
        }, 1000);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data)
        toast.warning(`Error: ${err.response.data.detail}`, {
          richColors: true,
          duration: 4000,
        });
      } else {
        toast.warning("An unexpected error occurred while finding job matches.", {
          richColors: true,
          duration: 4000,
        });
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setCvData(null);
    setCurrentStep(0);
  };

  return (
    <div className="p-5 md:p-9">
      <div className="flex flex-col space-y-7 md:space-y-12">
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between">
          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {stepTitles[currentStep]}
            </h1>
            <p className="text-foreground text-md md:text-lg tracking-tight">
              {stepDescriptions[currentStep]}
            </p>
          </div>
          <Badge variant="outline" className="order-first md:order-none h-8 gap-1.5 px-3 py-1 self-start md:self-center bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800">
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
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {isPro ? "Unlimited" : `${creditsLeft} credits left`}  
                </span>
              </>
            )}
          </Badge>
        </div>

        <div className="flex justify-center w-full">
          <div className="w-full md:max-w-5xl flex flex-col gap-4">
            <div className="text-center gap-2 w-1/2 mx-auto">
              <div className="text-md font-medium tabular-nums text-foreground tracking-tight ">
                Step {currentStep + 1} of {steps.length}
              </div>
              <Stepper value={currentStep} onValueChange={setCurrentStep}>
              {steps.map((step, index) => (
                  <StepperItem key={step} step={index} className="flex-1">
                    <StepperTrigger
                      className="w-full flex-col items-start gap-2 bg-[#3b82f6]" 
                      asChild
                    >
                      <StepperIndicator
                        asChild
                        className="h-2 w-full rounded-none bg-[#c9daf4]"
                      >
                        <span className="sr-only">{step}</span>
                      </StepperIndicator>
                    </StepperTrigger>
                  </StepperItem>
                ))}
              </Stepper>
            </div>
            {currentStep === 0 && (
              <CvUploader onFileChange={handleFileChange} />
            )}
            {currentStep === 1 && file && (
              <StepFileSelected
                file={file} 
                isUploading={isUploading} 
                onUpload={handleUpload} 
                onChangeFile={handleReset}
              />
            )}
            {currentStep === 2 && cvData && (
              <StepConfirmation 
                cvData={cvData}
                onChangeCvData={handleCvDataChange} 
                onConfirm={handleConfirm}
              />
            )}
            {currentStep === 3 && (
              <StepRedirecting />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadCv;
