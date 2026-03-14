"use client"

import React from 'react';
import {QuestionDifficulty} from "@/lib/types/difficulty";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button, buttonVariants} from "@/components/ui/button";
import {ChevronsUpDown} from "lucide-react";
import {useLLM} from "@/components/contexts/llm/LLMContext";

type Props = {
    className?: string;
}

export default function DifficultySelect(props: Readonly<Props>): React.ReactNode {
    // Get the selected difficulty and selector function
    const {difficulty, setDifficulty} = useLLM()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({
                variant: "default",
                className: "w-full h-full rounded-md! bg-primary! text-button-primary-foreground! hover:bg-button-primary-hover! hover:text-button-primary-foreground-hover!"
            })} asChild>
                <Button>
                    <span>{difficulty} Question</span>
                    <ChevronsUpDown size={"icon"}/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background rounded-sm">
                <DropdownMenuItem className={"focus:bg-secondary"} onClick={() => setDifficulty(QuestionDifficulty.HARD)}>
                    <span>{QuestionDifficulty.HARD} Question</span>
                    <hr/>
                </DropdownMenuItem>
                <DropdownMenuItem className={"focus:bg-secondary"} onClick={() => setDifficulty(QuestionDifficulty.MEDIUM)}>
                    <span>{QuestionDifficulty.MEDIUM} Question</span>
                    <hr/>
                </DropdownMenuItem>
                <DropdownMenuItem className={"focus:bg-secondary"} onClick={() => setDifficulty(QuestionDifficulty.EASY)}>
                    <span>{QuestionDifficulty.EASY} Question</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}