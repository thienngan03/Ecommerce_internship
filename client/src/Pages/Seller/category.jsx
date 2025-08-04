import "./category.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/useAuth.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { createCategory, getCategories, deleteCategory } from "../../Api/sellerAPI.jsx";
import SellerMenu from "../../Components/SellerMenu.jsx";

const Category = () => {
    const { isAuthenticated, loading, shopId } = useAuth();
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    // const [categoryNewName, setCategoryNewName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            if (isAuthenticated && shopId) {
                try {
                    const data = await getCategories(shopId);
                    setCategories(data || []);
                } catch (error) {
                    console.error("Error fetching categories:", error);
                }
            }
        }
        fetchCategories();

    }, [loading, isAuthenticated, navigate, shopId]);

    const handleAddCategory = async () => {
        const categoryData = {
            name: category,
        };
        try {
            const response = await createCategory(shopId, categoryData);
            setCategory(response);
            const newCategories = await getCategories(shopId);
            setCategories(newCategories);
            setCategory(""); // Clear input after creation
        } catch (error) {
            console.error("Error creating category:", error);
        }
    }
    // const handleUpdateCategory = async (categoryId) => {
    //     try {
    //         const response = await updateCategory(shopId, categoryId, { name: categoryNewName });
    //         console.log("Category updated:", response);
    //         const newCategories = await getCategories(shopId);
    //         setCategories(newCategories);
    //     } catch (error) {
    //         console.error("Error updating category:", error);
    //     }
    // }
    
    const handleDeleteCategory = async (categoryId) => {
        try {
            await deleteCategory(shopId, categoryId);
            console.log("Category deleted:", categoryId);
           const newCategories = await getCategories(shopId);
            setCategories(newCategories);
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    }


    return (
        <div className="flex">
        <SellerMenu />

        <div className="category-container">
            <h2 className="title">Category Management</h2>
            <div className="flex flex-row gap-6">

            <div className="form-container">
                <h2 className="form-title">Add Category</h2>
                <input
                    type="text"
                    placeholder="Enter category name"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field"
                />
                <div className="flex justify-end">
                    <button
                    title="Save"
                    className="secondary-button"
                    onClick={handleAddCategory}
                    >
                    Save
                    </button>
                </div>
                </div>


            <div className="table-container">
                <h2 className="table-title">Category</h2>
                <table className="w-full text-left">
                <thead>
                    <tr className="text-center">
                    <th className="p-2">No.</th>
                    <th className="p-2">Category Name</th>
                    <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                    <tr
                        key={index}
                        className={`${index % 2 === 0 ? "bg-[#F7F6FF]" : "bg-white"} text-center`}
                    >
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{category.name}</td>
                        <td className="p-2">
                        <div className="flex items-center justify-center gap-2">
                            <button
                            className="delete-button"
                            onClick={() => handleDeleteCategory(category.id)}
                            title="Delete"
                            >
                            <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            </div>
        </div>
    </div>
  );
};
export default Category;