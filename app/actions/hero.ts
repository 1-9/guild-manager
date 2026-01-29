'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { HeroClass } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const createHeroSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    class: z.nativeEnum(HeroClass),
    level: z.coerce.number().min(1, "Level must be at least 1").max(100),
})

export async function createHero(prevState: any, formData: FormData) {
    const validatedFields = createHeroSchema.safeParse({
        name: formData.get('name'),
        class: formData.get('class'),
        level: formData.get('level'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Hero.',
        }
    }

    const { name, class: heroClass, level } = validatedFields.data

    try {
        await prisma.hero.create({
            data: {
                name,
                class: heroClass,
                level,
            },
        })
        revalidatePath('/')
        return { message: 'Hero created successfully!' }
    } catch (error) {
        return { message: 'Database Error: Failed to Create Hero.' }
    }
}

export async function wastedHero(heroId: number) {
    try {
        // 1. Unassign all items (return to warehouse)
        await prisma.item.updateMany({
            where: { heroId },
            data: { heroId: null }
        })

        // 2. Delete the hero
        await prisma.hero.delete({
            where: { id: heroId }
        })

        revalidatePath('/')
        return { message: 'Hero Wasted!' }
    } catch (error) {
        return { message: 'Database Error: Failed to Waste Hero.' }
    }
}
