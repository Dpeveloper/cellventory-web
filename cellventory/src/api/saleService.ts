import axios from "axios";
import { SaleDetailInterface, SaleDetailRequest } from "./saleDetailService";
const baseUrl = "http://localhost:8080/sales";

export interface SaleInterface{
    id: number,
    saleDate: Date,
    clientName: string,
    total: number,
    status: string,
    saleDetailList: SaleDetailInterface[]
}

export interface SaleRequest{
    clientName: string,
    status: string,
    saleDetailList: SaleDetailRequest[]
}

export const saleService = {
    getAll: async () => {
        try {
            const response = await fetch(baseUrl);
            return await response.json(); // Corregido
        } catch (error) {
            console.error("Error al obtener todas las ventas.", error);
            return null;
        }
    },

    save: async (saleRequest: SaleRequest) => {
        try {
            const response = await axios.post(baseUrl, saleRequest);
            return response.data;
        } catch (error) {
            console.error("Error al guardar la venta.", error);
            return null;
        }
    },

    update: async (id: number, saleRequest: SaleRequest) => { 
        try {
            const response = await axios.put(`${baseUrl}/${id}`, saleRequest);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar la venta.", error);
            return null;
        }
    },

    delete: async (id: number) =>{
        try{
            const response = await axios.delete(baseUrl);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar la venta.", error);
            return null;
        }
    },

};
