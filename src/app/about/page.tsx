// src/app/about/page.tsx
import React from "react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-primary">
            {/* Header */}

            {/* Page Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="max-w-3xl text-center">
                    <h1
                        className="text-4xl font-bold mb-6"
                        style={{color: "var(--text-color)"}}
                    >
                        About AI Mock Technical Interviewer
                    </h1>

                    <p
                        className="text-lg mb-6"
                        style={{color: "var(--text-color)"}}
                    >
                        This platform allows you to practice technical interviews with an AI-powered interviewer.
                        Receive instant feedback on your answers, improve your problem-solving skills, and
                        prepare for real technical interviews in a low-pressure environment.
                    </p>

                    <p
                        className="text-lg mb-6"
                        style={{color: "var(--text-color)"}}
                    >
                        Built using Next.js, Tailwind CSS, and a custom Monaco code editor theme, our goal is
                        to provide a clean, interactive, and accessible experience for anyone looking to
                        improve their coding interview performance.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/chooseinterview"
                            className="rounded-lg border font-medium border-button-primary-foreground px-6 py-3 hover:bg-button-primary"
                        >
                            Start Interview
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}