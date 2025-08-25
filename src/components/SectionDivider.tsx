
export default function SectionDivider() {
    return (
        <div className="relative my-16" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-border" style={{
                    maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                }}/>
            </div>
        </div>
    );
}
