
import { Tool } from "@/lib/types";
import ToolCard from "./ToolCard";
import SectionDivider from "./SectionDivider";

interface RelatedToolsProps {
    relatedTools: Tool[];
    currentTool: Tool;
    originalIndexMap: Map<string, number>;
}

export default function RelatedTools({ relatedTools, currentTool, originalIndexMap }: RelatedToolsProps) {
    if (relatedTools.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 mb-16">
            <SectionDivider />
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Related Tools</h2>
                <p className="text-muted-foreground mb-6">
                    Explore other tools in the <span className="font-semibold text-foreground">{currentTool.category}</span> category.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTools.map(tool => (
                    <ToolCard 
                        key={tool.id} 
                        tool={tool}
                        index={originalIndexMap.get(tool.id) ?? 0}
                    />
                ))}
            </div>
        </div>
    )
}
