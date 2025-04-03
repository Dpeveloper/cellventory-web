import axios from "axios";

const baseUrl = "http://localhost:8080/products";

export interface ProductInterface {
    id: number;
    name: string;
    category: string;
    model: string;
    purchasePrice: number;
    salePrice: number;
    stock: number;
    description: string;
}

export interface ProductRequest {
    name?: string;
    category?: string;
    model?: string;
    purchasePrice?: number;
    salePrice?: number;
    stock?: number;
    description?: string;
}



export const productService = {
    getAll: async () => {
        try{
            const response = await fetch(`${baseUrl}/all`);
            return await response.json();
        }catch(error){
            console.error("Error al obtener todos los productos.", error);
        }
        
    },

    findById: async (id: number) => {
        const response = await fetch(`${baseUrl}/${id}`);
        return response.json();
    },

    save: async (product: ProductRequest): Promise<ProductInterface | undefined> => {
        try {
            const response = await axios.post(`${baseUrl}/save`, product);
            return response.data;
        } catch (error) {
            console.error("Error al guardar el producto.", error);
        }
    },

    delete: async (id: Number) => {
        try{
            const response = await axios.delete(`${baseUrl}/${id}`);
            return response.data;
        }catch(error){
            console.error("Error al eliminar el producto.", error);
        }
        
    },

    update: async (id:Number, product:ProductRequest): Promise<ProductInterface | undefined> => {
        try{
            const response = await axios.put(`${baseUrl}/${id}`, product);
            return response.data;
        }catch(error){
            console.error("Error al actualizar el producto.", error);
        }
        
    },
};
