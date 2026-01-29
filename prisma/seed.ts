import { PrismaClient, ItemType, ItemRarity, HeroClass } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

async function main() {
    console.log('Seeding database...')

    // Clear existing data
    await prisma.item.deleteMany()
    await prisma.hero.deleteMany()

    // Create Heroes
    const aragorn = await prisma.hero.create({
        data: {
            name: 'Aragorn',
            class: HeroClass.WARRIOR,
            level: 10,
        },
    })

    const gandalf = await prisma.hero.create({
        data: {
            name: 'Gandalf',
            class: HeroClass.MAGE,
            level: 20,
        },
    })

    await prisma.hero.create({
        data: {
            name: 'Boromir',
            class: HeroClass.WARRIOR,
            level: 8,
        },
    })

    // Create Items
    await prisma.item.create({
        data: {
            name: 'Andúril',
            type: ItemType.WEAPON,
            cost: 5000,
            rarity: ItemRarity.LEGENDARY,
            // In Warehouse (no heroId)
        }
    })

    await prisma.item.create({
        data: {
            name: 'Dragon Scale Armor',
            type: ItemType.ARMOR,
            cost: 1500,
            rarity: ItemRarity.EPIC,
            // In Warehouse
        }
    })

    await prisma.item.create({
        data: {
            name: 'Minor Health Potion',
            type: ItemType.POTION,
            cost: 50,
            rarity: ItemRarity.COMMON,
            // In Warehouse
        }
    })

    // Assign items to heroes
    await prisma.item.create({
        data: {
            name: 'Staff of Light',
            type: ItemType.WEAPON,
            cost: 800,
            rarity: ItemRarity.EPIC,
            heroId: gandalf.id
        }
    })

    await prisma.item.create({
        data: {
            name: 'Steel Sword',
            type: ItemType.WEAPON,
            cost: 100,
            rarity: ItemRarity.COMMON,
            heroId: aragorn.id
        }
    })

    console.log('Seed data created.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
