'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ItemType, ItemRarity } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const createItemSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    type: z.nativeEnum(ItemType),
    cost: z.coerce.number().min(0, "Cost must be a positive number"),
    rarity: z.nativeEnum(ItemRarity),
})

export async function createItem(prevState: any, formData: FormData) {
    const validatedFields = createItemSchema.safeParse({
        name: formData.get('name'),
        type: formData.get('type'),
        cost: formData.get('cost'),
        rarity: formData.get('rarity'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Item.',
        }
    }

    const { name, type, cost, rarity } = validatedFields.data

    try {
        await prisma.item.create({
            data: {
                name,
                type,
                cost,
                rarity,
            },
        })
        revalidatePath('/')
        return { message: 'Item created successfully!' }
    } catch (error) {
        return { message: 'Database Error: Failed to Create Item.' }
    }
}

export async function assignItem(heroId: number, itemId: number) {
    try {
        // Enforce constraint: One item cannot be assigned to two heroes simultaneously.
        // Prisma's foreign key ensures an item only has ONE heroId, so assigning it to a new heroId
        // correctly "moves" it. We don't need extra logic if we just update.

        await prisma.item.update({
            where: { id: itemId },
            data: { heroId }
        })
        revalidatePath('/')
        return { message: 'Item equipped!' }
    } catch (error) {
        return { message: 'Failed to equip item.' }
    }
}

export async function unequipItem(itemId: number) {
    try {
        await prisma.item.update({
            where: { id: itemId },
            data: { heroId: null }
        })
        revalidatePath('/')
        return { message: 'Item unequipped!' }
    } catch (error) {
        return { message: 'Failed to unequip item.' }
    }
}

export async function getUnassignedLegendaryItems() {
    try {
        const items = await prisma.item.findMany({
            where: {
                rarity: ItemRarity.LEGENDARY,
                heroId: null
            },
            orderBy: {
                name: 'asc'
            }
        })
        return items
    } catch (error) {
        console.error("Failed to fetch legendary items:", error)
        return []
    }
}
