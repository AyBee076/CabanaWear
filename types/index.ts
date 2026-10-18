import type { ReactNode } from "react"

// Data Types
export type Model = {
  id: number
  name: string
  description: string
  images: string[]
  category: string
  price: number
  size: string[]
  fit: string
  fabric: string
  stock: number
  color: string
}


export type PriceRange = "All" | "Under $10" | "$10 - $20" | "$20 - $40" | "Over $40"

export type FilterState = {
  category: string
  price: PriceRange
  colors: string[]
}

// @/types/index.ts
export type SidebarProps = {
  onFilter?: (filters: FilterState) => void
}

export type Category = {
    displayName: string
    slug: string
}

export type CategoriesData = {
    categories: Category[]
}

export type GetModelsParams = {
    category?: string
}

export type ModelsPageProps = {
    searchParams: {
        query?: string
    }
}

// Page Types
export type CategoryPageProps ={
    params: Promise<{
        categoryName: string
    }>
}

export type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>

export type ModelDetailPageProps = {
    params: Promise<{
        id: string
    }>
}

// Components Types
export type ModelCardProps = {
  model: Model
  section?: string
}

export type ModelsGridProps = {
  title: string
  models: Model[]
  section?: string
}

export type PillProps = {
    children: ReactNode
    className?: string
}

export type NavLinkProps = {
    href: string
    children: ReactNode
    isActive?: boolean
}