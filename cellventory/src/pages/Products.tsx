import { useState, useEffect } from "react";
import { ProductTable } from "../components/ProductTable";
import { ProductForm } from "../components/ProductForm";
import { ProductInterface, ProductRequest, productService } from "../api/ProductService";

export const Products = () => {
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [formData, setFormData] = useState<ProductRequest>();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const data = await productService.getAll();
        setProducts(data);
    };

    const handleDelete = async (id: Number) => {
        await productService.delete(id);
        fetchProducts();
    };

    const handleEdit = (product: ProductInterface) => {
        setFormData(product);
        setIsEditing(true);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setFormData({ name: "", category: "", model: "", purchasePrice: 0, salePrice: 0, stock: 0, description: ""});
        setIsEditing(false);
        setIsFormOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            await productService.update(formData);
        } else {
            await productService.save(formData);
        }
        fetchProducts();
        setIsFormOpen(false);
    };

    return (
        <div>
            <button onClick={handleAdd}>Agregar Producto</button>
            <ProductTable products={products} onDelete={handleDelete} onEdit={handleEdit} />
            {isFormOpen && (
                <ProductForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                    isEditing={isEditing}
                />
            )}
        </div>
    );
};
