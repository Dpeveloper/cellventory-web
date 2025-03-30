import { ProductRequest } from "../api/ProductService";

interface ProductFormProps {
    formData:ProductRequest;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isEditing: boolean;
}

export const ProductForm = ({ formData, onChange, onSubmit, onCancel, isEditing }: ProductFormProps) => {
    return (
        <div className="modal">
            <h2>{isEditing ? "Editar Producto" : "Agregar Producto"}</h2>
            <form onSubmit={onSubmit}>
                <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={onChange} />
                <input type="text" name="category" placeholder="Categoría" value={formData.category} onChange={onChange} />
                <input type="text" name="model" placeholder="Modelo" value={formData.model} onChange={onChange} />
                <input type="number" name="purchasePrice" placeholder="Precio de compra" value={formData.purchasePrice} onChange={onChange} />
                <input type="number" name="salePrice" placeholder="Precio Venta" value={formData.salePrice} onChange={onChange} />
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={onChange} />
                <input type="text" name="description" placeholder="Descripción" value={formData.description} onChange={onChange} />
                <button type="submit">{isEditing ? "Actualizar" : "Agregar"}</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </form>
        </div>
    );
};
