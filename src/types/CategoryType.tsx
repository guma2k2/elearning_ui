type CategoryType = {
    id: number
    name: string
    description?: string
    isPublish: boolean
    createdAt?: string
    updatedAt?: string
    parentId?: number,
}

type CategoryListGetType = {
    id: number
    name: string
    description?: string
    createdAt?: string
    updatedAt?: string
    isPublish: boolean
    childrens: CategoryType[]
}