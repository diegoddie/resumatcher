"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import Link from "next/link"
import { useRef } from "react"

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-3 2xl:px-12">
        <motion.div
          className="bg-gradient-to-r from-purple-700 to-[#3b82f6] rounded-2xl p-10 md:p-16 border border-black"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                Ready to find your perfect job?
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl text-white/90 tracking-tight text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Upload your resume now and get matched with opportunities that align with your skills and experience.
              </motion.p>
            </div>

            <div>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-black dark:bg-[#060914] dark:hover:bg-slate-700 dark:text-white tracking-tight hover:bg-slate-300 border border-slate-500 cursor-pointer font-medium px-8 py-6 rounded-full shadow-lg text-lg transition-colors duration-300"
                >
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

