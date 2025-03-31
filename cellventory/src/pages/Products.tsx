import type React from "react"

import { useState, useEffect } from "react"
import { ProductTable } from "../components/ProductTable"
import { ProductForm } from "../components/ProductForm"
import { type ProductInterface, type ProductRequest, productService } from "../api/productService"
import { Plus, RefreshCw } from "lucide-react"

export const Products = () => {
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [formData, setFormData] = useState<ProductRequest>({
    name: "",
    category: "",
    model: "",
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
    description: "",
  })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    try {
      await productService.delete(id)
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (product: ProductInterface) => {
    setFormData({
      name: product.name,
      category: product.category,
      model: product.model,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      stock: product.stock,
      description: product.description,
    })
    setEditingId(product.id)
    setIsEditing(true)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setFormData({ name: "", category: "", model: "", purchasePrice: 0, salePrice: 0, stock: 0, description: "" })
    setEditingId(null)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "number" ? Number.parseFloat(e.target.value) : e.target.value

    setFormData((prevData) => ({
      ...prevData!,
      [e.target.name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData) return

    setIsLoading(true)

    try {
      if (isEditing && editingId !== null) {
        const updatedProduct = await productService.update(editingId, formData)

        if (updatedProduct != null) {
          setProducts(products.map((p) => (p.id === editingId ? updatedProduct : p)))
        }
      } else {
        const newProduct = await productService.save(formData)

        if (newProduct != null) {
          setProducts([...products, newProduct])
        }
      }

      setIsFormOpen(false)
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="mt-1 text-sm text-gray-500">Administra tu inventario de productos de manera eficiente</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            disabled={isLoading}
            className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            Agregar Producto
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Inventario de Productos</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{products.length} productos en total</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <ProductTable products={products} onDelete={handleDelete} onEdit={handleEdit} />
        </div>
      </div>

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
  )
}

