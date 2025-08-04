import "./productMethod.css";
import { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { createProduct, getCategories, updateProduct } from "../../Api/sellerAPI.jsx";
import PropTypes from "prop-types";

const CreateProduct = ({ isOpen, onClose, isEdit, product }) => {
  const { isAuthenticated, shopId } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    type: "product",
    description: "",
    price: "",
    categoryId: [],
    stock: "",
    image: null,
  });

  // Populate productData when editing
  useEffect(() => {
    if (isEdit && product) {
      setProductData({
        name: product.name || "",
        type: product.type || "product",
        description: product.description || "",
        price: product.price || "",
        categoryId: product.categoryId || [],
        stock: product.stock || "",
        image: product.image || null,
      });
    }
  }, [isEdit, product]);

  useEffect(() => {
    if (!isAuthenticated || !shopId) {
      navigate("/login");
    } else {
      const fetchCategories = async () => {
        try {
          const data = await getCategories(shopId);
          setCategories(data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, [isAuthenticated, shopId, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductData((prevData) => ({
          ...prevData,
          image: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleCategoryToggle = (id) => {
  setProductData((prev) => {
    const alreadySelected = prev.categoryId.includes(id);
    return {
      ...prev,
      categoryId: alreadySelected
        ? prev.categoryId.filter((catId) => catId !== id)
        : [...prev.categoryId, id],
    };
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && product) {
        await updateProduct(shopId, product.id, productData);
        onClose(); // Close dialog after update
      } else {
        await createProduct(shopId, productData);
        setProductData({
          name: "",
          type: "product",
          description: "",
          price: "",
          categoryId: [],
          stock: "",
          image: null,
        });
        onClose(); // Close dialog after creation
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <form className="dialog-container" onSubmit={handleSubmit}>
        <h2 className="dialog-title">{isEdit ? "Edit Product" : "Add Product"}</h2>

        <div className="form-grid-2">
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              type="text"
              name="name"
              placeholder="Product Name"
              value={productData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label">Image</label>
            {productData.image && (
              <img src={productData.image} alt="Preview" className="image-preview" />
            )}
            <label className="upload-box">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <div className="upload-text">Upload Image</div>
            </label>
          </div>
        </div>

        <div className="my-4">
          <label className="label">Description</label>
          <textarea
            className="input textarea"
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-grid-2">
          <input
            className="input"
            type="number"
            name="price"
            placeholder="Price"
            value={productData.price}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="number"
            name="stock"
            placeholder="Stock"
            value={productData.stock}
            onChange={handleChange}
            required
          />
        </div>
          <div className="category-section">
            <label className="label">Category</label>
            <button
              type="button"
              onClick={() => setShowCategories(!showCategories)}
              className="dropdown-btn"
            >
              <span>
                {productData.categoryId.length > 0
                  ? categories
                      .filter((cat) => productData.categoryId.includes(cat.id))
                      .map((cat) => cat.name)
                      .join(", ")
                  : "Select categories"}
              </span>
              <span>{showCategories ? "▲" : "▼"}</span>
            </button>

            {showCategories && (
              <div className="dropdown-list">
                {categories.map((cat) => (
                  <label key={cat.id} className="checkbox-option">
                    <input
                      type="checkbox"
                      value={cat.id}
                      checked={productData.categoryId.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>


        <div className="action-buttons">
            <button type="submit" className="primary-button" >
                {isEdit ? "Update Product" : "Create Product" }
            </button>
            <button type="button" className="secondary-button" onClick={onClose}>
                Cancel
            </button>
        </div>
      </form>
    </div>
  );
};

CreateProduct.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  product: PropTypes.object,
};

export default CreateProduct;
