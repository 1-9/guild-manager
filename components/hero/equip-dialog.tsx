'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { assignItem } from "@/app/actions/item"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Shirt, Sword } from "lucide-react" // Icons as triggers
import { Item } from "@prisma/client"

interface EquipDialogProps {
    heroId: number
    availableItems: Item[]
}

export function EquipDialog({ heroId, availableItems }: EquipDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        const itemId = formData.get('itemId')
        if (!itemId) return

        startTransition(async () => {
            const result = await assignItem(heroId, parseInt(itemId.toString()))

            if (result.message.includes('equipped')) {
                toast.success(result.message)
                setOpen(false)
            } else {
                toast.error(result.message)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full border border-dashed border-white/20 hover:border-white/50 text-white/20 hover:text-white">
                    <span className="sr-only">Equip</span>
                    <span className="text-xs">+</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Equip Item</DialogTitle>
                    <DialogDescription className="text-white/50">
                        Select an item from the warehouse to equip.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-4">
                        <Select name="itemId" required>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select item..." />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                {availableItems.length === 0 ? (
                                    <SelectItem value="none" disabled>Warehouse is empty</SelectItem>
                                ) : (
                                    availableItems.map(item => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                            {item.name} ({item.type}) - {item.cost}g
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending || availableItems.length === 0} className="bg-white text-black hover:bg-white/90">
                            {isPending ? 'Equipping...' : 'Equip'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
