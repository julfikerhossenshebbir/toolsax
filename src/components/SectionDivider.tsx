
import { Diamond } from 'lucide-react';

export default function SectionDivider() {
    return (
        <div className="relative my-16">
            <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
            >
                <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-background px-4 text-muted-foreground">
                    <Diamond className="h-5 w-5" />
                </span>
            </div>
        </div>
    );
}
