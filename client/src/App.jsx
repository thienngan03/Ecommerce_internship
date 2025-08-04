// import React from 'react';
import Navbar from './Components/Navbar/Navbar.jsx';
import './App.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
// main pages
import Home from './Pages/Home.jsx';
import Products from './Pages/Product.jsx';
import SignUp from './Pages/SignUp.jsx';
import Shop from './Pages/Shop.jsx';
import Login from './Pages/Login.tsx';
import ProductDetail from './Pages/ProductDetail.jsx';  

// buyer
import CreateBuyer from './Pages/Buyer/createBuyer.jsx';
import  Cart  from './Pages/Buyer/Cart.jsx';
import Account from './Pages/Buyer/Account.jsx'; 
import BuyerOrder from './Pages/Buyer/Order.jsx';
// seller
import Category from './Pages/Seller/category.jsx';
import CreateProduct from './Pages/Seller/productMethod.jsx';
import Product from './Pages/Seller/Product.jsx';
import SellerOrder from './Pages/Seller/Order.jsx';
import SellerAccount from './Pages/Seller/Account.jsx';

import { useAuth } from './Hooks/useAuth.tsx';
// import {sellerDashboard} from './Pages/Seller/sellerDashboard.jsx';
import { PrivateRoute } from './Hooks/reuse.jsx';

function App() {
  const {loading, user} = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  const isSeller = user?.role === 'seller';
  const isBuyer = user?.role === 'buyer';

  return (
    <BrowserRouter>
      <div>
        <Navbar/>
        <Routes  >
          {/* public routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/home" element={<Home />} />
        </Routes>
        {/* private routes */}
        <Routes element={<PrivateRoute isAllowed={isSeller} redirectPath="/login"><Product/></PrivateRoute>}>
          {/* <Route path='/seller/'>
            <Route path='dashboard' element={<sellerDashboard />} />
          </Route> */}
          <Route path='/seller/'>
            <Route path='category' element={<Category />} />
            <Route path='createProduct' element={<CreateProduct />} />
            <Route path='product' element={<Product />} />
            <Route path='order' element={<SellerOrder />} />
            <Route path='account' element={<SellerAccount />} />

          </Route>
        </Routes>
        <Routes element={<PrivateRoute isAllowed={isBuyer} redirectPath="/login"><Cart /></PrivateRoute>}>
          <Route path='/buyer/'>
            <Route path='createBuyer' element={<CreateBuyer />} />
            <Route path='cart' element={<Cart />} />
            <Route path='account' element={<Account />} />
            <Route path='order' element={<BuyerOrder />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
