// Products.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
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
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Ref for search input
  const searchInputRef = useRef(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const shapeOptions = ['Circle', 'Square', 'Rectangle', 'Oval', 'Cat-eye', 'Aviator', 'Wayfarer', 'Round', 'Geometric'];
  const genderOptions = ['Men', 'Women', 'Unisex'];

  // Define all categories with their filters
  const categories = [
    { id: 'all', name: 'All Products', gender: null, type: null, category: null },
    { id: 'men-sunglass', name: "Men's Sunglass", gender: 'Men', type: 'sunglasses', category: 'men' },
    { id: 'men-eyeglass', name: "Men's Eyeglass", gender: 'Men', type: 'eyeglasses', category: 'men' },
    { id: 'women-eyeglass', name: "Women's Eyeglass", gender: 'Women', type: 'eyeglasses', category: 'women' },
    { id: 'women-sunglass', name: "Women's Sunglass", gender: 'Women', type: 'sunglasses', category: 'women' },
    { id: 'kids-sunglass', name: "Kids' Sunglass", gender: 'Kids', type: 'sunglasses', category: 'kids' },
    { id: 'kids-eyeglass', name: "Kids' Eyeglass", gender: 'Kids', type: 'eyeglasses', category: 'kids' },
    { id: 'contact-lens', name: 'Contact Lens', gender: null, type: 'contactlens', category: 'contactlens' }
  ];

  // Load products
  useEffect(() => {
    if (productsData && productsData.products) {
      setProducts(productsData.products);
      setFilteredProducts(productsData.products);
    }
  }, []);

  // Handle URL parameters on page load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const typeParam = searchParams.get('type');
    const genderParam = searchParams.get('gender');
    
    if (categoryParam || typeParam || genderParam) {
      // Find matching category
      const matchedCategory = categories.find(cat => 
        (genderParam && cat.gender === genderParam) ||
        (typeParam && cat.type === typeParam) ||
        (categoryParam && cat.category === categoryParam)
      );
      
      if (matchedCategory && matchedCategory.id !== 'all') {
        setActiveCategory(matchedCategory.id);
        
        // Set gender filter
        if (matchedCategory.gender) {
          setSelectedGenders([matchedCategory.gender]);
        } else if (matchedCategory.id === 'contact-lens') {
          setSelectedGenders([]);
        }
      }
    }
  }, [searchParams]);

  // Auto-focus search input if navigation state contains focusSearch
  useEffect(() => {
    if (location.state?.focusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.select();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Filtering logic
  useEffect(() => {
    let result = [...products];

    if (searchTerm.trim() !== '') {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Handle active category filtering
    if (activeCategory !== 'all') {
      const selectedCat = categories.find(cat => cat.id === activeCategory);
      
      if (selectedCat) {
        if (selectedCat.category) {
          result = result.filter(product =>
            product.category?.toLowerCase() === selectedCat.category.toLowerCase()
          );
        }
        
        if (selectedCat.type) {
          result = result.filter(product =>
            product.type?.toLowerCase() === selectedCat.type.toLowerCase()
          );
        }
        
        if (selectedCat.gender) {
          result = result.filter(product =>
            product.gender === selectedCat.gender
          );
        }
      }
    }

    if (selectedGenders.length > 0 && activeCategory === 'all') {
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

    if (selectedShapes.length > 0 && activeCategory === 'all') {
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

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    // Clear gender filters when selecting a specific category
    if (categoryId !== 'all') {
      const selectedCat = categories.find(cat => cat.id === categoryId);
      if (selectedCat && selectedCat.gender) {
        setSelectedGenders([selectedCat.gender]);
      } else {
        setSelectedGenders([]);
      }
    }
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

        {/* Category Tabs - 7 Categories */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Horizontal Filter Bar - Only show when 'All Products' is selected */}
        {activeCategory === 'all' && (
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
        )}

        {/* Show sort only for non-all categories */}
        {activeCategory !== 'all' && (
          <div className="simple-sort-bar">
            <div className="sort-section">
              <select className="sort-minimal" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Sort: Featured</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="nameAZ">Name: A to Z</option>
              </select>
            </div>
          </div>
        )}

        {/* Main Products Area */}
        <main className="products-main">
          <div className="search-row">
            <input 
               type="text" 
               ref={searchInputRef}
               className="minimal-search" 
               placeholder="Search style..." 
               value={searchTerm} 
               onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <p className="count-text">{filteredProducts.length} items found</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found in this category.</p>
              <button onClick={clearFilters}>Browse All Products</button>
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

        /* Category Tabs - Scrollable on mobile */
        .category-tabs { 
          display: flex; 
          justify-content: center; 
          gap: 12px; 
 margin-bottom: 30px; 
          flex-wrap: wrap;
          position: sticky;
          top: 70px;
          background: #fff;
          padding: 10px 0;
          z-index: 50;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .category-tab { 
          padding: 10px 24px; 
          border: 1px solid #ddd; 
          background: #fff; 
          cursor: pointer; 
          border-radius: 30px; 
          transition: 0.3s; 
          font-weight: 500;
          font-size: 14px;
          white-space: nowrap;
        }
        
        .category-tab:hover { 
          background: #f5f5f5; 
          border-color: #999;
        }
        
        .category-tab.active { 
          background: #000; 
          color: #fff; 
          border-color: #000; 
        }

        /* Filter Bar Styles */
        .filter-bar, .simple-sort-bar { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          border-top: 1px solid #eee; 
          border-bottom: 1px solid #eee; 
          padding: 15px 0; 
          margin-bottom: 20px;
        }
        
        .simple-sort-bar {
          justify-content: flex-end;
          border-top: none;
        }
        
        .filter-dropdown-group { display: flex; gap: 25px; align-items: center; flex-wrap: wrap; }
        
        .dropdown-container { position: relative; }
        .dropdown-btn { 
          background: none; 
          border: none; 
          font-size: 1rem; 
          cursor: pointer; 
          font-weight: 500;
          display: flex; 
          align-items: center; 
          gap: 8px;
          padding: 8px 0;
        }
        .dropdown-btn.highlight { color: #d9534f; }

        .dropdown-menu { 
          position: absolute; 
          top: 100%; 
          left: 0; 
          background: #fff; 
          border: 1px solid #eee; 
          box-shadow: 0 10px 20px rgba(0,0,0,0.1); 
          padding: 15px; 
          min-width: 180px; 
          display: flex; 
          flex-direction: column; 
          gap: 10px;
          margin-top: 10px; 
          border-radius: 8px; 
          z-index: 100;
        }
        .dropdown-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; }
        .price-menu { width: 220px; flex-direction: row; gap: 10px; }
        .price-menu input { 
          width: 50%; 
          padding: 8px; 
          border: 1px solid #ddd; 
          border-radius: 4px; 
        }
        .price-menu input:focus { outline: none; border-color: #000; }

        .text-clear-btn { 
          background: none; 
          border: none; 
          color: #888; 
          text-decoration: underline; 
          cursor: pointer; 
          font-size: 0.9rem; 
        }
        .text-clear-btn:hover { color: #000; }

        .arrow { border: solid black; border-width: 0 1.5px 1.5px 0; display: inline-block; padding: 3px; transition: 0.2s; }
        .down { transform: rotate(45deg); }
        .up { transform: rotate(-135deg); }

        /* Search & Grid */
        .search-row { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 30px; 
          flex-wrap: wrap; 
          gap: 15px; 
        }
        .minimal-search { 
          border: none; 
          border-bottom: 2px solid #eee; 
          padding: 10px 0; 
          width: 280px; 
          outline: none; 
          font-size: 15px;
          transition: 0.3s;
        }
        .minimal-search:focus { border-bottom-color: #000; }
        .count-text { color: #888; font-size: 0.9rem; font-weight: 500; }

        .products-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
          gap: 30px; 
        }

        .notification {
          position: fixed; 
          top: 20px; 
          right: 20px; 
          background: #28a745; 
          color: #fff; 
          padding: 12px 24px; 
          border-radius: 8px; 
          z-index: 1000; 
          animation: slideIn 0.3s ease;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .no-products { 
          text-align: center; 
          padding: 80px 20px; 
          background: #fafafa;
          border-radius: 12px;
        }
        .no-products p { font-size: 18px; color: #666; margin-bottom: 20px; }
        .no-products button { 
          padding: 12px 28px; 
          background: #000; 
          color: #fff; 
          border: none; 
          cursor: pointer; 
          border-radius: 30px;
          font-size: 14px;
          font-weight: 500;
          transition: 0.3s;
        }
        .no-products button:hover { background: #333; transform: translateY(-2px); }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .category-tabs {
            gap: 8px;
            overflow-x: auto;
            justify-content: flex-start;
            padding-bottom: 8px;
            scrollbar-width: thin;
          }
          
          .category-tab { 
            padding: 8px 18px; 
            font-size: 12px;
            white-space: nowrap;
          }
          
          .filter-bar { 
            flex-direction: column; 
            gap: 15px; 
            align-items: flex-start; 
          }
          
          .filter-dropdown-group { gap: 15px; }
          .products-grid { gap: 20px; }
          
          .minimal-search { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Products;