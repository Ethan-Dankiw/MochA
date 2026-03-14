import { getUserById, getUserProgress } from "@/lib/database/userquery";
import { notFound } from "next/navigation";
import SkillTree from "@/components/profile/skilltree";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    // 1. Properly await and decode params
    const { id } = await params;
    
    // 2. Resolve User - The "Guard" that prevents 'possibly null' errors
    console.log("Current ID Segment:", id);

    const userData = await getUserById(id); 
    if (!userData) { 
        console.log("Database lookup failed for ID:", id);
        return notFound();
    }

    // 3. Fetch progress using the ID we just found
    const progress = await getUserProgress(userData.id);
    if (!progress) {
        console.log("Progress records missing for User ID:", userData.id);
        return notFound();
    }

    // Get Recent Sessions Interview Data from 
    const recent = progress.recent_sessions;
    const count = recent.length;

    // 4. Map DB Columns to SkillTree Nodes
    // We divide by 100 because the DB stores 0-100, but SVG math uses 0-1
    const skillScores = {
        algo: count ? recent.reduce((acc, s) => acc + ((s as any).algorithm_score || 0), 0) / count / 100 : 0,
        complexity: count ? recent.reduce((acc, s) => acc + ((s as any).complexity_score || 0), 0) / count / 100 : 0,
        confirmation: count ? recent.reduce((acc, s) => acc + ((s as any).confirm_question_score || 0), 0) / count / 100 : 0,
        coding: count ? recent.reduce((acc, s) => acc + ((s as any).coding_score || 0), 0) / count / 100 : 0,
        behavioural: count ? recent.reduce((acc, s) => acc + ((s as any).behavioural_score || 0), 0) / count / 100 : 0,
        testing: count ? recent.reduce((acc, s) => acc + ((s as any).testing_score || 0), 0) / count / 100 : 0,
    };

    return (
        <div className="p-32 max-w-7xl mx-auto min-h-screen bg-background text-foreground font-sans antialiased">
    
            <header className="mb-24">
                <h1 className="text-5xl font-normal tracking-tight">
                    {progress.user.name || "Candidate"} <span className="text-muted-foreground font-light"> Statistics</span>
                </h1>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Stats Section - Using rounded pill containers */}
                <div className="lg:col-span-4 space-y-10">
                    <section className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-mono text-muted-foreground/60 lowercase pl-1">sessions</p>
                            <div className="inline-flex items-center px-6 py-3 rounded-full bg-secondary/30 border border-border/50 w-fit">
                                <span className="text-4xl font-light tracking-tighter tabular-nums text-foreground">
                                    {progress.total_interviews}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-mono text-muted-foreground/60 lowercase pl-1">pass rate</p>
                            <div className="inline-flex items-center px-6 py-3 rounded-full bg-button-primary/10 border border-button-primary/20 w-fit">
                                <span className="text-4xl font-light tracking-tighter text-button-primary tabular-nums">
                                    {progress.total_interviews > 0 
                                        ? Math.round((progress.interviews_passed / progress.total_interviews) * 100) 
                                        : 0}%
                                </span>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Matrix Section - Clean, Rounded Bento Card */}
                <div className="lg:col-span-8 p-12 bg-card/20 rounded-[2.5rem] border border-border/40 flex items-center justify-center relative group transition-all duration-700 hover:bg-card/30">
                    <div className="absolute top-8 left-10 flex items-center gap-2">
                    </div>
                    
                    <div className="py-8">
                        <SkillTree scores={skillScores} />
                    </div>

                    {/* Subtle aesthetic touch matching your Creme light mode */}
                    <div className="absolute bottom-8 right-10">
                        <div className="h-1.5 w-1.5 rounded-full bg-button-primary opacity-30" />
                    </div>
                </div>
            </div>
        </div>
    );
}