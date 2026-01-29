import { prisma } from "@/lib/prisma"
import { GlassCard } from "@/components/ui/glass-card"
import { CreateHeroDialog } from "@/components/forms/create-hero-dialog"
import { CreateItemDialog } from "@/components/forms/create-item-dialog"
import { HeroCardActions } from "@/components/hero/hero-card-actions"
import { EquipDialog } from "@/components/hero/equip-dialog"
import { unequipItem } from "./actions/item"
import { X } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const heroes = await prisma.hero.findMany({
    include: { items: true },
    orderBy: { level: 'desc' }
  })

  const warehouseItems = await prisma.item.findMany({
    where: { heroId: null },
    orderBy: { cost: 'desc' }
  })

  // Calculate some stats
  const totalValue = [...heroes.flatMap(h => h.items), ...warehouseItems]
    .reduce((sum, item) => sum + item.cost, 0);

  return (
    <main className="min-h-screen p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50">
            Guild Manager
          </h1>
          <p className="text-white/40 mt-2 font-light">Inventory & Hero Tracking System</p>
        </div>
        <div className="flex gap-4 items-center">
          <CreateHeroDialog />
          <CreateItemDialog />
        </div>
      </header>

      {/* Overview Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-widest">Active Heroes</h3>
          <p className="text-5xl font-light mt-4 text-white">{heroes.length}</p>
        </GlassCard>
        <GlassCard>
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-widest">Warehouse Items</h3>
          <p className="text-5xl font-light mt-4 text-white">{warehouseItems.length}</p>
        </GlassCard>
        <GlassCard>
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-widest">Guild Assets</h3>
          <p className="text-5xl font-light mt-4 text-emerald-400/90">{totalValue.toLocaleString()} <span className="text-lg text-white/30">Gold</span></p>
        </GlassCard>
      </section>

      {/* Heroes Roster */}
      <section className="space-y-6">
        <h2 className="text-2xl font-light text-white/80">Roster</h2>
        <div className="grid gap-4">
          {heroes.map(hero => (
            <GlassCard key={hero.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                            ${hero.class === 'WARRIOR' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}
                        `}>
                  {hero.class === 'WARRIOR' ? 'W' : 'M'}
                </div>
                <div>
                  <div className="text-xl font-medium text-white group-hover:text-white transition-colors">{hero.name}</div>
                  <div className="text-sm text-white/40 flex gap-2 items-center">
                    <span>Level {hero.level}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span>{hero.class}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span className="text-white/60">
                      Eq. Value: <span className="font-mono text-emerald-400/80">{hero.items.reduce((sum, i) => sum + i.cost, 0)}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end items-center">
                <div className="flex flex-wrap gap-2 mr-4">
                  {hero.items.length === 0 && <span className="text-xs text-white/20 italic p-2">No equipment</span>}
                  {hero.items.map(item => (
                    <form key={item.id} action={async () => {
                      'use server'
                      await unequipItem(item.id)
                    }}>
                      <button type="submit" className={`px-3 py-1.5 rounded-lg text-xs border backdrop-blur-md flex items-center gap-2 hover:bg-red-500/10 hover:border-red-500/30 transition-colors cursor-pointer group/item
                                        ${item.rarity === 'LEGENDARY' ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                          item.rarity === 'EPIC' ? 'bg-purple-500/10 border-purple-500/20 text-purple-200' :
                            'bg-slate-500/10 border-white/5 text-slate-300'}
                                    `}>
                        {item.name}
                        <X className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" suppressHydrationWarning />
                      </button>
                    </form>
                  ))}
                  <EquipDialog heroId={hero.id} availableItems={warehouseItems} />
                </div>
                <div className="border-l border-white/10 pl-4">
                  <HeroCardActions heroId={hero.id} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Warehouse Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-light text-white/80">Warehouse</h2>
          <div className="text-sm text-white/30">Showing inventory</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {warehouseItems.map(item => (
            <GlassCard key={item.id} className="relative overflow-hidden group min-h-[140px] flex flex-col justify-between p-5">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="font-medium text-white/90 truncate" title={item.name}>{item.name}</div>
                <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{item.type}</div>
              </div>

              <div className="flex justify-between items-end mt-4">
                <div className="text-sm text-white/60 font-mono">{item.cost}</div>
                {item.rarity !== 'COMMON' && (
                  <div className={`text-[10px] px-1.5 py-0.5 rounded border
                                ${item.rarity === 'LEGENDARY' ? 'border-amber-500/30 text-amber-500' : 'border-purple-500/30 text-purple-500'}
                             `}>
                    {item.rarity[0]}
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
          {/* Placeholders for visual balance if few items */}
          {Array.from({ length: Math.max(0, 5 - warehouseItems.length) }).map((_, i) => (
            <div key={i} className="border border-white/5 rounded-xl border-dashed bg-white/[0.02] flex items-center justify-center p-6 min-h-[140px]">
              <span className="text-white/10 text-2xl">+</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
