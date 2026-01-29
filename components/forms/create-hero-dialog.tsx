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
import { createHero } from "@/app/actions/hero"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function CreateHeroDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createHero(null, formData)

            if (result.errors) {
                Object.values(result.errors).forEach((errors) => {
                    if (errors) errors.forEach((e: string) => toast.error(e))
                })
                return
            }

            if (result.message.includes('successfully')) {
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
                    Recruit Hero
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Recruit New Hero</DialogTitle>
                    <DialogDescription className="text-white/50">
                        Add a new champion to your guild roster.
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
                            placeholder="Aragorn"
                            className="col-span-3 bg-white/5 border-white/10 text-white placeholder:text-white/20"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class" className="text-right text-white/70">
                            Class
                        </Label>
                        <Select name="class" required>
                            <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                <SelectItem value="WARRIOR">Warrior</SelectItem>
                                <SelectItem value="MAGE">Mage</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="level" className="text-right text-white/70">
                            Level
                        </Label>
                        <Input
                            id="level"
                            name="level"
                            type="number"
                            defaultValue="1"
                            min="1"
                            max="100"
                            className="col-span-3 bg-white/5 border-white/10 text-white"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-white/90">
                            {isPending ? 'Recruiting...' : 'Recruit'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
