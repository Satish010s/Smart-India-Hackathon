"use client";

import React from "react";

import Navbar from "./Navbar";
import Hero from "./Hero";
import ProblemSolution from "./ProblemSolution";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import InteractiveBuilder from "./InteractiveBuilder";
import SimulationVisuals from "./SimulationVisuals";
import AITutor from "./AITutor";
import LearningPath from "./LearningPath";
import ChallengesAndEcosystem from "./ChallengesAndEcosystem";
import ForInstructors from "./ForInstructors";
import Backends from "./Backends";
import SocialProof from "./SocialProof";
import FAQ from "./FAQ";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-300 overflow-hidden font-sans">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <InteractiveBuilder />
        <SimulationVisuals />
        <AITutor />
        <LearningPath />
        <ChallengesAndEcosystem />
        <ForInstructors />
        <Backends />
        <SocialProof />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

