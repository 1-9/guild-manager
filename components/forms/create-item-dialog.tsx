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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createItem } from "@/app/actions/item"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function CreateItemDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createItem(null, formData)

            if (result.errors) {
                Object.values(result.errors).forEach((errors) => {
                    if (errors) errors.forEach((e: string) => toast.error(e))
                })
                return
            }

            if (result.message.includes('Success')) {
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
                <Button variant="outline" className="border-dashed border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white">
                    <Plus className="w-4 h-4 mr-2" suppressHydrationWarning />
                    Forge Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Forge New Item</DialogTitle>
                    <DialogDescription className="text-white/50">
                        Add a new equipment piece to the warehouse.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-white/70">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Excalibur"
                            className="col-span-3 bg-white/5 border-white/10 text-white placeholder:text-white/20"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right text-white/70">
                            Type
                        </Label>
                        <Select name="type" required>
                            <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                <SelectItem value="WEAPON">Weapon</SelectItem>
                                <SelectItem value="ARMOR">Armor</SelectItem>
                                <SelectItem value="POTION">Potion</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rarity" className="text-right text-white/70">
                            Rarity
                        </Label>
                        <Select name="rarity" required>
                            <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select rarity" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                <SelectItem value="COMMON">Common</SelectItem>
                                <SelectItem value="EPIC">Epic</SelectItem>
                                <SelectItem value="LEGENDARY">Legendary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cost" className="text-right text-white/70">
                            Cost
                        </Label>
                        <Input
                            id="cost"
                            name="cost"
                            type="number"
                            defaultValue="100"
                            min="0"
                            className="col-span-3 bg-white/5 border-white/10 text-white"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-white/90">
                            {isPending ? 'Forging...' : 'Forge'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
