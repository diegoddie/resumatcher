"use client"

import { Check, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Badge } from "../ui/badge"
import Link from "next/link"

export default function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const freePlanFeatures = [
    "3 job reports",
    "Resume analysis with AI",
    "3 Match scores per job report",
  ]

  const proPlanFeatures = [
    "Unlimited job reports",
    "Advanced AI resume analysis",
    "Detailed match scoring for every job",
    "Priority support",
  ]

  return (
    <section id="pricing" ref={ref} className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-3 2xl:px-12 space-y-8 sm:space-y-12">
        <div className="flex justify-center">
          <Badge className="inline-block px-3 sm:px-4 py-1.5 rounded-full border text-sm font-medium tracking-tight bg-[#3b82f6]/10 border-[#3b82f6] text-[#3b82f6]">
              Pricing
          </Badge>
        </div>

        <motion.div
          className="text-center space-y-3 sm:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Choose the plan that&apos;s right for you</h2>
          <p className="text-foreground text-md md:text-lg max-w-3xl mx-auto tracking-tight">
            Start with our free plan or upgrade to Pro for unlimited matches and advanced features
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center gap-8 mx-auto max-w-4xl">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <Card className="bg-white dark:bg-[#060914] border border-slate-500 dark:border-slate-700 shadow-xl h-full ">
              <CardHeader className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Free Plan</h3>
                <p className="tracking-tight text-foreground md:text-lg">Perfect for getting started</p>
                <p className="text-5xl font-bold text-foreground">
                  $0<span className="text-base font-normal tracking-tight">/month</span>
                </p>
              </CardHeader>
              <CardContent className="flex flex-col h-full p-8 pt-0 space-y-8">
                <ul className="space-y-4">
                  {freePlanFeatures.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    >
                      <div className="bg-green-100 p-1 rounded-full">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      </div>
                      <span className="text-foreground tracking-tight">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link href="/dashboard">
                    <Button className="w-full bg-black dark:bg-white dark:hover:bg-slate-400 text-white dark:text-black cursor-pointer hover:bg-black font-medium py-6 rounded-lg tracking-tight text-lg transition-colors duration-300">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            className="w-full md:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <div
              className="absolute top-4 right-4 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium tracking-tight"
            >
              Popular
            </div>
            <Card className="bg-[#3573d5] h-full shadow-xl border text-white border-slate-500">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Pro Plan</h3>
                  <Crown className="h-6 w-6 text-yellow-500" />
                </div>
                <p className="tracking-tight text-foreground md:text-lg">For serious job seekers</p>
                <p className="text-5xl font-bold text-foreground">
                  $5.99<span className="text-base font-normal tracking-tight">/month</span>
                </p>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex flex-col h-full space-y-8">
                <ul className="space-y-4">
                  {proPlanFeatures.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    >
                      <div className="bg-orange-400 p-1 rounded-full">
                        <Check className="h-4 w-4 text-white flex-shrink-0" />
                      </div>
                      <span className="text-white tracking-tight">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-6 rounded-lg tracking-tight cursor-pointer text-lg">
                      Upgrade to Pro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

