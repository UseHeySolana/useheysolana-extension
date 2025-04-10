// pages/404.js
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="text-center space-y-6 px-4">
        {/* Animated Soundwave */}
        <div className="flex justify-center space-x-1 mb-8">
          <div className="w-2 h-16 bg-voice-purple-400 animate-pulse-slow"></div>
          <div className="w-2 h-24 bg-voice-purple-500 animate-pulse-slow animation-delay-100"></div>
          <div className="w-2 h-20 bg-voice-purple-600 animate-pulse-slow animation-delay-200"></div>
          <div className="w-2 h-24 bg-voice-purple-500 animate-pulse-slow animation-delay-300"></div>
          <div className="w-2 h-16 bg-voice-purple-400 animate-pulse-slow animation-delay-400"></div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-voice-purple-200">
          404: Not Found
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto">
          Looks like this page didn’t hear you right. Let’s get you back to the conversation!
        </p>

        {/* Button */}
        <Link href="/">
          <p className="inline-block px-8 py-3 bg-voice-purple-500 hover:bg-voice-purple-600 rounded-full text-white font-semibold shadow-lg hover:shadow-voice-purple-700/50 transition-all duration-300">
            Return Home
          </p>
        </Link>
      </div>
    </div>
  );
}