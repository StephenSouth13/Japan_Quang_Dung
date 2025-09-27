import { HeroSection } from "../components/HeroSection"
import { FeaturesSection } from "../components/FeaturesSection"
import { AboutSection } from "../components/AboutSection"
import { CoursesSection } from "../components/CoursesSection"
import { BlogHighlight } from "../components/BlogHighlight"
import { TeachersSection } from "../components/TeachersSection"
import { NewsSection } from "../components/NewsSection"
import { CTASection } from "../components/CTASection"
import { ContactSection } from "../components/ContactSection"

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <CoursesSection />
      <BlogHighlight />
      <TeachersSection />
      <NewsSection />
      <CTASection />
      <ContactSection />
    </>
  )
}
