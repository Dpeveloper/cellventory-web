import { useState } from "react";
import { ProductInterface } from "../api/ProductService";

interface ProductTableProps {
    products: ProductInterface[];
    onDelete: (id: Number) => void;
    onEdit: (product: ProductInterface) => void;
}

export const ProductTable = ({ products, onDelete, onEdit }: ProductTableProps) => {
    const [search, setSearch] = useState("");

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table border={1}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Modelo</th>
                        <th>Precio Venta</th>
                        <th>Stock</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.model}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.model}</td>
                            <td>{product.salePrice}</td>
                            <td>{product.stock}</td>
                            <td>{product.description}</td>
                            <td>
                                <button onClick={() => onEdit(product)}>Editar</button>
                                <button onClick={() => onDelete(product.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
