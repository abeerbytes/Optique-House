// Products.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productsData from "../data/data.json";
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New state to manage which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);

  const shapeOptions = ['Circle', 'Square', 'Rectangle', 'Oval', 'Cat-eye', 'Aviator', 'Wayfarer', 'Round', 'Geometric'];
  const genderOptions = ['Men', 'Women', 'Unisex'];

  useEffect(() => {
    if (productsData && productsData.products) {
      setProducts(productsData.products);
      setFilteredProducts(productsData.products);
    }
  }, []);

  useEffect(() => {
    let result = [...products];

    if (searchTerm.trim() !== '') {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'all') {
      result = result.filter(product =>
        product.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (selectedGenders.length > 0) {
      result = result.filter(product =>
        selectedGenders.includes(product.gender)
      );
    }

    if (priceRange.min) {
      result = result.filter(product => {
        const price = parseFloat(product.discountPrice?.replace(/,/g, '')) || 0;
        return price >= parseFloat(priceRange.min);
      });
    }
    if (priceRange.max) {
      result = result.filter(product => {
        const price = parseFloat(product.discountPrice?.replace(/,/g, '')) || 0;
        return price <= parseFloat(priceRange.max);
      });
    }

    if (selectedShapes.length > 0) {
      result = result.filter(product =>
        product.shape && selectedShapes.includes(product.shape)
      );
    }

    if (sortBy === 'priceLowHigh') {
      result.sort((a, b) => (parseFloat(a.discountPrice?.replace(/,/g, '')) || 0) - (parseFloat(b.discountPrice?.replace(/,/g, '')) || 0));
    } else if (sortBy === 'priceHighLow') {
      result.sort((a, b) => (parseFloat(b.discountPrice?.replace(/,/g, '')) || 0) - (parseFloat(a.discountPrice?.replace(/,/g, '')) || 0));
    } else if (sortBy === 'nameAZ') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'nameZA') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(result);
  }, [activeCategory, priceRange, selectedShapes, selectedGenders, sortBy, products, searchTerm]);

  const toggleShape = (shape) => {
    setSelectedShapes(prev =>
      prev.includes(shape) ? prev.filter(s => s !== shape) : [...prev, shape]
    );
  };

  const toggleGender = (gender) => {
    setSelectedGenders(prev =>
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  const clearFilters = () => {
    setActiveCategory('all');
    setPriceRange({ min: '', max: '' });
    setSelectedShapes([]);
    setSelectedGenders([]);
    setSortBy('default');
    setSearchTerm('');
    setOpenDropdown(null);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const addToCart = (product, selectedVariantIndex = 0) => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = saved.find(i => i.id === product.id);
    if (exists) {
      exists.quantity = (exists.quantity || 1) + 1;
    } else {
      saved.push({ ...product, quantity: 1, selectedVariant: selectedVariantIndex });
    }
    localStorage.setItem("cart", JSON.stringify(saved));
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="products-page">
      {notification && <div className="notification">{notification}</div>}
      
      <div className="container">
        <h1 className="page-title">Our Products</h1>
        <p className="page-subtitle">Discover premium eyewear for every style and need</p>

        {/* Category Tabs */}
        <div className="category-tabs">
          {['all', 'men', 'women', 'kids', 'contactlens'].map(cat => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('lens', ' Lens')}
            </button>
          ))}
        </div>

        {/* Horizontal Filter Bar (Video Style) */}
        <div className="filter-bar">
          <div className="filter-dropdown-group">
            
            {/* Shape Dropdown */}
            <div className="dropdown-container">
              <button className={`dropdown-btn ${selectedShapes.length > 0 ? 'highlight' : ''}`} onClick={() => toggleDropdown('shape')}>
                Shape <span className={`arrow ${openDropdown === 'shape' ? 'up' : 'down'}`}></span>
              </button>
              {openDropdown === 'shape' && (
                <div className="dropdown-menu">
                  {shapeOptions.map(shape => (
                    <label key={shape} className="dropdown-item">
                      <input type="checkbox" checked={selectedShapes.includes(shape)} onChange={() => toggleShape(shape)} />
                      {shape}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Dropdown */}
            <div className="dropdown-container">
              <button className={`dropdown-btn ${selectedGenders.length > 0 ? 'highlight' : ''}`} onClick={() => toggleDropdown('gender')}>
                Gender <span className={`arrow ${openDropdown === 'gender' ? 'up' : 'down'}`}></span>
              </button>
              {openDropdown === 'gender' && (
                <div className="dropdown-menu">
                  {genderOptions.map(gender => (
                    <label key={gender} className="dropdown-item">
                      <input type="checkbox" checked={selectedGenders.includes(gender)} onChange={() => toggleGender(gender)} />
                      {gender}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className="dropdown-container">
              <button className={`dropdown-btn ${priceRange.min || priceRange.max ? 'highlight' : ''}`} onClick={() => toggleDropdown('price')}>
                Price <span className={`arrow ${openDropdown === 'price' ? 'up' : 'down'}`}></span>
              </button>
              {openDropdown === 'price' && (
                <div className="dropdown-menu price-menu">
                  <input type="number" placeholder="Min PKR" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} />
                  <input type="number" placeholder="Max PKR" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} />
                </div>
              )}
            </div>

            <button className="text-clear-btn" onClick={clearFilters}>Reset All</button>
          </div>

          <div className="sort-section">
            <select className="sort-minimal" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sort: Featured</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="nameAZ">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Main Products Area */}
        <main className="products-main">
          <div className="search-row">
            <input 
               type="text" 
               className="minimal-search" 
               placeholder="Search style..." 
               value={searchTerm} 
               onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <p className="count-text">{filteredProducts.length} items</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No matches found.</p>
              <button onClick={clearFilters}>Clear all filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card-wrapper">
                  <ProductCard product={product} addToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .products-page {
          font-family: 'Inter', sans-serif;
          background: #fff;
          padding: 40px 0;
        }

        .container { max-width: 1300px; margin: 0 auto; padding: 0 20px; }

        .page-title { text-align: center; font-size: 2rem; margin-bottom: 8px; font-weight: 700; }
        .page-subtitle { text-align: center; color: #777; margin-bottom: 40px; }

        /* Tabs */
        .category-tabs { display: flex; justify-content: center; gap: 10px; margin-bottom: 30px; }
        .category-tab { 
          padding: 10px 20px; border: 1px solid #ddd; background: #fff; cursor: pointer; border-radius: 4px; 
          transition: 0.2s; font-weight: 500;
        }
        .category-tab.active { background: #000; color: #fff; border-color: #000; }

        /* Video Style Filter Bar */
        .filter-bar { 
          display: flex; justify-content: space-between; align-items: center; 
          border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 15px 0; margin-bottom: 20px;
          position: sticky; top: 0; background: #fff; z-index: 10;
        }
        .filter-dropdown-group { display: flex; gap: 25px; align-items: center; }
        
        .dropdown-container { position: relative; }
        .dropdown-btn { 
          background: none; border: none; font-size: 1rem; cursor: pointer; font-weight: 500;
          display: flex; align-items: center; gap: 8px;
        }
        .dropdown-btn.highlight { color: #d9534f; }

        .dropdown-menu { 
          position: absolute; top: 100%; left: 0; background: #fff; border: 1px solid #eee; 
          box-shadow: 0 10px 20px rgba(0,0,0,0.1); padding: 15px; min-width: 180px; display: flex; flex-direction: column; gap: 10px;
          margin-top: 10px; border-radius: 4px;
        }
        .dropdown-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; }
        .price-menu { width: 220px; flex-direction: row; }
        .price-menu input { width: 50%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }

        .text-clear-btn { background: none; border: none; color: #888; text-decoration: underline; cursor: pointer; font-size: 0.9rem; }

        .arrow { border: solid black; border-width: 0 1.5px 1.5px 0; display: inline-block; padding: 3px; transition: 0.2s; }
        .down { transform: rotate(45deg); }
        .up { transform: rotate(-135deg); }

        /* Search & Grid */
        .search-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .minimal-search { border: none; border-bottom: 1px solid #ddd; padding: 8px 0; width: 250px; outline: none; }
        .count-text { color: #888; font-size: 0.9rem; }

        .products-grid { 
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; 
        }

        .notification {
          position: fixed; top: 20px; right: 20px; background: #333; color: #fff; 
          padding: 12px 24px; border-radius: 4px; z-index: 1000;
        }

        @media (max-width: 768px) {
          .filter-bar { flex-direction: column; gap: 15px; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default Products;