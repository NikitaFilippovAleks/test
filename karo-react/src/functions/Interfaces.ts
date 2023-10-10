// Интерфейс продукта бара
export interface ConcessionItemInterface {
  id: number,
  image_main_url: null | string,
  name: string,
  price: string,
  description?: string,
  karo_points?: string,
  count?: number
}

// Интерфейс категории продуктов бара
export interface ConcessionItemsCategoryInteface {
  concession_items: Array<ConcessionItemInterface>,
  name: string
}

// Интерфейс стэйта продуктов бара
export interface ConcessionItemsStateInterface { 
  concessionItemsCategories: ConcessionItemsCategoryInteface[], 
  totalCount: number, 
  totalPrice: number 
}