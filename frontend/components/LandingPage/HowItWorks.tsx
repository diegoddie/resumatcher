"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Upload, Zap, Award, Eye, FileText, Check, Code } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const steps = [
    {
      number: "01",
      title: "Upload Your Resume",
      description: "Simply upload your resume in PDF or DOCX format. Our system supports all standard resume formats.",
      icon: Upload,
      iconBg: "bg-blue-600/20",
    },
    {
      number: "02",
      title: "AI Analysis",
      description:
        "Our advanced AI extracts key skills, experience, and qualifications from your resume to create your profile.",
      icon: Zap,
      iconBg: "bg-purple-600/20",
    },
    {
      number: "03",
      title: "Get Matched",
      description:
        "Receive personalized job matches with detailed match scores showing how well your profile aligns with each opportunity.",
      icon: Award,
      iconBg: "bg-amber-500/20",
    },
  ]

  const features = [
    "Semantic understanding of skills and requirements",
    "Context-aware matching that goes beyond keywords",
    "Personalized recommendations that improve over time"
  ]

  return (
    <section id="how-it-works" ref={ref} className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-3 2xl:px-12 space-y-8 sm:space-y-12">
        <div className="flex justify-center">
            <Badge className="inline-block px-3 sm:px-4 py-1.5 rounded-full border text-sm font-medium tracking-tight bg-[#3b82f6]/10 border-[#3b82f6] text-[#3b82f6]">
                How It Works
            </Badge>
        </div>

        <motion.div
          className="text-center space-y-3 sm:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Simple steps to find your perfect Job</h2>
          <p className="text-foreground text-md md:text-lg max-w-3xl mx-auto tracking-tight">
            Our AI-powered platform analyzes your resume and matches you with the best job opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
            >
              <Card className="bg-white dark:bg-[#0a1122]/90 px-3 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-xl h-full">
                <CardHeader className="">
                  <div className="flex justify-between items-center">
                    <div className={`text-3xl sm:text-4xl font-bold flex items-center justify-center ${
                      step.iconBg === "bg-blue-600/20" ? "text-blue-500/70" : 
                      step.iconBg === "bg-purple-600/20" ? "text-purple-500/70" : 
                      "text-amber-500/70"
                    }`}>
                      {step.number}
                    </div>
                    <div className={`${step.iconBg} p-4 rounded-full`}>
                      <step.icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${
                          step.iconBg === "bg-blue-600/20" ? "text-blue-500" : 
                          step.iconBg === "bg-purple-600/20" ? "text-purple-500" : 
                          "text-amber-500"
                        }`}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className=" flex flex-col h-full">
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 tracking-tight">{step.title}</h3>
                    <p className="text-foreground dark:text-gray-400 text-base sm:text-lg tracking-tight">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-slate-100 dark:bg-[#0a1122] border border-slate-300 dark:border-slate-700 shadow-xl mt-20 md:p-8">
          <CardContent className="">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 lg:w-1/2"
              >
                <div className="flex flex-row gap-3 items-center">
                  <div className="bg-slate-500/20 p-4 rounded-full">
                    <Code className="h-5 w-5 text-slate-500" />
                  </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Advanced AI Matching Technology</h2>
                </div>
                
                <p className="text-foreground text-base sm:text-lg tracking-tight">
                  Our proprietary algorithm uses sentence transformers and vector similarity to calculate precise match
                  scores between your resume and job postings.
                </p>

                <ul className="space-y-3 sm:space-y-4">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    >
                      <div className="bg-green-100 p-1 rounded-full">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      </div>
                      <span className="text-foreground text-sm sm:text-base tracking-tight">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="w-full lg:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-white dark:bg-[#060914] border border-slate-300 dark:border-slate-700 shadow-xl">
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500/20 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-medium tracking-tight">Resume.pdf</h3>
                          <div className="flex flex-wrap items-center gap-1 md:gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                            <span className="tracking-tight">18/03/2025</span>
                            <span className="">•</span>
                            <span className="tracking-tight">Brescia</span>
                            <span className="">•</span>
                            <span className="tracking-tight">10 matches found</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="bg-gray-100 text-gray-700 dark:text-slate-300 dark:bg-slate-800 text-sm px-2 py-1 rounded">Software Engineer</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-md tracking-tight text-gray-700 dark:text-slate-300">Key Skills</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-slate-300 tracking-tight">Javascript</span>
                        <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-slate-300 tracking-tight">React</span>
                        <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-slate-300 tracking-tight">Typescript</span>
                        <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-slate-300 tracking-tight">+3 more</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white w-full sm:w-auto">
                        <Eye className="h-4 w-4" />
                        View Matches
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

