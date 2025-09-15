import { TooltipProvider } from "@/components/ui/tooltip"
import { SiteHeader } from "@/components/site-header"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <TooltipProvider>
      <SiteHeader />
      <main>{children}</main>
    </TooltipProvider>
  )
}
