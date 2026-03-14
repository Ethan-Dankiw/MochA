// utils/confetti.ts
import confetti from "canvas-confetti";

export const fireConfetti = (element?: HTMLElement) => {
    if (!element) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.5 }
        });
        return;
    }

    const rect = element.getBoundingClientRect();
    confetti({
        particleCount: 100,
        spread: 70,
        origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
        },
    });
};