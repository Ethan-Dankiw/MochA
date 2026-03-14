import React from "react";
import {SupportedLanguages} from "@/lib/types/languages";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button, buttonVariants} from "@/components/ui/button";
import {ChevronsUpDown} from "lucide-react";
import {useCode} from "@/components/contexts/code/CodeContext";

type Props = {
    className?: string;
}

export default function LanguageSelector(props: Readonly<Props>): React.ReactNode {
    // Get the language and update language function from the code context
    const {language, setLanguage} = useCode();

    // Convert the supported languages to a list of languages
    const languages = Object.values(SupportedLanguages) as SupportedLanguages[]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({
                variant: "default",
                className: "w-full h-full rounded-md! bg-primary! text-button-primary-foreground! hover:bg-button-primary-hover! hover:text-button-primary-foreground-hover!"
            })} asChild>
                <Button>
                    <span>{language}</span>
                    <ChevronsUpDown size={"icon"}/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
                {languages.map((lang) => (
                    <DropdownMenuItem className={"focus:bg-secondary"} key={lang} onClick={() => setLanguage(lang)}>
                        {lang}
                        <hr/>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
