// Products.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productsData from "../data/data.json";
import ProductCard from '../components/ProductCard'; // Import the ProductCard component

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

  // Shape options based on product types
  const shapeOptions = ['Circle', 'Square', 'Rectangle', 'Oval', 'Cat-eye', 'Aviator', 'Wayfarer', 'Round', 'Geometric'];

  // Gender options
  const genderOptions = ['Men', 'Women', 'Unisex'];

  // Load products from data.json
  useEffect(() => {
    if (productsData && productsData.products) {
      setProducts(productsData.products);
      setFilteredProducts(productsData.products);
    }
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = [...products];

    // Filter by search term (product name)
    if (searchTerm.trim() !== '') {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by main category
    if (activeCategory !== 'all') {
      result = result.filter(product =>
        product.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by gender
    if (selectedGenders.length > 0) {
      result = result.filter(product =>
        selectedGenders.includes(product.gender)
      );
    }

    // Filter by price range
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

    // Filter by shape
    if (selectedShapes.length > 0) {
      result = result.filter(product =>
        product.shape && selectedShapes.includes(product.shape)
      );
    }

    // Apply sorting
    if (sortBy === 'priceLowHigh') {
      result.sort((a, b) => {
        const priceA = parseFloat(a.discountPrice?.replace(/,/g, '')) || 0;
        const priceB = parseFloat(b.discountPrice?.replace(/,/g, '')) || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'priceHighLow') {
      result.sort((a, b) => {
        const priceA = parseFloat(a.discountPrice?.replace(/,/g, '')) || 0;
        const priceB = parseFloat(b.discountPrice?.replace(/,/g, '')) || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'nameAZ') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'nameZA') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(result);
  }, [activeCategory, priceRange, selectedShapes, selectedGenders, sortBy, products, searchTerm]);

  // Handle shape filter toggle
  const toggleShape = (shape) => {
    setSelectedShapes(prev =>
      prev.includes(shape) ? prev.filter(s => s !== shape) : [...prev, shape]
    );
  };

  // Handle gender filter toggle
  const toggleGender = (gender) => {
    setSelectedGenders(prev =>
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  // Clear all filters (including search)
  const clearFilters = () => {
    setActiveCategory('all');
    setPriceRange({ min: '', max: '' });
    setSelectedShapes([]);
    setSelectedGenders([]);
    setSortBy('default');
    setSearchTerm('');
  };

  // Format price display
  const formatPrice = (price) => {
    return `PKR ${price}`;
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
    
    // Show notification
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="products-page">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      
      <div className="container">
        <h1 className="page-title">Our Products</h1>
        <p className="page-subtitle">Discover premium eyewear for every style and need</p>

        {/* Category Tabs */}
        <div className="category-tabs">
          <button
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Products
          </button>
          <button
            className={`category-tab ${activeCategory === 'men' ? 'active' : ''}`}
            onClick={() => setActiveCategory('men')}
          >
            Men
          </button>
          <button
            className={`category-tab ${activeCategory === 'women' ? 'active' : ''}`}
            onClick={() => setActiveCategory('women')}
          >
            Women
          </button>
          <button
            className={`category-tab ${activeCategory === 'kids' ? 'active' : ''}`}
            onClick={() => setActiveCategory('kids')}
          >
            Kids
          </button>
          <button
            className={`category-tab ${activeCategory === 'contactlens' ? 'active' : ''}`}
            onClick={() => setActiveCategory('contactlens')}
          >
            Contact Lens
          </button>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="clear-filters" onClick={clearFilters}>Clear All</button>
            </div>

            {/* Gender Filter */}
            <div className="filter-section">
              <h4>Gender</h4>
              <div className="filter-options">
                {genderOptions.map(gender => (
                  <label key={gender} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedGenders.includes(gender)}
                      onChange={() => toggleGender(gender)}
                    />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min PKR"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max PKR"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>

            {/* Shape Filter */}
            <div className="filter-section">
              <h4>Frame Shape</h4>
              <div className="shape-options">
                {shapeOptions.map(shape => (
                  <button
                    key={shape}
                    className={`shape-btn ${selectedShapes.includes(shape) ? 'active' : ''}`}
                    onClick={() => toggleShape(shape)}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            <div className="products-header">
              <div className="search-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="products-count-sort">
                <p className="products-count">{filteredProducts.length} products found</p>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Sort by: Featured</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="nameAZ">Name: A to Z</option>
                  <option value="nameZA">Name: Z to A</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
                <button onClick={clearFilters}>Clear Filters</button>
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
      </div>

      <style jsx>{`
        .products-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f8f9fa;
          min-height: 100vh;
          padding: 40px 0;
          position: relative;
        }

        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #4CAF50;
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 12px;
          text-align: center;
        }

        .page-subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 40px;
          font-size: 1.1rem;
        }

        /* Category Tabs */
        .category-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .category-tab {
          padding: 12px 28px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 40px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #555;
        }

        .category-tab:hover {
          border-color: #1a1a2e;
          color: #1a1a2e;
        }

        .category-tab.active {
          background: #1a1a2e;
          border-color: #1a1a2e;
          color: white;
        }

        /* Layout */
        .products-layout {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
        }

        /* Filters Sidebar */
        .filters-sidebar {
          width: 280px;
          background: white;
          border-radius: 20px;
          padding: 24px;
          height: fit-content;
          position: sticky;
          top: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eee;
        }

        .filters-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a1a2e;
        }

        .clear-filters {
          background: none;
          border: none;
          color: #e74c3c;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .filter-section {
          margin-bottom: 28px;
        }

        .filter-section h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #555;
        }

        .filter-checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .price-inputs {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .price-inputs input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .shape-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .shape-btn {
          padding: 8px 16px;
          background: #f0f0f0;
          border: none;
          border-radius: 30px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .shape-btn.active {
          background: #1a1a2e;
          color: white;
        }

        /* Products Main */
        .products-main {
          flex: 1;
          min-width: 300px;
        }

        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px;
          padding-right: 36px;
          border: 1px solid #ddd;
          border-radius: 40px;
          font-size: 0.9rem;
          background: white;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #1a1a2e;
          box-shadow: 0 0 0 2px rgba(26,26,46,0.1);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          color: #999;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .clear-search:hover {
          color: #333;
          background: #f0f0f0;
        }

        .products-count-sort {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .products-count {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
        }

        .sort-select {
          padding: 10px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          font-size: 0.9rem;
          cursor: pointer;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }

        .product-card-wrapper {
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .product-card-wrapper:hover {
          transform: translateY(-5px);
        }

        .no-products {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 16px;
        }

        .no-products button {
          margin-top: 16px;
          padding: 10px 24px;
          background: #1a1a2e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .filters-sidebar {
            width: 100%;
            position: static;
          }
          
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
          
          .category-tab {
            padding: 8px 20px;
            font-size: 0.9rem;
          }

          .products-header {
            flex-direction: column;
            align-items: stretch;
          }

          .products-count-sort {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default Products;