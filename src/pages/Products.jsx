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

  // Updated shape options based on your data
  const shapeOptions = ['Square', 'Oval', 'Round', 'Geometric', 'Wayfarer', 'Vaffer', 'Eye', 'Other'];
  const genderOptions = ['Men', 'Women', 'Unisex', 'Kids'];

  // Define all categories with their filters - MATCHING YOUR JSON CATEGORIES
  const categories = [
    { id: 'all', name: 'All Products', categoryMatch: null },
    { id: 'men-sunglass', name: "Men's Sunglass", categoryMatch: 'men sunglass' },
    { id: 'men-eyeglass', name: "Men's Eyeglass", categoryMatch: 'men eyeglass' },
    { id: 'women-sunglass', name: "Women's Sunglass", categoryMatch: 'woman sunglass' },
    { id: 'women-eyeglass', name: "Women's Eyeglass", categoryMatch: 'women eyeglass' },
    { id: 'kids-sunglass', name: "Kids' Sunglass", categoryMatch: 'kid sunglass' },
    { id: 'kids-eyeglass', name: "Kids' Eyeglass", categoryMatch: 'kids eyeglass' },
    { id: 'contact-lens', name: 'Contact Lens', categoryMatch: 'contactless' }
  ];
 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
    
    if (categoryParam) {
      const matchedCategory = categories.find(cat => 
        cat.categoryMatch === categoryParam || cat.id === categoryParam
      );
      
      if (matchedCategory && matchedCategory.id !== 'all') {
        setActiveCategory(matchedCategory.id);
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

  // Helper function to get display price (handle string numbers)
  const getDisplayPrice = (product) => {
    const price = product.discountPrice || product.originalPrice;
    if (!price) return 0;
    // Remove commas if present and convert to number
    return parseFloat(String(price).replace(/,/g, ''));
  };

  // Filtering logic
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm.trim() !== '') {
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Handle active category filtering - using your actual category values
    if (activeCategory !== 'all') {
      const selectedCat = categories.find(cat => cat.id === activeCategory);
      
      if (selectedCat && selectedCat.categoryMatch) {
        result = result.filter(product =>
          product.category?.toLowerCase() === selectedCat.categoryMatch.toLowerCase()
        );
      }
    }

    // Gender filter (only when 'all' is selected)
    if (selectedGenders.length > 0 && activeCategory === 'all') {
      result = result.filter(product => {
        const productGender = product.gender?.toLowerCase();
        return selectedGenders.some(gender => 
          productGender?.includes(gender.toLowerCase())
        );
      });
    }

    // Price range filter
    if (priceRange.min) {
      result = result.filter(product => {
        const price = getDisplayPrice(product);
        return price >= parseFloat(priceRange.min);
      });
    }
    if (priceRange.max) {
      result = result.filter(product => {
        const price = getDisplayPrice(product);
        return price <= parseFloat(priceRange.max);
      });
    }

    // Shape filter
    if (selectedShapes.length > 0 && activeCategory === 'all') {
      result = result.filter(product =>
        product.shape && selectedShapes.includes(product.shape)
      );
    }

    // Sorting
    if (sortBy === 'priceLowHigh') {
      result.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    } else if (sortBy === 'priceHighLow') {
      result.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    } else if (sortBy === 'nameAZ') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'nameZA') {
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
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
      setSelectedGenders([]);
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
              placeholder="Search by name or code..." 
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
                  <ProductCard product={product} onTryOn={() => {}} />
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

        .product-card-wrapper {
          transition: transform 0.3s ease;
        }

        .product-card-wrapper:hover {
          transform: translateY(-5px);
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





































// // Products.jsx
// // Updated: Try On button now navigates to TryOn page with the matched frame preselected.
// // Matching logic: product.frameId → glass id (e.g. "/glass3.png")
// // Falls back to "/glass1.png" if no match is found.

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
// import productsData from "../data/data.json";
// import ProductCard from '../components/ProductCard';

// // Utility: derive the GLASS_OPTIONS id for a given product.
// // Strategy (in order of priority):
// //   1. product.frameId  – explicit mapping, most scalable (add to your JSON)
// //   2. product.glassImage – direct path like "/glass5.png"
// //   3. Fallback to "/glass1.png"
// // ---------------------------------------------------------------------------
// export const getFrameIdForProduct = (product) => {
//   if (!product) return '/glass1.png';
//   if (product.frameId)    return product.frameId;    // e.g. "/glass7.png"
//   if (product.glassImage) return product.glassImage; // e.g. "/glass7.png"
//   return '/glass1.png';
// };

// const Products = () => {
//   const navigate = useNavigate();
//   const [products, setProducts]               = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [activeCategory, setActiveCategory]   = useState('all');
//   const [priceRange, setPriceRange]           = useState({ min: '', max: '' });
//   const [selectedShapes, setSelectedShapes]   = useState([]);
//   const [selectedGenders, setSelectedGenders] = useState([]);
//   const [sortBy, setSortBy]                   = useState('default');
//   const [notification, setNotification]       = useState(null);
//   const [searchTerm, setSearchTerm]           = useState('');
//   const [openDropdown, setOpenDropdown]       = useState(null);

//   const searchInputRef = useRef(null);
//   const location       = useLocation();
//   const [searchParams] = useSearchParams();

//   const shapeOptions  = ['Square', 'Oval', 'Round', 'Geometric', 'Wayfarer', 'Vaffer', 'Eye', 'Other'];
//   const genderOptions = ['Men', 'Women', 'Unisex', 'Kids'];

//   const categories = [
//     { id: 'all',             name: 'All Products',       categoryMatch: null },
//     { id: 'men-sunglass',    name: "Men's Sunglass",     categoryMatch: 'men sunglass' },
//     { id: 'men-eyeglass',    name: "Men's Eyeglass",     categoryMatch: 'men eyeglass' },
//     { id: 'women-sunglass',  name: "Women's Sunglass",   categoryMatch: 'woman sunglass' },
//     { id: 'women-eyeglass',  name: "Women's Eyeglass",   categoryMatch: 'women eyeglass' },
//     { id: 'kids-sunglass',   name: "Kids' Sunglass",     categoryMatch: 'kid sunglass' },
//     { id: 'kids-eyeglass',   name: "Kids' Eyeglass",     categoryMatch: 'kids eyeglass' },
//     { id: 'contact-lens',    name: 'Contact Lens',       categoryMatch: 'contactless' },
//   ];

//   useEffect(() => { window.scrollTo(0, 0); }, []);

//   useEffect(() => {
//     if (productsData?.products) {
//       setProducts(productsData.products);
//       setFilteredProducts(productsData.products);
//     }
//   }, []);

//   useEffect(() => {
//     const categoryParam = searchParams.get('category');
//     if (categoryParam) {
//       const matched = categories.find(
//         c => c.categoryMatch === categoryParam || c.id === categoryParam
//       );
//       if (matched && matched.id !== 'all') setActiveCategory(matched.id);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (location.state?.focusSearch && searchInputRef.current) {
//       searchInputRef.current.focus();
//       searchInputRef.current.select();
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state]);

//   const getDisplayPrice = (product) => {
//     const price = product.discountPrice || product.originalPrice;
//     if (!price) return 0;
//     return parseFloat(String(price).replace(/,/g, ''));
//   };

//   // ── Filtering & sorting ─────────────────────────────────────────────────
//   useEffect(() => {
//     let result = [...products];

//     if (searchTerm.trim()) {
//       result = result.filter(p =>
//         p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.code?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (activeCategory !== 'all') {
//       const sel = categories.find(c => c.id === activeCategory);
//       if (sel?.categoryMatch) {
//         result = result.filter(p =>
//           p.category?.toLowerCase() === sel.categoryMatch.toLowerCase()
//         );
//       }
//     }

//     if (selectedGenders.length > 0 && activeCategory === 'all') {
//       result = result.filter(p =>
//         selectedGenders.some(g => p.gender?.toLowerCase().includes(g.toLowerCase()))
//       );
//     }

//     if (priceRange.min) result = result.filter(p => getDisplayPrice(p) >= parseFloat(priceRange.min));
//     if (priceRange.max) result = result.filter(p => getDisplayPrice(p) <= parseFloat(priceRange.max));

//     if (selectedShapes.length > 0 && activeCategory === 'all') {
//       result = result.filter(p => p.shape && selectedShapes.includes(p.shape));
//     }

//     if (sortBy === 'priceLowHigh') result.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
//     else if (sortBy === 'priceHighLow') result.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
//     else if (sortBy === 'nameAZ') result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
//     else if (sortBy === 'nameZA') result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));

//     setFilteredProducts(result);
//   }, [activeCategory, priceRange, selectedShapes, selectedGenders, sortBy, products, searchTerm]);

//   const toggleShape  = (s) => setSelectedShapes(prev  => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
//   const toggleGender = (g) => setSelectedGenders(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

//   const clearFilters = () => {
//     setActiveCategory('all');
//     setPriceRange({ min: '', max: '' });
//     setSelectedShapes([]);
//     setSelectedGenders([]);
//     setSortBy('default');
//     setSearchTerm('');
//     setOpenDropdown(null);
//   };

//   const toggleDropdown     = (name) => setOpenDropdown(openDropdown === name ? null : name);
//   const handleCategoryChange = (id) => {
//     setActiveCategory(id);
//     if (id !== 'all') setSelectedGenders([]);
//   };

//   const addToCart = (product, selectedVariantIndex = 0) => {
//     const saved  = JSON.parse(localStorage.getItem('cart')) || [];
//     const exists = saved.find(i => i.id === product.id);
//     if (exists) {
//       exists.quantity = (exists.quantity || 1) + 1;
//     } else {
//       saved.push({ ...product, quantity: 1, selectedVariant: selectedVariantIndex });
//     }
//     localStorage.setItem('cart', JSON.stringify(saved));
//     window.dispatchEvent(new Event('cartUpdated'));
//     setNotification(`${product.name} added to cart!`);
//     setTimeout(() => setNotification(null), 3000);
//   };

//   // ── Try On handler ──────────────────────────────────────────────────────
//   // Navigates to /try-on (adjust path to match your router) and passes:
//   //   - frameId   : the "/glassN.png" id to auto-select in TryOn
//   //   - productId : for future reference
//   //   - productName : displayed as context in TryOn
//   const handleTryOn = (product) => {
//     const frameId = getFrameIdForProduct(product);
//     navigate('/TryOn', {
//       state: {
//         frameId,
//         productId:   product.id,
//         productName: product.name,
//       },
//     });
//   };

//   return (
//     <div className="products-page">
//       {notification && <div className="notification">{notification}</div>}

//       <div className="container">
//         <h1 className="page-title">Our Products</h1>
//         <p className="page-subtitle">Discover premium eyewear for every style and need</p>

//         {/* Category Tabs */}
//         <div className="category-tabs">
//           {categories.map(cat => (
//             <button
//               key={cat.id}
//               className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
//               onClick={() => handleCategoryChange(cat.id)}
//             >
//               {cat.name}
//             </button>
//           ))}
//         </div>

//         {/* Filter Bar – only when "All Products" is active */}
//         {activeCategory === 'all' && (
//           <div className="filter-bar">
//             <div className="filter-dropdown-group">
//               {/* Shape */}
//               <div className="dropdown-container">
//                 <button
//                   className={`dropdown-btn ${selectedShapes.length > 0 ? 'highlight' : ''}`}
//                   onClick={() => toggleDropdown('shape')}
//                 >
//                   Shape <span className={`arrow ${openDropdown === 'shape' ? 'up' : 'down'}`} />
//                 </button>
//                 {openDropdown === 'shape' && (
//                   <div className="dropdown-menu">
//                     {shapeOptions.map(s => (
//                       <label key={s} className="dropdown-item">
//                         <input type="checkbox" checked={selectedShapes.includes(s)} onChange={() => toggleShape(s)} />
//                         {s}
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Gender */}
//               <div className="dropdown-container">
//                 <button
//                   className={`dropdown-btn ${selectedGenders.length > 0 ? 'highlight' : ''}`}
//                   onClick={() => toggleDropdown('gender')}
//                 >
//                   Gender <span className={`arrow ${openDropdown === 'gender' ? 'up' : 'down'}`} />
//                 </button>
//                 {openDropdown === 'gender' && (
//                   <div className="dropdown-menu">
//                     {genderOptions.map(g => (
//                       <label key={g} className="dropdown-item">
//                         <input type="checkbox" checked={selectedGenders.includes(g)} onChange={() => toggleGender(g)} />
//                         {g}
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Price */}
//               <div className="dropdown-container">
//                 <button
//                   className={`dropdown-btn ${priceRange.min || priceRange.max ? 'highlight' : ''}`}
//                   onClick={() => toggleDropdown('price')}
//                 >
//                   Price <span className={`arrow ${openDropdown === 'price' ? 'up' : 'down'}`} />
//                 </button>
//                 {openDropdown === 'price' && (
//                   <div className="dropdown-menu price-menu">
//                     <input
//                       type="number" placeholder="Min PKR" value={priceRange.min}
//                       onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
//                     />
//                     <input
//                       type="number" placeholder="Max PKR" value={priceRange.max}
//                       onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
//                     />
//                   </div>
//                 )}
//               </div>

//               <button className="text-clear-btn" onClick={clearFilters}>Reset All</button>
//             </div>

//             <div className="sort-section">
//               <select className="sort-minimal" value={sortBy} onChange={e => setSortBy(e.target.value)}>
//                 <option value="default">Sort: Featured</option>
//                 <option value="priceLowHigh">Price: Low to High</option>
//                 <option value="priceHighLow">Price: High to Low</option>
//                 <option value="nameAZ">Name: A to Z</option>
//               </select>
//             </div>
//           </div>
//         )}

//         {/* Sort-only bar for category pages */}
//         {activeCategory !== 'all' && (
//           <div className="simple-sort-bar">
//             <div className="sort-section">
//               <select className="sort-minimal" value={sortBy} onChange={e => setSortBy(e.target.value)}>
//                 <option value="default">Sort: Featured</option>
//                 <option value="priceLowHigh">Price: Low to High</option>
//                 <option value="priceHighLow">Price: High to Low</option>
//                 <option value="nameAZ">Name: A to Z</option>
//               </select>
//             </div>
//           </div>
//         )}

//         {/* Products grid */}
//         <main className="products-main">
//           <div className="search-row">
//             <input
//               type="text"
//               ref={searchInputRef}
//               className="minimal-search"
//               placeholder="Search by name or code..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//             />
//             <p className="count-text">{filteredProducts.length} items found</p>
//           </div>

//           {filteredProducts.length === 0 ? (
//             <div className="no-products">
//               <p>No products found in this category.</p>
//               <button onClick={clearFilters}>Browse All Products</button>
//             </div>
//           ) : (
//             <div className="products-grid">
//               {filteredProducts.map(product => (
//                 <div key={product.id} className="product-card-wrapper">
//                   {/*
//                     ProductCard receives onTryOn so its internal "Try On" button
//                     can call back here. If your ProductCard doesn't support onTryOn
//                     yet, the inline overlay button below acts as a fallback.
//                   */}
//                   <ProductCard
//                     product={product}
//                     onTryOn={() => handleTryOn(product)}
//                   />

//                   {/*
//                     Fallback overlay "Try On" button – only renders when
//                     ProductCard does NOT render its own Try On button.
//                     Remove this block if ProductCard already calls onTryOn.
//                   */}
//                   <button
//                     className="try-on-overlay-btn"
//                     onClick={() => handleTryOn(product)}
//                     aria-label={`Try on ${product.name} virtually`}
//                   >
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//                       <circle cx="12" cy="12" r="3" />
//                       <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
//                     </svg>
//                     Try On
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>

//       <style jsx>{`
//         .products-page {
//           font-family: 'Inter', sans-serif;
//           background: #fff;
//           padding: 40px 0;
//         }

//         .container { max-width: 1300px; margin: 0 auto; padding: 0 20px; }

//         .page-title { text-align: center; font-size: 2rem; margin-bottom: 8px; font-weight: 700; }
//         .page-subtitle { text-align: center; color: #777; margin-bottom: 40px; }

//         /* ── Category Tabs ── */
//         .category-tabs {
//           display: flex;
//           justify-content: center;
//           gap: 12px;
//           margin-bottom: 30px;
//           flex-wrap: wrap;
//           position: sticky;
//           top: 70px;
//           background: #fff;
//           padding: 10px 0;
//           z-index: 50;
//           border-bottom: 1px solid #f0f0f0;
//         }
//         .category-tab {
//           padding: 10px 24px;
//           border: 1px solid #ddd;
//           background: #fff;
//           cursor: pointer;
//           border-radius: 30px;
//           transition: 0.3s;
//           font-weight: 500;
//           font-size: 14px;
//           white-space: nowrap;
//         }
//         .category-tab:hover  { background: #f5f5f5; border-color: #999; }
//         .category-tab.active { background: #000; color: #fff; border-color: #000; }

//         /* ── Filter Bar ── */
//         .filter-bar, .simple-sort-bar {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-top: 1px solid #eee;
//           border-bottom: 1px solid #eee;
//           padding: 15px 0;
//           margin-bottom: 20px;
//         }
//         .simple-sort-bar { justify-content: flex-end; border-top: none; }
//         .filter-dropdown-group { display: flex; gap: 25px; align-items: center; flex-wrap: wrap; }
//         .dropdown-container { position: relative; }
//         .dropdown-btn {
//           background: none; border: none; font-size: 1rem; cursor: pointer;
//           font-weight: 500; display: flex; align-items: center; gap: 8px; padding: 8px 0;
//         }
//         .dropdown-btn.highlight { color: #d9534f; }
//         .dropdown-menu {
//           position: absolute; top: 100%; left: 0; background: #fff;
//           border: 1px solid #eee; box-shadow: 0 10px 20px rgba(0,0,0,0.10);
//           padding: 15px; min-width: 180px; display: flex; flex-direction: column;
//           gap: 10px; margin-top: 10px; border-radius: 8px; z-index: 100;
//         }
//         .dropdown-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; }
//         .price-menu { width: 220px; flex-direction: row; gap: 10px; }
//         .price-menu input { width: 50%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
//         .price-menu input:focus { outline: none; border-color: #000; }
//         .text-clear-btn { background: none; border: none; color: #888; text-decoration: underline; cursor: pointer; font-size: 0.9rem; }
//         .text-clear-btn:hover { color: #000; }
//         .arrow { border: solid black; border-width: 0 1.5px 1.5px 0; display: inline-block; padding: 3px; transition: 0.2s; }
//         .down { transform: rotate(45deg); }
//         .up   { transform: rotate(-135deg); }

//         /* ── Grid ── */
//         .search-row {
//           display: flex; justify-content: space-between; align-items: center;
//           margin-bottom: 30px; flex-wrap: wrap; gap: 15px;
//         }
//         .minimal-search {
//           border: none; border-bottom: 2px solid #eee; padding: 10px 0;
//           width: 280px; outline: none; font-size: 15px; transition: 0.3s;
//         }
//         .minimal-search:focus { border-bottom-color: #000; }
//         .count-text { color: #888; font-size: 0.9rem; font-weight: 500; }

//         .products-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//           gap: 30px;
//         }

//         /* ── Product card wrapper ── */
//         .product-card-wrapper {
//           position: relative;
//           transition: transform 0.3s ease;
//         }
//         .product-card-wrapper:hover { transform: translateY(-5px); }

//         /* ── Try On overlay button ──
//            Sits at the bottom of each card. Hide this if ProductCard
//            already renders its own onTryOn trigger.                   */
//         .try-on-overlay-btn {
//           position: absolute;
//           bottom: 12px;I
//           right: 12px;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           padding: 8px 16px;
//           border-radius: 999px;
//           font-size: 12px;
//           font-weight: 700;
//           letter-spacing: 0.4px;
//           cursor: pointer;
//           border: none;
//           color: #fff;
//           background: linear-gradient(135deg, #000 0%, #333 100%);
//           box-shadow: 0 4px 14px rgba(0,0,0,0.25);
//           transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
//           z-index: 10;
//         }
//         .TryOn-overlay-btn:hover {
//           background: linear-gradient(135deg, #1a1a1a 0%, #444 100%);
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(0,0,0,0.30);
//         }
//         .TryOn-overlay-btn:active { transform: scale(0.95); }

//         /* ── Notification ── */
//         .notification {
//           position: fixed; top: 20px; right: 20px; background: #28a745; color: #fff;
//           padding: 12px 24px; border-radius: 8px; z-index: 1000;
//           animation: slideIn 0.3s ease; font-weight: 500;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//         }

//         .no-products {
//           text-align: center; padding: 80px 20px; background: #fafafa; border-radius: 12px;
//         }
//         .no-products p { font-size: 18px; color: #666; margin-bottom: 20px; }
//         .no-products button {
//           padding: 12px 28px; background: #000; color: #fff; border: none;
//           cursor: pointer; border-radius: 30px; font-size: 14px; font-weight: 500; transition: 0.3s;
//         }
//         .no-products button:hover { background: #333; transform: translateY(-2px); }

//         @keyframes slideIn {
//           from { transform: translateX(100%); opacity: 0; }
//           to   { transform: translateX(0);    opacity: 1; }
//         }

//         /* ── Responsive ── */
//         @media (max-width: 768px) {
//           .category-tabs {
//             gap: 8px; overflow-x: auto; justify-content: flex-start;
//             padding-bottom: 8px; scrollbar-width: thin;
//           }
//           .category-tab { padding: 8px 18px; font-size: 12px; white-space: nowrap; }
//           .filter-bar { flex-direction: column; gap: 15px; align-items: flex-start; }
//           .filter-dropdown-group { gap: 15px; }
//           .products-grid { gap: 20px; }
//           .minimal-search { width: 100%; }
//           .try-on-overlay-btn { bottom: 8px; right: 8px; padding: 6px 12px; font-size: 11px; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Products;




























































