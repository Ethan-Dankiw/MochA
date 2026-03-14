// src/app/about/page.tsx
import React from "react";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}

      {/* Page Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-3xl text-center">
          <h1
            className="text-4xl font-bold mb-6"
            style={{ color: "var(--text-color)" }}
          >
            About AI Mock Technical Interviewer
          </h1>

          <p
            className="text-lg mb-6"
            style={{ color: "var(--text-color)" }}
          >
            This platform allows you to practice technical interviews with an AI-powered interviewer. 
            Receive instant feedback on your answers, improve your problem-solving skills, and 
            prepare for real technical interviews in a low-pressure environment.
          </p>

          <p
            className="text-lg mb-6"
            style={{ color: "var(--text-color)" }}
          >
            Built using Next.js, Tailwind CSS, and a custom Monaco code editor theme, our goal is 
            to provide a clean, interactive, and accessible experience for anyone looking to 
            improve their coding interview performance.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/interview"
              className="rounded-lg px-6 py-3 border font-medium"
              style={{
                borderColor: "var(--text-color)",
                color: "var(--text-color)",
              }}
            >
              Start Interview
            </Link>
            <Link
              href="/"
              className="rounded-lg px-6 py-3 text-white font-medium"
              style={{
                backgroundColor: "var(--text-color)",
              }}
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}