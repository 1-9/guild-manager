import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    clickable?: boolean
}

export function GlassCard({ children, className, clickable, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-panel rounded-xl p-6 transition-all duration-300",
                clickable && "glass-card-hover cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
