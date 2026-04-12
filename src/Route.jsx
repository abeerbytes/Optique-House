// AppRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";    
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";  // Import the ProductDetail component
import Contact from "./pages/Contact";
import Brands from "./pages/Brands";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Chackout";
import OrderSuccess from "./pages/OrderSuccess";

const AppRouter = () => {
    return (
        <Router>    
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />   
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />  {/* Dynamic route for product details */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/brands" element={<Brands />} />   
                <Route path="/cart" element={<Cart />} />   
                <Route path="/order-success" element={<OrderSuccess />} />   
                <Route path="/checkout" element={<Checkout />} />   
                <Route path="/about" element={<About />} />
            </Routes>
            <Footer />
        </Router>
    );
}  

export default AppRouter;