import { Hero } from '@/components/marketing/hero/Hero'; // T10
import { Highlights } from '@/components/marketing/highlights/Highlights'; // T11
import { ChannelExplorer } from '@/components/marketing/explorer/ChannelExplorer'; // T12
import { OverbookingStory } from '@/components/marketing/story/OverbookingStory'; // T13
import { Bento } from '@/components/marketing/bento/Bento'; // T14
import { BeforeAfter } from '@/components/marketing/story/BeforeAfter'; // T13
import { FeatureGrid } from '@/components/marketing/features/FeatureGrid'; // T15
import { Steps } from '@/components/marketing/features/Steps'; // T15
import { AppShowcase } from '@/components/marketing/features/AppShowcase'; // T15
import { PricingSection } from '@/components/marketing/pricing/PricingSection'; // T16
import { Faq } from '@/components/marketing/pricing/Faq'; // T16
import { FinalCta } from '@/components/marketing/pricing/FinalCta'; // T16
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function Landing() {
  useDocumentTitle();
  return (
    <>
      <Hero />
      <Highlights />
      <ChannelExplorer />
      <OverbookingStory />
      <Bento />
      <BeforeAfter />
      <FeatureGrid />
      <Steps />
      <AppShowcase />
      <PricingSection />
      <Faq />
      <FinalCta />
    </>
  );
}
