// import React from "react";
import { ProductCard } from "../Components/Shopping/productCard";
import { useState, useEffect } from "react";
import { getProducts, searchProduct } from "../Api/guestAPI";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from "react-router-dom";
import "./Shop.css"

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from an API or use static data
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const formattedProducts = data.map(product => ({
          productId: product.id,
          productName: product.name,
          productImage: product.imageUrl,
          productPrice: product.price
        }));
        setProducts(formattedProducts);
      }
      catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  const fetchMoreData = async () => {
    // Simulate fetching more data
    const newProducts = await getProducts();
    const formattedNewProducts = newProducts.map(product => ({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      productPrice: product.price
    }));
    setProducts(prevProducts => [...prevProducts, ...formattedNewProducts]);
  }
  const handleSearch = async (query) => {
    if (query) {
      try {
        const results = await searchProduct(query);
        const formattedResults = results.map(product => ({
          productId: product.id,
          productName: product.name,
          productImage: product.imageUrl,
          productPrice: product.price
        }));
        setIsSearching(true);
        setProducts(formattedResults);
      } catch (error) {
              setProducts([]);
      setError("No products found");
        console.error("Error searching products:", error);
      }
    } else {
      setProducts([]);
      setError("No products found");
    }
  };
  const handleSearchStop = () => {
    setIsSearching(false);
    setSearchQuery("");
    // Reset products to the original list
    getProducts().then(data => {
      const formattedProducts = data.map(product => ({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        productPrice: product.price
      }));
      setProducts(formattedProducts);
    });
  setError(null);
    navigate("/shop");
  };
  return (
    <div className="home">
      <h1>Welcome to E-Shop</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          className="search-input"
        />
        <button onClick={handleSearchStop} className="search-button">
          Stop Search
        </button>
      </div>
      {/* <div className="product-list"> */}
      {error && <p className="error-message">{error}</p>}
      <div className="product-list">
        <InfiniteScroll
          className="product-list"
          dataLength={products.length} // This is important field to render the next data
          next={fetchMoreData} // Function to fetch more data
          hasMore={!isSearching} // Set to true if there are more items to load
          loader={<h4>Loading...</h4>}

          >
            {products.map(product => (
              <div className="product-card" key={product.productId}>
                <ProductCard
                  key={product.productId}
                  productId={product.productId}
                  productName={product.productName}
                  productImage={product.productImage}
                  productPrice={product.productPrice}
                />
              </div>
            ))}
            
          </InfiniteScroll>
      </div>
        

    </div>
  );
};



export default Shop;