
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Dashboard/Sidebar/app-sidebar"
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardNavbar />
        <div className="">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
