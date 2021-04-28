interface Food {
  id: number
  name: string
  description: string
  price: string
  available: boolean
  image: string
}

type FoodForm = Omit<Food, 'id' | 'available'>