import { CallToAction } from "@/components/landing/cta";
import { FAQ } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Models } from "@/components/landing/models";
import { ProductPreview } from "@/components/landing/preview";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { WhyChoose } from "@/components/landing/why";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Features />
        <Models />
        <ProductPreview />
        <WhyChoose />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
