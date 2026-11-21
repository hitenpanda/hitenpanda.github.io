import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Hiten Panda — UX/UI, web, app and digital experience design studio",
  description:
    "Hiten Panda, designer and developer in Chandigarh, India. I design and build websites, interested in hardware and making fun projects.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="f-loading motion"
      suppressHydrationWarning
    >
      <head>
        <script
          id="f-motion-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){var h=document.documentElement;h.classList.add('motion');try{history.scrollRestoration='manual'}catch(e){}if(new RegExp("^\\\\/(?:work\\\\/[^/]+\\\\\\/?)?$").test(location.pathname))h.classList.add('f-loading');setTimeout(function(){if(!h.classList.contains('motion-live')){h.classList.remove('motion','f-loading');h.classList.add('motion-timeout')}},10000)})()`,
          }}
        />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/omg1nuw.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet" />
        <link
          rel="preload"
          href="/fonts/Galgo.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/DotGothic16-Regular-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon.png"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
        />
        <link
          rel="preload"
          href="/brand/hiten-panda-logo.svg"
          as="image"
        />
        <link
          rel="preload"
          href="/brand/hero-still-1600.webp"
          as="image"
          media="(min-width: 810px)"
        />
        <link
          rel="preload"
          href="/brand/hero-still-800.webp"
          as="image"
          media="(max-width: 809.98px)"
        />
      </head>
      <body>
        <div className="f-page" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
