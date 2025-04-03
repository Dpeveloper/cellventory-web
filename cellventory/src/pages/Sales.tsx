import React, { useEffect, useState } from "react";
import { SaleInterface, SaleRequest, saleService } from "../api/saleService";
import { SaleDetailRequest } from "../api/saleDetailService";
import { ProductInterface, productService } from "../api/productService";

export const Sales = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [sales, setSales] = useState<SaleInterface[]>([]);
  const [clientName, setClientName] = useState('');
  const [status, setStatus] = useState('PENDIENTE');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<ProductInterface[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductInterface | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [saleDetailList, setSaleDetailList] = useState<SaleDetailRequest[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await productService.getAll();
      setProducts(data);
    };
    const loadSales = async () => {
      const data = await saleService.getAll();
      setSales(data);
    };
    loadProducts();
    loadSales();
  }, []);

  useEffect(() => {
    const newTotal = saleDetailList.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      return acc + (product ? product.salePrice * item.quantity : 0);
    }, 0);
    setTotal(newTotal);
  }, [saleDetailList, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedProduct(null);

    if (value.length === 0) {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSelectProduct = (product: ProductInterface) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setFilteredProducts([]);
  };

  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0) return;

    const existing = saleDetailList.find(item => item.productId === selectedProduct.id);
    if (existing) {
      setSaleDetailList(saleDetailList.map(item =>
        item.productId === selectedProduct.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newDetail: SaleDetailRequest = {
        productId: selectedProduct.id,
        quantity
      };
      setSaleDetailList([...saleDetailList, newDetail]);
    }

    setSelectedProduct(null);
    setSearchTerm('');
    setQuantity(1);
  };

  const handleSaveSale = async () => {
    if (!clientName || saleDetailList.length === 0) return;

    const formData: SaleRequest = {
      clientName,
      status,
      saleDetailList
    };

    await saleService.save(formData);
    setClientName('');
    setStatus('FINALIZADA');
    setSaleDetailList([]);
    setTotal(0);
    setSearchTerm('');
  };

  return (
    <div>
      <h2>Registrar Venta</h2>

      <input
        type="text"
        placeholder="Nombre del cliente"
        value={clientName}
        onChange={e => setClientName(e.target.value)}
      />

      <div>
        <input
          type="text"
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {filteredProducts.length > 0 && (
          <ul>
            {filteredProducts.map(product => (
              <li key={product.id} onClick={() => handleSelectProduct(product)}>
                {product.name} - ${product.salePrice}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={e => setQuantity(parseInt(e.target.value))}
      />

      <button onClick={handleAddProduct}>Agregar producto</button>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {saleDetailList.map(item => {
            const product = products.find(p => p.id === item.productId);
            return (
              <tr key={item.productId}>
                <td>{product?.name}</td>
                <td>{item.quantity}</td>
                <td>${product?.salePrice}</td>
                <td>${product ? product.salePrice * item.quantity : 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p>Total: ${total}</p>

      <button onClick={handleSaveSale}>Guardar venta</button>
    </div>
  );
};
