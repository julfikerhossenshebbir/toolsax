
export default function SectionDivider() {
    return (
        <div className="relative py-16" aria-hidden="true">
            <div className="absolute inset-x-0 h-px w-full bg-transparent" style={{
                maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            }}>
                <div 
                    className="h-full w-full"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(to right, hsl(var(--border)), hsl(var(--border)) 4px, transparent 4px, transparent 8px)',
                        height: '2px'
                    }}
                />
            </div>
        </div>
    );
}
