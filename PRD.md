# Project: Guild Manager MVP

## 1. Vision & Objective
Build a high-end, minimalist web interface for managing a Guild's warehouse and heroes. The goal is to track equipment distribution and hero status with maximum efficiency and a premium feel.

## 2. Tech Stack (Latest Versions)
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0 (or latest 3.x)
- **UI Components:** shadcn/ui (Radix UI)
- **Icons:** Lucide React
- **Database/ORM:** SQLite + Prisma ORM
- **Deployment:** Docker (Node.js Alpine)

## 3. Data Model (Prisma Schema)

### Hero
- `id`: Int (Primary Key)
- `name`: String
- `class`: String (e.g., Warrior, Mage)
- `level`: Int
- `items`: Item[] (Relationship)

### Item
- `id`: Int (Primary Key)
- `name`: String
- `type`: Enum (Weapon, Armor, Potion)
- `cost`: Int (Gold)
- `rarity`: Enum (Common, Epic, Legendary)
- `heroId`: Int (Foreign Key, Optional) - If null, item is in warehouse.

## 4. Functional Requirements

### 4.1 Warehouse & Hero Management (CRUD)
- Ability to create a Hero (Name, Class, Level).
- Ability to create an Item (Name, Type, Cost, Rarity).

### 4.2 Equipment Logic (Relations)
- Assign an Item to a specific Hero.
- **Constraint:** One item cannot be assigned to two heroes simultaneously.

### 4.3 Analytics & Tables
- Display a main Table of Heroes including:
  - Name, Class, Level.
  - **Equipment Value:** Total sum of `cost` for all items equipped by this hero.

### 4.4 Smart Filtering
- A dedicated widget/view showing only **Legendary** items that are currently **in the warehouse** (not assigned to any hero).

### 4.5 Action: "Wasted"
- A button labeled "Wasted" next to each hero.
- **Effect:**
  1. Remove all item associations from the hero (return items to warehouse).
  2. Delete the hero from the database.

## 5. UI/UX Guidelines (Minimalist & Premium)
- **Theme:** Dark mode by default or "Apple-style" clean light mode.
- **Typography:** Sans-serif (Inter or Geist).
- **Layout:** High whitespace, subtle borders (no heavy shadows), glassmorphism effects for cards.
- **Feedback:** Smooth transitions when assigning items or deleting heroes.

## 6. Technical Requirements
- **Docker:** Multi-stage build for a lightweight production image.
- **Architecture:** Keep it simple. Avoid over-engineering. One main dashboard with tabs or clear sections is preferred.