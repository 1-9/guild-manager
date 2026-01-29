'use client'

import { Button } from "@/components/ui/button"
import { wastedHero } from "@/app/actions/hero"
import { useTransition } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export function HeroCardActions({ heroId }: { heroId: number }) {
    const [isPending, startTransition] = useTransition()

    function handleWasted() {
        startTransition(async () => {
            const result = await wastedHero(heroId)
            if (result.message.includes('Wasted')) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleWasted}
            disabled={isPending}
            className="text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            title="Wasted"
        >
            <Trash2 className="w-4 h-4" suppressHydrationWarning />
        </Button>
    )
}
