import "./Product.css"
import { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import CreateProduct from "./productMethod.jsx";
import { getProductsByShopId, deleteProduct } from "../../Api/sellerAPI.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import SellerMenu from "../../Components/SellerMenu.jsx";

const Product = () => {
  const { isAuthenticated, shopId, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated|| !shopId) {
      navigate("/login");
    } else {
        const fetchProducts = async () => {
            try {
            // Assuming you have a function to fetch products
            const data = await getProductsByShopId(shopId);
            setProducts(data);
            } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products. Please try again.");
            }
        };
        fetchProducts();
    }
  }, [isAuthenticated, shopId, navigate]);
    if (loading) {
        return <div>Loading...</div>;
    }

    const handleDeleteProduct = async (productId) => {
        try {
            // Assuming you have a function to delete products
            await deleteProduct(shopId, productId);
            setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            console.error("Error deleting product:", error);
            setError("Failed to delete product. Please try again.");
        }
    };

  return (
<div className="flex">
      <SellerMenu />
      <div className="product-container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#FFA50B]">All Products</h2>
          <button title="Add new product" onClick={() => setCreateProductOpen(true)}>Add New Product</button>
        </div>

        {loading && <div className="text-center py-10"><p className="text-gray-600">Loading products...</p></div>}
        {error && <div className="text-center py-10"><p className="text-red-500">{error}</p></div>}

        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <p className="mb-4">You do not have any products yet</p>
            <button title="Add your first product" onClick={() => setCreateProductOpen(true)}>Add Product</button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="table-header">
                <th className="table-cell">No.</th>
                <th className="table-cell">Products</th>
                <th className="table-cell">Quantity</th>
                <th className="table-cell">Price</th>
                <th className="table-cell">Category</th>
                <th className="table-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={p.id} className="table-row">
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell flex items-center justify-center gap-2">
                    {p.image && <img src={p.image} alt="product" className="product-image" />}
                    <span>{p.name}</span>
                  </td>
                  <td className="table-cell">{p.stock}</td>
                  <td className="table-cell">${typeof p.price === 'number' ? p.price.toFixed(2) : p.price}</td>
                  <td className="table-cell">
                    <div className="flex flex-wrap justify-center gap-1">
                      {Array.isArray(p.categories) ? p.categories.map((cat, idx) => (
                        <span key={idx} className="category-badge">{cat.name}</span>
                      )) : <span className="category-badge">{p.categories.name || 'Uncategorized'}</span>}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <button className="action-button edit-button" onClick={() => { setIsEditing(true); setCreateProductOpen(true); }}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="action-button delete-button" onClick={() => handleDeleteProduct(p.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <CreateProduct 
          isOpen={createProductOpen}
          onClose={() => setCreateProductOpen(false)}
          isEdit={isEditing}
          product={null}
        />
      </div>
    </div>
  );
};

export default Product;