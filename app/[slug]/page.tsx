// import { notFound } from "next/navigation";
import dynamic from "next/dynamic";



export default function DynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Define valid screens
  const screens: Record<string, ReturnType<typeof dynamic>> = {
    onboardingone: dynamic(() => import("../screens/OnboardingOne")),
    onboardingtwo: dynamic(() => import("../screens/OnboardingTwo")),
    onboardingthree: dynamic(() => import("../screens/OnboardingThree")),
    voiceselect: dynamic(() => import("../screens/VoiceSelect")),
    voiceregistration: dynamic(() => import("../screens/VoiceRegistration")),
    voiceregistrationconfirm: dynamic(() => import("../screens/VoiceRegistrationConfirm")),
    seedphrase: dynamic(() => import("../screens/SeedPhrase")),
  };

  // Load the correct component, or show NotFound
  const PageComponent = screens[slug] || dynamic(() => import("../screens/NotFound"));

  return <PageComponent />;
}
