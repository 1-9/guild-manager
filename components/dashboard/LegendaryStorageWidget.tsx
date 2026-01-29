
import { getUnassignedLegendaryItems } from "@/app/actions/item"
import { GlassCard } from "@/components/ui/glass-card"

import { Item } from "@prisma/client"

export async function LegendaryStorageWidget() {
    const items = await getUnassignedLegendaryItems()

    return (
        <GlassCard className="h-full flex flex-col w-full border-amber-500/30 bg-amber-950/10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                    Legendary Vault
                </h2>
                <span className="px-2 py-1 text-xs font-semibold text-amber-300 bg-amber-500/20 rounded-full border border-amber-500/30">
                    {items.length} Items
                </span>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[200px] space-y-3 pr-2 custom-scrollbar">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/60 p-4 text-center">
                        <p className="text-sm">The vault is empty.</p>
                        <p className="text-xs mt-1">Collect legendary items to store them here.</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-amber-500/10 hover:border-amber-500/30 transition-colors group"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-amber-100 group-hover:text-amber-50 transition-colors">
                                    {item.name}
                                </span>
                                <span className="text-xs text-amber-500/70 capitalize">
                                    {item.type.toLowerCase()}
                                </span>
                            </div>
                            <div className="text-sm font-semibold text-amber-300">
                                {item.cost} G
                            </div>
                        </div>
                    ))
                )}
            </div>
        </GlassCard>
    )
}
