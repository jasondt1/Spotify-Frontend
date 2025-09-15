export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Spotify",
  description:
    "A clone of Spotify built with Next.js, Tailwind CSS, and the Spotify API.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
