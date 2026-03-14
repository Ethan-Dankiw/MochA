export enum SupportedLanguages {
    JAVASCRIPT = 'javascript',
    TYPESCRIPT = 'typescript',
    JAVA = 'java',
    CPP = 'c++',
    OBJECTIVE_C = "c",
    PYTHON = 'python',
}

export const getFileExtension = (language: SupportedLanguages): string | null => {
    switch (language) {
        case SupportedLanguages.JAVASCRIPT:
            return 'js';
        case SupportedLanguages.TYPESCRIPT:
            return 'ts';
        case SupportedLanguages.JAVA:
            return 'java';
        case SupportedLanguages.CPP:
            return 'cpp';
        case SupportedLanguages.OBJECTIVE_C:
            return 'c';
        case SupportedLanguages.PYTHON:
            return 'py';
        default:
            return null;
    }
}