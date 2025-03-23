"use client"

import { Button } from "@/components/ui/button"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Check } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  const [isClient, setIsClient] = useState(false)
  const matchScore = useMotionValue(0)
  const matchScoreDisplay = useTransform(matchScore, Math.round)

  useEffect(() => {
    setIsClient(true)

    const controls = animate(matchScore, 89, {
      duration: 2,
      delay: 0.5,
      ease: "easeOut",
    })

    return () => controls.stop()
  }, [matchScore])

  const skills = [
    { name: "React", color: "bg-blue-500" },
    { name: "TypeScript", color: "bg-yellow-500" },
    { name: "Node.js", color: "bg-purple-500" },
    { name: "AWS", color: "bg-orange-500" },
    { name: "Docker", color: "bg-blue-400" },
  ]

  return (
    <section className="pt-28 pb-20 min-h-screen flex items-center" id="home">
      <div className="container mx-auto px-3 2xl:px-12 flex flex-col lg:flex-row items-center gap-18 md:gap-10">
        <div className="lg:w-7/12 space-y-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="items-center justify-center flex md:justify-start">
            <Badge className="inline-block px-4 py-1.5 rounded-full border text-sm font-medium tracking-tight bg-[#3b82f6]/10 border-[#3b82f6] text-[#3b82f6]">
                AI-Powered Job Matching
            </Badge>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-5xl 2xl:text-6xl font-bold mb-6 tracking-tight text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find your perfect job with<br /> <span className="bg-gradient-to-r from-purple-700 to-[#3b82f6] bg-clip-text text-transparent">AI-powered</span> resume matching
          </motion.h1>

          <motion.p
            className="text-lg text-foreground tracking-tight leading-relaxed max-w-3xl text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Upload your resume and let our advanced AI analyze it to find the most relevant job opportunities with precise match scores.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white w-full text-lg cursor-pointer font-medium px-8 py-6 rounded-lg tracking-tight transition-colors duration-300"
              >
                Get started 
              </Button>
            </Link>
            <Link href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-500 hover:bg-slate-700/20 dark:hover:bg-slate-800 dark:border-slate-300 w-full rounded-lg transition-colors text-lg tracking-tight cursor-pointer py-6 px-8 duration-300"
            >
                See how it works
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="lg:w-5/12 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Handwritten text */}
          <motion.div
            className="absolute -top-9 right-10 z-10 font-caveat text-2xl font-bold text-green-500 -rotate-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.3 }}
          >
            Perfect match for you!
          </motion.div>

          <Card className="shadow-2xl relative bg-white dark:bg-[#060914] border border-slate-400 dark:border-slate-400">
            <CardContent className="">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Software Engineer</h3>
                  <p className="text-slate-600 dark:text-gray-400 tracking-tight">San Francisco, CA</p>
                </div>
                <div className="text-right">
                  {isClient && (
                    <motion.div className="text-2xl md:text-3xl font-extrabold text-green-500 tracking-tight">
                      <motion.span>{matchScoreDisplay}</motion.span>%
                    </motion.div>
                  )}
                  <p className="text-sm text-slate-600 dark:text-gray-400 tracking-tight">Match Score</p>
                </div>
              </div>

              <div className="h-2 bg-slate-200 dark:bg-gray-800 rounded-full mb-6 overflow-hidden border border-slate-500/40">
                {isClient && (
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "89%" }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill.name}
                    className={`${skill.color} px-3 py-1 tracking-tight rounded-full text-sm text-white font-semibold`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  >
                    {skill.name}
                  </motion.span>
                ))}
                <motion.span
                  className="bg-slate-600 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-white font-semibold tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                >
                  +5 more
                </motion.span>
              </div>

              <motion.button
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white text-lg font-medium py-2 px-3 rounded-lg tracking-tight transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Job Details
              </motion.button>

              <motion.div
                className="flex items-center gap-3 mt-6 p-3 bg-slate-200/70 dark:bg-gray-800/50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-full">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-800" />
                </div>
                <div>
                  <p className="font-medium tracking-tight text-slate-800 dark:text-white">Resume analyzed</p>
                  <p className="text-slate-600 dark:text-gray-400 text-sm tracking-tight">10 matching skills found</p>
                </div>
                <div className="ml-auto">
                  <div className="bg-green-100 dark:bg-green-500/20 p-1 rounded-full">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-500" />
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

