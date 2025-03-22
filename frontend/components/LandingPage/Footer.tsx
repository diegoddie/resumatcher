"use client"

import Link from "next/link"
import { Briefcase } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  const footerLinks = [
    { name: "Home", href: "#home" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ]

  return (
    <footer className="py-5">
      <div className="container mx-auto px-3 2xl:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <motion.div
            className="flex items-center gap-2 mb-4 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#3b82f6] hover:bg-[#2563eb] p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Resumatcher</span>
          </motion.div>

          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className="transition-colors duration-300 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 tracking-tight"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        <motion.div
          className="border-t dark:border-gray-800 border-gray-300 pt-4 text-center dark:text-gray-400 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-sm tracking-tight">&copy; {new Date().getFullYear()} Resumatcher. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

