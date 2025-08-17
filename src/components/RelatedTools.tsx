import { Tool } from "@/lib/types";
import ToolCard from "./ToolCard";
import SectionDivider from "./SectionDivider";

interface RelatedToolsProps {
    allTools: Tool[];
    currentTool: Tool;
}

export default function RelatedTools({ allTools, currentTool }: RelatedToolsProps) {
    const related = allTools.filter(tool => tool.category === currentTool.category && tool.id !== currentTool.id).slice(0, 3);

    if (related.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 mb-16">
            <SectionDivider />
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Related Tools</h2>
                <p className="text-muted-foreground mb-6">
                    Explore other tools in the <span className="font-semibold text-foreground">{currentTool.category}</span> category.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>
        </div>
    )
}
