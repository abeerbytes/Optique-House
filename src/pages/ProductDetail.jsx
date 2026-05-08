// components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productsData from '../data/data.json';

// ==================== Helper Components ====================

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < fullStars
              ? 'text-yellow-400 fill-current'
              : i === fullStars && hasHalfStar
              ? 'text-yellow-400 fill-current opacity-50'
              : 'text-gray-300 fill-current'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-500 ml-2">({rating})</span>
    </div>
  );
};

const QuantitySelector = ({ quantity, setQuantity, maxStock = 10 }) => {
  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increase = () => setQuantity((prev) => Math.min(maxStock, prev + 1));

  return (
    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
      <button
        onClick={decrease}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
        aria-label="Decrease quantity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
        </svg>
      </button>
      <span className="w-12 text-center font-medium text-gray-800">{quantity}</span>
      <button
        onClick={increase}
        className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
        aria-label="Increase quantity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

const ColorVariantSelector = ({ variants, selectedVariant, setSelectedVariant }) => {
  if (!variants || variants.length === 0) return null;
  const totalColors = variants.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Color / Variant</label>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {totalColors} {totalColors === 1 ? 'Color' : 'Colors'} Available
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.colorName === variant.colorName;
          return (
            <label
              key={variant.colorName}
              className={`
                relative flex items-center gap-3 px-4 py-2 rounded-full border cursor-pointer
                transition-all duration-200 ease-out
                ${isSelected
                  ? 'border-black bg-black text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm'
                }
              `}
            >
              <input
                type="radio"
                name="productColor"
                value={variant.colorName}
                checked={isSelected}
                onChange={() => setSelectedVariant(variant)}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded-full border border-white/30 shadow-sm"
                style={{ backgroundColor: variant.hex || '#E8F4F8' }}
              />
              <span className="text-sm font-medium">{variant.colorName}</span>
              {isSelected && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </label>
          );
        })}
      </div>
      {selectedVariant && (
        <p className="text-sm text-gray-500 mt-2 animate-fade-in">
          Selected: <span className="font-medium text-gray-900">{selectedVariant.colorName}</span>
        </p>
      )}
    </div>
  );
};

// ==================== PROFESSIONAL SCROLL NUMBER INPUT WITH SIGN DISPLAY ====================
const ScrollNumberInput = ({ 
  value, 
  onChange, 
  min = -20, 
  max = 20, 
  step = 0.25, 
  label, 
  unit = '', 
  required = false,
  placeholder = "0.00",
  description = "",
  showSign = true,
  allowNegative = true
}) => {
  const displayValue = value === '' || value === undefined || value === null ? '' : value;
  
  // Format value with sign for display
  const getFormattedValue = () => {
    if (displayValue === '' || displayValue === '-') return '';
    const num = parseFloat(displayValue);
    if (isNaN(num)) return '';
    if (!showSign) return num.toString();
    if (num > 0) return `+${num}`;
    if (num < 0) return `${num}`;
    return '0';
  };
  
  const handleIncrement = () => {
    let currentValue = typeof value === 'number' ? value : 0;
    let newValue = currentValue + step;
    newValue = Math.round(newValue / step) * step;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    let currentValue = typeof value === 'number' ? value : 0;
    let newValue = currentValue - step;
    newValue = Math.round(newValue / step) * step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e) => {
    let rawValue = e.target.value;
    // Remove any + sign from input
    rawValue = rawValue.replace(/\+/g, '');
    
    if (rawValue === '' || rawValue === '-') {
      onChange(rawValue);
      return;
    }
    let numValue = parseFloat(rawValue);
    if (!isNaN(numValue)) {
      let rounded = Math.round(numValue / step) * step;
      rounded = Math.min(max, Math.max(min, rounded));
      onChange(rounded);
    }
  };

  const preventScroll = (e) => {
    e.preventDefault();
  };

  const isValid = () => {
    if (!required) return true;
    return value !== '' && value !== undefined && value !== null && value !== '-';
  };

  // Get color class based on value
  const getValueColorClass = () => {
    if (displayValue === '' || displayValue === '-') return 'text-gray-800';
    const num = parseFloat(displayValue);
    if (isNaN(num)) return 'text-gray-800';
    if (num > 0) return 'text-green-600';
    if (num < 0) return 'text-red-600';
    return 'text-gray-800';
  };

  return (
    <div className="w-full h-full flex flex-col">
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-[10px] text-gray-400 mb-2">{description}</p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-all duration-150 text-gray-700"
          aria-label={`Decrease ${label}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
          </svg>
        </button>
        
        <div className={`relative flex-1 ${!isValid() && required ? 'ring-2 ring-red-500 rounded-lg' : ''}`}>
          <input
            type="text"
            value={getFormattedValue()}
            onChange={handleInputChange}
            onWheel={preventScroll}
            placeholder={placeholder}
            className={`w-full text-center py-2.5 px-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm font-medium [appearance:textfield] transition-all ${getValueColorClass()} ${
              !isValid() && required ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none font-medium">
              {unit}
            </span>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleIncrement}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-all duration-150 text-gray-700"
          aria-label={`Increase ${label}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      <div className="flex justify-between items-center mt-1.5">
        <span className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">
          Range: {min} to {max}
        </span>
        <span className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">
          Step: {step}
        </span>
      </div>
      {!isValid() && required && (
        <p className="text-red-500 text-[10px] mt-1">Required</p>
      )}
    </div>
  );
};

// ==================== PRESCRIPTION FORM ====================
const PrescriptionForm = ({ show, onClose, onSave, existingPrescription = null }) => {
  const [lensType, setLensType] = useState(existingPrescription?.lensType || 'standard');
  
  // Right eye first, then left eye
  const [rightEye, setRightEye] = useState(
    existingPrescription?.rightEye || {
      sphere: '',
      cylinder: '',
      axis: '',
      addition: '',
    }
  );
  const [leftEye, setLeftEye] = useState(
    existingPrescription?.leftEye || {
      sphere: '',
      cylinder: '',
      axis: '',
      addition: '',
    }
  );
  
  const [errors, setErrors] = useState({});

  const lensOptions = [
    { id: 'standard', name: 'Standard Lenses', price: 850, description: 'Clear vision with anti-reflective coating' },
    { id: 'blueCut', name: 'Blue Cut Lenses', price: 1800, description: 'Protects against harmful blue light' },
    { id: 'photochromic', name: 'Photochromic Lenses', price: 2500, description: 'Automatically darken in sunlight' },
  ];

  const selectedLens = lensOptions.find((l) => l.id === lensType) || lensOptions[0];

  const isAxisRequired = (eye) => {
    return eye.cylinder !== '' && eye.cylinder !== undefined && eye.cylinder !== null && eye.cylinder !== 0;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isAxisRequired(rightEye) && (!rightEye.axis || rightEye.axis === '')) {
      newErrors.right_axis = 'Axis is required when Cylinder has a value';
    }
    
    if (isAxisRequired(leftEye) && (!leftEye.axis || leftEye.axis === '')) {
      newErrors.left_axis = 'Axis is required when Cylinder has a value';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRightChange = (field, value) => {
    setRightEye((prev) => ({ ...prev, [field]: value }));
    if (field === 'cylinder' && (!value || value === 0)) {
      setErrors((prev) => ({ ...prev, right_axis: '' }));
    }
    if (field === 'axis' && errors.right_axis) {
      setErrors((prev) => ({ ...prev, right_axis: '' }));
    }
  };

  const handleLeftChange = (field, value) => {
    setLeftEye((prev) => ({ ...prev, [field]: value }));
    if (field === 'cylinder' && (!value || value === 0)) {
      setErrors((prev) => ({ ...prev, left_axis: '' }));
    }
    if (field === 'axis' && errors.left_axis) {
      setErrors((prev) => ({ ...prev, left_axis: '' }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    const prescriptionData = {
      lensType,
      lensName: selectedLens.name,
      lensPrice: selectedLens.price,
      rightEye,
      leftEye,
    };
    onSave(prescriptionData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full p-6 transform animate-slide-up max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Prescription Details</h3>
            <p className="text-xs text-gray-500 mt-0.5">Enter your optical prescription information</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs text-blue-800">
              <p><span className="font-semibold">Note:</span> All fields are optional.</p>
              <p className="mt-0.5">• <strong>Sphere & Cylinder</strong> can be positive (+) or negative (-)</p>
              <p>• <strong>Axis</strong> is only required if Cylinder has a value (0-180°)</p>
              <p>• <strong>Addition</strong> is only positive values (+)</p>
            </div>
          </div>
        </div>

        {/* Lens Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Select Lens Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lensOptions.map((lens) => (
              <label
                key={lens.id}
                className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  lensType === lens.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="lensType"
                  value={lens.id}
                  checked={lensType === lens.id}
                  onChange={() => setLensType(lens.id)}
                  className="sr-only"
                />
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-semibold text-sm ${lensType === lens.id ? 'text-black' : 'text-gray-800'}`}>
                    {lens.name}
                  </span>
                  <span className={`font-bold text-sm ${lensType === lens.id ? 'text-black' : 'text-gray-700'}`}>
                    +₹{lens.price}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500">{lens.description}</p>
                {lensType === lens.id && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT EYE (First) */}
        <div className="mb-6 bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-800">Right Eye</h4>
              <p className="text-[10px] text-gray-500">OD (Oculus Dexter)</p>
            </div>
          </div>
          
          {/* 4-column grid for perfect alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ScrollNumberInput
              label="Sphere (Power)"
              value={rightEye.sphere === '' ? '' : parseFloat(rightEye.sphere) || 0}
              onChange={(val) => handleRightChange('sphere', val)}
              min={-20}
              max={20}
              step={0.25}
              unit="D"
              required={false}
              placeholder="0.00"
              description="Distance correction (±)"
              showSign={true}
              allowNegative={true}
            />
            
            <ScrollNumberInput
              label="Cylinder"
              value={rightEye.cylinder === '' ? '' : parseFloat(rightEye.cylinder) || 0}
              onChange={(val) => handleRightChange('cylinder', val)}
              min={-6}
              max={6}
              step={0.25}
              unit="D"
              required={false}
              placeholder="0.00"
              description="Astigmatism (±)"
              showSign={true}
              allowNegative={true}
            />
            
            <div>
              <ScrollNumberInput
                label="Axis"
                value={rightEye.axis === '' ? '' : parseFloat(rightEye.axis) || 0}
                onChange={(val) => handleRightChange('axis', val)}
                min={0}
                max={180}
                step={1}
                unit="°"
                required={isAxisRequired(rightEye)}
                placeholder="0"
                description="0-180 degrees"
                showSign={false}
                allowNegative={false}
              />
              {errors.right_axis && (
                <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.right_axis}
                </p>
              )}
            </div>
            
            <ScrollNumberInput
              label="Addition"
              value={rightEye.addition === '' ? '' : parseFloat(rightEye.addition) || 0}
              onChange={(val) => handleRightChange('addition', val)}
              min={0}
              max={3.5}
              step={0.25}
              unit="D"
              required={false}
              placeholder="0.00"
              description="Reading/Multifocal (+ only)"
              showSign={true}
              allowNegative={false}
            />
          </div>
        </div>

        {/* LEFT EYE (Second) */}
        <div className="mb-6 bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-800">Left Eye</h4>
              <p className="text-[10px] text-gray-500">OS (Oculus Sinister)</p>
            </div>
          </div>
          
          {/* 4-column grid for perfect alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ScrollNumberInput
              label="Sphere (Power)"
              value={leftEye.sphere === '' ? '' : parseFloat(leftEye.sphere) || 0}
              onChange={(val) => handleLeftChange('sphere', val)}
              min={-20}
              max={20}
              step={0.25}
              unit="D"
              required={false}
              placeholder="0.00"
              description="Distance correction (±)"
              showSign={true}
              allowNegative={true}
            />
            
            <ScrollNumberInput
              label="Cylinder"
              value={leftEye.cylinder === '' ? '' : parseFloat(leftEye.cylinder) || 0}
              onChange={(val) => handleLeftChange('cylinder', val)}
              min={-6}
              max={6}
              step={0.25}
              unit="D"
              required={false}
              placeholder="0.00"
              description="Astigmatism (±)"
              showSign={true}
              allowNegative={true}
            />
            
            <div>
              <ScrollNumberInput
                label="Axis"
                value={leftEye.axis === '' ? '' : parseFloat(leftEye.axis) || 0}
                onChange={(val) => handleLeftChange('axis', val)}
                min={0}
                max={180}
                step={1}
                unit="°"
                required={isAxisRequired(leftEye)}
                placeholder="0"
                description="0-180 degrees"
                showSign={false}
                allowNegative={false}
              />
              {errors.left_axis && (
                <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.left_axis}
                </p>
              )}
            </div>
            
            <ScrollNumberInput
              label="Addition"
              value={leftEye.addition === '' ? '' : parseFloat(leftEye.addition) || 0}
              onChange={(val) => handleLeftChange('addition', val)}
              min={0}
              max={3.5}
              step={0.25}
              unit="D"
              required={false}
              placeholder="0.00"
              description="Reading/Multifocal (+ only)"
              showSign={true}
              allowNegative={false}
            />
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-100 rounded-lg p-3 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Lens Extra Charge:</span>
            <span className="font-bold text-xl text-black">+₹{selectedLens.price}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-black text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN PRODUCT DETAIL COMPONENT ====================
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState('');
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Load product from imported JSON
  useEffect(() => {
    try {
      setLoading(true);
      const products = Array.isArray(productsData) ? productsData : productsData.products || [];
      const productId = parseInt(id);
      const foundProduct = products.find((p) => p.id === productId);

      if (!foundProduct) throw new Error('Product not found');

      const transformedProduct = {
        id: foundProduct.id,
        name: foundProduct.name,
        discount: foundProduct.discount || '0%',
        madeInTaiwan: foundProduct.madeInTaiwan || false,
        originalPrice: parseFloat(foundProduct.originalPrice.toString().replace(/,/g, '')),
        discountPrice: parseFloat(foundProduct.discountPrice.toString().replace(/,/g, '')),
        reviews: foundProduct.reviews || 0,
        rating: foundProduct.rating || 4.5,
        description:
          foundProduct.description ||
          `Experience style and comfort with our ${foundProduct.name}. Crafted with premium materials.`,
        features: foundProduct.features || [
          'Premium quality material',
          'UV protection coating',
          'Scratch resistant',
          'Lightweight design',
          'Comfort fit',
        ],
        specifications: foundProduct.specifications || {
          Material: 'Premium Plastic/Metal',
          'Frame Type': foundProduct.shape || 'Standard',
          Gender: foundProduct.gender || 'Unisex',
          Warranty: '1 Year Manufacturing Warranty',
        },
        variants: foundProduct.variants || [],
        images: [...new Map((foundProduct.variants || []).map((v) => [v.image, v.image])).values()],
        category: foundProduct.category || 'eyeglasses',
        inStock: foundProduct.inStock !== undefined ? foundProduct.inStock : true,
        freeShipping: foundProduct.freeShipping !== undefined ? foundProduct.freeShipping : true,
        warranty: foundProduct.warranty || '30-day satisfaction guarantee',
        shape: foundProduct.shape || 'Standard',
        gender: foundProduct.gender || 'Unisex',
      };

      setProduct(transformedProduct);
      if (transformedProduct.variants && transformedProduct.variants.length > 0) {
        setSelectedVariant(transformedProduct.variants[0]);
        setCurrentImage(transformedProduct.variants[0].image);
      } else if (transformedProduct.images && transformedProduct.images.length > 0) {
        setCurrentImage(transformedProduct.images[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading product:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (selectedVariant && selectedVariant.image) {
      setCurrentImage(selectedVariant.image);
      setActiveImageIndex(-1);
    } else if (product && product.images && product.images[0]) {
      setCurrentImage(product.images[0]);
      setActiveImageIndex(0);
    }
  }, [selectedVariant, product]);

  const handleThumbnailClick = (img, idx) => {
    setCurrentImage(img);
    setActiveImageIndex(idx);
  };

  // Calculate total price (frame + lens extra)
  const getFramePrice = () => {
    return product?.discountPrice || product?.originalPrice || 0;
  };

  const getLensExtraCharge = () => {
    return prescriptionData?.lensPrice || 0;
  };

  const getTotalItemPrice = () => {
    return getFramePrice() + getLensExtraCharge();
  };

  // Add to cart with prescription and lens extra charge
  const addToCart = () => {
    if (!product) return;

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartItem = {
      id: product.id,
      name: product.name,
      framePrice: getFramePrice(),
      lensExtraCharge: getLensExtraCharge(),
      totalPrice: getTotalItemPrice(),
      quantity: quantity,
      selectedVariant: selectedVariant,
      image: selectedVariant?.image || product.images[0],
      prescription: prescriptionData || null,
    };

    // Check if same product, variant, and prescription lens type already exists
    const existingIndex = existingCart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.selectedVariant?.colorName === cartItem.selectedVariant?.colorName &&
        item.prescription?.lensType === cartItem.prescription?.lensType
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch event to update navbar cart badge
    window.dispatchEvent(new Event('cartUpdated'));
    
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const handleAddToCart = () => addToCart();
  const handleBuyNow = () => {
    addToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error || 'Product Not Found'}</h2>
          <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-3 rounded-full">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const discountPercent = product.discount
    ? parseInt(product.discount)
    : Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100);
  const finalFramePrice = getFramePrice();
  const lensCharge = getLensExtraCharge();
  const totalItemPrice = getTotalItemPrice();

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate('/')} className="hover:text-black transition-colors">
            Home
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <button onClick={() => navigate('/')} className="hover:text-black transition-colors capitalize">
            {product.category?.replace('-', ' ') || 'Shop'}
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(img, idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-black shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.discount && parseFloat(product.discount) > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
              {product.madeInTaiwan && (
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  🇹🇼 Made in Taiwan
                </span>
              )}
              {product.freeShipping && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Free Shipping
                </span>
              )}
              {product.inStock ? (
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <StarRating rating={product.rating || 4.5} />
              <span className="text-sm text-gray-500">{product.reviews} reviews</span>
            </div>

            {/* Price Breakdown */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">₹{finalFramePrice.toLocaleString()}</span>
                {product.originalPrice !== finalFramePrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-green-600 font-semibold">{product.discount} off</span>
                  </>
                )}
              </div>
              {prescriptionData && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">+ Lens extra: </span>
                  <span className="font-semibold text-blue-600">₹{lensCharge.toLocaleString()}</span>
                  <span className="text-gray-500 ml-2">({prescriptionData.lensName})</span>
                </div>
              )}
              {prescriptionData && (
                <div className="mt-1 text-md font-bold">
                  Total: <span className="text-black">₹{totalItemPrice.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{product.description}</p>

            {/* Color Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <ColorVariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
              />
            )}

            {/* Prescription Block - shown for all eyeglasses */}
            <div className="bg-blue-50 rounded-2xl p-4 shadow-inner">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-blue-800 font-medium">Prescription Lenses (Extra Charge)</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Add your prescription details and choose lens type. Extra charges apply.
                  </p>
                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="text-xs text-blue-700 font-semibold underline mt-2 hover:text-blue-900"
                  >
                    {prescriptionData ? 'Edit Prescription →' : 'Add Prescription →'}
                  </button>
                  {prescriptionData && (
                    <div className="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded-lg">
                      <p>✓ {prescriptionData.lensName} added (+₹{prescriptionData.lensPrice})</p>
                      <p className="text-gray-600 mt-1">
                        {prescriptionData.rightEye.sphere && prescriptionData.rightEye.sphere !== '' 
                          ? `Right: ${prescriptionData.rightEye.sphere > 0 ? '+' : ''}${prescriptionData.rightEye.sphere}D` 
                          : 'Right: Not specified'}
                        {' | '}
                        {prescriptionData.leftEye.sphere && prescriptionData.leftEye.sphere !== '' 
                          ? `Left: ${prescriptionData.leftEye.sphere > 0 ? '+' : ''}${prescriptionData.leftEye.sphere}D` 
                          : 'Left: Not specified'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} maxStock={20} />

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md"
              >
                Buy Now
              </button>
            </div>

            {/* Added to cart notification */}
            {showAddedToCart && (
              <div className="fixed top-24 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-slide-up">
                ✓ Added to cart!
              </div>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs Section */}
        <div className="mt-20">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
              {['Features', 'Specifications', 'Shipping & Returns'].map((tab, idx) => (
                <button
                  key={tab}
                  className={`pb-4 text-lg font-medium transition-colors whitespace-nowrap ${
                    idx === 0 ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="py-8">
            <div className="space-y-4">
              <ul className="grid md:grid-cols-2 gap-3">
                {product.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="py-16 mt-8 border-t border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">You May Also Like</h2>
              <p className="text-gray-500 mt-1">Complete your look with these favorites</p>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-w-[260px] flex-shrink-0 bg-gray-50 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-200 rounded-xl mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                </div>
                <h4 className="font-semibold">Style Collection #{item}</h4>
                <p className="text-sm text-gray-500">From ₹2,999</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Prescription Modal */}
      <PrescriptionForm
        show={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        onSave={(data) => setPrescriptionData(data)}
        existingPrescription={prescriptionData}
      />

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-6 h-6" alt="WhatsApp" />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(1.1); }
          66% { transform: translate(20px, -20px) scale(0.9); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: floatDelayed 25s ease-in-out infinite; }
        .animate-slide-up { animation: fadeSlideUp 0.3s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      ` }} />
    </div>
  );
};

export default ProductDetail;