
import { Diamond } from 'lucide-react';

export default function SectionDivider() {
    return (
        <div className="relative flex items-center justify-center my-16" aria-hidden="true">
            <div className="flex-grow border-t border-dashed border-border" style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)'
            }}></div>
            <span className="flex-shrink-0 bg-background px-4 text-muted-foreground">
                <Diamond className="h-5 w-5" />
            </span>
            <div className="flex-grow border-t border-dashed border-border" style={{
                maskImage: 'linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 100%)'
            }}></div>
        </div>
    );
}
