"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Briefcase, LayoutDashboard, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import ThemeButton from "../ThemeButton"
import { useUser } from "@clerk/nextjs"
import { useClerk } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
    
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Handle scroll effect and active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Get all sections
      const sections = navItems.map(item => ({
        id: item.href.replace("#", ""),
        element: document.getElementById(item.href.replace("#", ""))
      }))

      // Find the current section
      const current = sections.find(section => {
        if (!section.element) return false
        const rect = section.element.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })

      if (current) {
        setActiveSection(current.id)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (mobileMenuOpen && !target.closest("[data-mobile-menu]") && !target.closest("[data-mobile-trigger]")) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [mobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const navItems = [
    { name: "Home", href: "#home", id: "home" },
    { name: "How It Works", href: "#how-it-works", id: "how-it-works" },
    { name: "Pricing", href: "#pricing", id: "pricing" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "dark:bg-[#0a1122]/90 bg-white/90 backdrop-blur-md py-3 shadow-sm" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-3 2xl:px-12 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-[#3b82f6] hover:bg-[#2563eb] p-2 rounded-lg">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Resumatcher</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`font-semibold tracking-tight text-lg py-1 px-3 rounded-full transition-colors duration-100 ${
                  activeSection === item.id
                    ? "bg-[#3b82f6] text-white" 
                    : "hover:bg-[#3b82f6] hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop Auth Buttons and Theme Toggle */}
        <div className="hidden md:flex items-center gap-4 justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <ThemeButton />
          </motion.div>
          {!user ? (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <Button 
                  onClick={() => router.push("/sign-up")}
                  className="text-lg rounded-full tracking-tight cursor-pointer border border-slate-500 dark:border-slate-300 hover:bg-slate-700/20 dark:hover:bg-slate-800 transition-colors" 
                  size="lg"
                >
                  Sign up
                </Button>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <Button 
                  onClick={() => router.push("/sign-in")}
                  variant="default" 
                  className="text-lg rounded-full tracking-tight cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors" 
                  size="lg"
                >
                  Login
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="items-center justify-center flex">
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <Avatar className="h-12 w-12 rounded-full cursor-pointer">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                    <AvatarFallback className="rounded-lg">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-black border border-slate-400 dark:border-slate-700">
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/20 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-600/20 dark:hover:bg-red-600/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button and Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="relative z-20"
            data-mobile-trigger
          >
            {mobileMenuOpen ? (
              <X className="h-8 w-8 transition-transform duration-200" />
            ) : (
              <Menu className="h-8 w-8 transition-transform duration-200" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            data-mobile-menu
            className="fixed inset-0 bg-white dark:bg-black md:hidden flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <motion.div
                className="flex flex-col items-center gap-8 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`text-2xl font-medium tracking-tight transition-colors ${
                        activeSection === item.id
                          ? "text-[#3b82f6]" 
                          : "hover:text-[#3b82f6]"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="flex flex-col gap-4 mt-4 w-full px-5">
                  {!user ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Button 
                          onClick={() => router.push("/sign-up")}
                          className="w-full text-lg rounded-full tracking-tight cursor-pointer border border-slate-500 hover:bg-slate-700/20 dark:hover:bg-slate-800 transition-colors"
                        >
                          Sign up
                        </Button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="w-full"
                      >
                        <Button 
                          onClick={() => router.push("/sign-in")}
                          className="w-full text-lg rounded-full tracking-tight cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors"
                        >
                          Log in
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className=""
                      >
                        <Button 
                          onClick={() => router.push("/dashboard")}
                          className="w-full text-lg rounded-full tracking-tight cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors"
                        >
                          Dashboard
                        </Button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="w-full"
                      >
                        <Button 
                          onClick={() => signOut()}
                          variant="destructive"
                          className="w-full text-lg rounded-full tracking-tight cursor-pointer bg-red-600 hover:bg-red-700 text-white transition-colors"
                        >
                          Logout
                        </Button>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

