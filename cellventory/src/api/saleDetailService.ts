export interface SaleDetailInterface{
    id: number,
    quantity: number,
    price: number,
    subtotal: number
}

export interface SaleDetailRequest{
    productId: number,
    quantity: number
}
