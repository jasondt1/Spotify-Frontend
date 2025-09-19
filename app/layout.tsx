import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { spotifyFont } from "@/lib/font"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { TopProgressBar } from "@/components/top-progress-bar"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/spotify-logo.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={cn(spotifyFont.variable)}
      suppressHydrationWarning
    >
      <body className="bg-black font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TopProgressBar />
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
