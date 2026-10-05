import { HeroSection } from '@/components/home/HeroSection';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { StorySection } from '@/components/home/StorySection';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { FarmJourneyInstagram } from '@/components/home/FarmJourneyInstagram';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { initialCompanySettings } from '@/constants/mockData';
import { getOrganizationSchema, getLocalBusinessSchema } from '@/utils/seo';

export default function HomePage() {
  const orgSchema = getOrganizationSchema(initialCompanySettings);
  const localSchema = getLocalBusinessSchema(initialCompanySettings);

  return (
    <>
      {/* Structured SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />

      <HeroSection />
      <BenefitsSection />
      <StorySection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <FarmJourneyInstagram />
      <TestimonialsSection />
      <ProcessTimeline />
    </>
  );
}
