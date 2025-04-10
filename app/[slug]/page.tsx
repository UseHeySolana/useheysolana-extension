import dynamic from "next/dynamic";

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = await params; // Await params

  // Define valid screens
  const screens: Record<string, ReturnType<typeof dynamic>> = {
    onboardingone: dynamic(() => import("../screens/OnboardingOne")),
    onboardingtwo: dynamic(() => import("../screens/OnboardingTwo")),
    onboardingthree: dynamic(() => import("../screens/OnboardingThree")),
    voiceselect: dynamic(() => import("../screens/VoiceSelect")),
    voiceregistration: dynamic(() => import("../screens/VoiceRegistration")),
    voiceregistrationconfirm: dynamic(() => import("../screens/VoiceRegistrationConfirm")),
    seedphrase: dynamic(() => import("../screens/SeedPhrase")),
    dashboard: dynamic(() => import("../screens/Dashboard")),
    selecttoken:dynamic(() => import("../screens/SelectToken")),
    sendtoken: dynamic(() => import("../screens/SendToken")),
    amount: dynamic(() => import("../screens/Amount")),
    recieve: dynamic(() => import("../screens/Recieve")),
    qrcode: dynamic(() => import("../screens/QrCode")),
    swap: dynamic(() => import("../screens/Swap")),
    navbar: dynamic(() => import("../screens/NavBar")),
    settings: dynamic(() => import("../screens/Settings")),
    

    transactionsuccessful: dynamic(() => import("../screens/TransactionSuccessful")),

  };

  // Load the correct component, or show NotFound
  const PageComponent = screens[slug] || dynamic(() => import("../screens/NotFound"));

  return <PageComponent />;
}
