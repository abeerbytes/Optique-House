// // AppRouter.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";    
// import Products from "./pages/Products";
// import ProductDetail from "./pages/ProductDetail";
// import Contact from "./pages/Contact";
// import Brands from "./pages/Brands";
// import About from "./pages/About";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Chackout";  // Note: Keep as is or fix typo
// import OrderSuccess from "./pages/OrderSuccess";
// import TryOn from "./pages/TryOn";
//  // Import the TryOn component

// const AppRouter = () => {
//     return (
//         <Router>    
//             <Navbar />
//             <Routes>
//                 <Route path="/" element={<Home />} />   
//                 <Route path="/products" element={<Products />} />
//                 <Route path="/product/:id" element={<ProductDetail />} />
//                 <Route path="/contact" element={<Contact />} />
//                 <Route path="/brands" element={<Brands />} />   
//                 <Route path="/cart" element={<Cart />} />   
//                 <Route path="/order-success" element={<OrderSuccess />} />   
//                 <Route path="/checkout" element={<Checkout />} />   
//                 <Route path="/about" element={<About />} />
//                 <Route path="/tryon" element={<TryOn/>} />  {/* Add virtual try-on route */}
//             </Routes>
//             <Footer />
//         </Router>
//     );
// }  

// export default AppRouter;


// AppRouter.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Brands from "./pages/Brands";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Chackout";
import OrderSuccess from "./pages/OrderSuccess";
import TryOn from "./pages/TryOn";

const Layout = () => {
  const location = useLocation();

  // Check if current page is TryOn
  const isTryOnPage = location.pathname.endsWith("/tryon");

  // Mobile screen check
  const isMobile = window.innerWidth <= 768;

  return (
    <>
      {/* Hide Navbar only on mobile TryOn page */}
      {!(isTryOnPage ) && <Navbar />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />

        {/* TryOn Page */}
        <Route path="/tryon" element={<TryOn />} />
      </Routes>

      {/* Hide Footer only on mobile TryOn page */}
      {!(isTryOnPage ) && <Footer />}
    </>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default AppRouter;