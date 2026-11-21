import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ToneManager from "@/components/providers/ToneManager";
import Topbar from "@/components/navigation/Topbar";
import Hero from "@/components/sections/Hero";
import WorkTrack from "@/components/sections/WorkTrack";
import AboutMe from "@/components/sections/AboutMe";
import Experience from "@/components/sections/Experience";
import Insights from "@/components/sections/Insights";
import Clients from "@/components/sections/Clients";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/navigation/Footer";
import ProjectModal from "@/components/overlay/ProjectModal";
import Loader from "@/components/ui/Loader";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Loader />
      <ToneManager />
      <Topbar />
      <main id="main">
        <Hero />
        <WorkTrack />
        <div id="chapters">
          <AboutMe />
          <Experience />
          <Insights />
          {/* <Clients /> - Kept hidden for now per user request */}
          <Testimonials />
        </div>
        <Contact />
      </main>
      <Footer />
      <ProjectModal />
    </SmoothScrollProvider>
  );
}
