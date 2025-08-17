
export default function SectionDivider() {
    return (
        <div className="relative w-full max-w-3xl mx-auto my-16 pl-7 overflow-x-hidden md:pl-0">
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent to-white md:from-white dark:from-transparent dark:to-neutral-950 md:dark:from-neutral-950 md:via-transparent md:dark:via-transparent md:to-white md:dark:to-neutral-950"></div>
            <div className="w-full h-px border-t border-dashed border-neutral-300 dark:border-neutral-600"></div>
        </div>
    );
}
