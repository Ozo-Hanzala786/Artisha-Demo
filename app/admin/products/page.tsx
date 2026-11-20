'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Download,
  CheckCircle2,
  X,
  Tag,
  Package,
  Sparkles,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formSalePrice, setFormSalePrice] = useState('');
  const [formCostPrice, setFormCostPrice] = useState('');
  const [formStock, setFormStock] = useState('10');
  const [formLowStock, setFormLowStock] = useState('5');
  const [formDescription, setFormDescription] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formImages, setFormImages] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formCare, setFormCare] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState(false);
  const [formStatus, setFormStatus] = useState('PUBLISHED');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (searchQuery) sp.set('q', searchQuery);
      if (categoryFilter) sp.set('category', categoryFilter);
      if (statusFilter) sp.set('status', statusFilter);

      const res = await fetch(`/api/admin/products?${sp.toString()}`);
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`ART-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategoryId(categories[0]?.id || '');
    setFormPrice('');
    setFormSalePrice('');
    setFormCostPrice('');
    setFormStock('10');
    setFormLowStock('5');
    setFormDescription('');
    setFormShortDesc('');
    setFormImages('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800');
    setFormMaterial('Pure Artisanal Silk');
    setFormCare('Dry clean only');
    setFormIsFeatured(false);
    setFormIsBestseller(false);
    setFormIsNewArrival(true);
    setFormStatus('PUBLISHED');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormCategoryId(product.categoryId);
    setFormPrice(product.price.toString());
    setFormSalePrice(product.salePrice ? product.salePrice.toString() : '');
    setFormCostPrice(product.costPrice ? product.costPrice.toString() : '');
    setFormStock(product.stock.toString());
    setFormLowStock(product.lowStockThreshold.toString());
    setFormDescription(product.description || '');
    setFormShortDesc(product.shortDescription || '');

    let imgUrls = '';
    try {
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      imgUrls = Array.isArray(parsed) ? parsed.join(', ') : parsed;
    } catch {
      imgUrls = product.images;
    }
    setFormImages(imgUrls);

    setFormMaterial(product.material || '');
    setFormCare(product.careInstructions || '');
    setFormIsFeatured(product.isFeatured);
    setFormIsBestseller(product.isBestseller);
    setFormIsNewArrival(product.isNewArrival);
    setFormStatus(product.status);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    const imageArray = formImages
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);

    const payload = {
      name: formName,
      sku: formSku,
      categoryId: formCategoryId,
      price: parseFloat(formPrice),
      salePrice: formSalePrice ? parseFloat(formSalePrice) : null,
      costPrice: formCostPrice ? parseFloat(formCostPrice) : 0,
      stock: parseInt(formStock) || 0,
      lowStockThreshold: parseInt(formLowStock) || 5,
      description: formDescription,
      shortDescription: formShortDesc,
      images: JSON.stringify(imageArray),
      material: formMaterial,
      careInstructions: formCare,
      isFeatured: formIsFeatured,
      isBestseller: formIsBestseller,
      isNewArrival: formIsNewArrival,
      status: formStatus,
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to archive or remove "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Sale Price', 'Cost Price', 'Stock', 'Status'];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      `"${p.category?.name || ''}"`,
      p.price,
      p.salePrice || '',
      p.costPrice || '',
      p.stock,
      p.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `artisha_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Catalogue Management
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Products &amp; Creations
          </h1>
          <p className="text-xs text-[#7E7873]">
            Create, price, configure variants, and control stock availability across collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 bg-white border border-[#D4C5B3] px-3.5 py-2 text-xs font-semibold rounded-xs hover:bg-[#FAF8F5] transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 bg-[#6B1724] hover:bg-[#500F1A] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E6DFD5] p-4 rounded-xs shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by title, SKU, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D4C5B3] pl-8 pr-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
            />
            <Search className="w-3.5 h-3.5 text-[#7E7873] absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            className="bg-[#1F1D1D] text-white px-3.5 py-2 rounded-xs font-medium hover:bg-[#6B1724] transition-colors"
          >
            Filter
          </button>
        </form>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-[#6B1724]"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6DFD5] text-[10px] uppercase font-bold text-[#7E7873]">
              <tr>
                <th className="py-3.5 px-4">Creation</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Cost Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#7E7873]">
                    Loading boutique catalogue...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#7E7873]">
                    No products matched your search criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  let img = '';
                  try {
                    const parsed = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
                    img = parsed[0] || '';
                  } catch {
                    img = '';
                  }

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 bg-[#F5EFE6] rounded-xs overflow-hidden shrink-0 border border-[#E6DFD5]">
                            {img && <img src={img} alt={p.name} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <span className="font-semibold text-[#1F1D1D] block max-w-xs truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-[#7E7873]">
                              {p.variants?.length || 0} variants configured
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#7E7873]">{p.sku}</td>
                      <td className="py-3 px-4 text-[#1F1D1D] font-medium">{p.category?.name}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#6B1724]">
                          Rs. {p.price.toLocaleString()}
                        </span>
                        {p.salePrice && (
                          <span className="block text-[10px] text-emerald-700 font-medium">
                            Sale: Rs. {p.salePrice.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#7E7873]">
                        Rs. {p.costPrice ? p.costPrice.toLocaleString() : '0'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-xs font-bold text-[10px] ${
                            p.stock <= 0
                              ? 'bg-red-100 text-red-800'
                              : p.stock <= p.lowStockThreshold
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {p.isBestseller && (
                            <span className="bg-[#6B1724] text-white text-[9px] px-1.5 py-0.2 rounded-xs font-semibold">
                              Bestseller
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="bg-[#C2A26F] text-[#1F1D1D] text-[9px] px-1.5 py-0.2 rounded-xs font-semibold">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-xs ${
                            p.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : p.status === 'DRAFT'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1 text-[#7E7873] hover:text-[#6B1724] transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1 text-[#A89F91] hover:text-red-700 transition-colors"
                            title="Archive / Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-xs shadow-2xl border border-[#E6DFD5] overflow-hidden my-8">
            <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between bg-[#FAF8F5]">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">
                {editingProduct ? 'Edit Boutique Creation' : 'Create New Creation'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#7E7873] hover:text-[#1F1D1D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Maroon Velvet Embroidered Kurta"
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. ART-VEL-010"
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-[#FAF8F5] border border-[#E6DFD5] rounded-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#1F1D1D] block mb-1">
                    Retail Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="24500"
                    className="w-full bg-white border border-[#D4C5B3] px-2.5 py-1.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#6B1724] block mb-1">
                    Sale Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(e.target.value)}
                    placeholder="21990"
                    className="w-full bg-white border border-[#D4C5B3] px-2.5 py-1.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#7E7873] block mb-1">
                    Cost Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(e.target.value)}
                    placeholder="11000"
                    className="w-full bg-white border border-[#D4C5B3] px-2.5 py-1.5 rounded-xs"
                  />
                </div>
              </div>

              {/* Stock Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Total Inventory Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formLowStock}
                    onChange={(e) => setFormLowStock(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Product Images (Comma-separated HTTPS URLs)
                </label>
                <textarea
                  rows={2}
                  value={formImages}
                  onChange={(e) => setFormImages(e.target.value)}
                  placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed artisanal craft details, embroidery methods, cut..."
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Fabric / Material
                  </label>
                  <input
                    type="text"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    placeholder="e.g. 100% Himalayan Cashmere"
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    value={formCare}
                    onChange={(e) => setFormCare(e.target.value)}
                    placeholder="e.g. Dry clean only"
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsBestseller}
                    onChange={(e) => setFormIsBestseller(e.target.checked)}
                    className="text-[#6B1724]"
                  />
                  <span className="font-semibold text-[#1F1D1D]">Bestseller Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="text-[#6B1724]"
                  />
                  <span className="font-semibold text-[#1F1D1D]">Featured on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsNewArrival}
                    onChange={(e) => setFormIsNewArrival(e.target.checked)}
                    className="text-[#6B1724]"
                  />
                  <span className="font-semibold text-[#1F1D1D]">New Arrival</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E6DFD5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D4C5B3] text-[#7E7873] hover:text-[#1F1D1D] rounded-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-[#6B1724] hover:bg-[#500F1A] text-white px-6 py-2 rounded-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
