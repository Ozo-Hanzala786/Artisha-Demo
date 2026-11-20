'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FolderTree } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800');
    setDisplayOrder((categories.length + 1).toString());
    setFeatured(false);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setDisplayOrder(cat.displayOrder?.toString() || '0');
    setFeatured(cat.featured);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          image,
          displayOrder: parseInt(displayOrder) || 0,
          featured,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Cannot delete category');
        return;
      }
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#6B1724] font-semibold block mb-1">
            Taxonomy &amp; Organization
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F1D1D]">
            Categories &amp; Collections
          </h1>
          <p className="text-xs text-[#7E7873]">
            Organize the boutique catalogue into seasonal couture, pret, shawls, and jewelry.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 bg-[#6B1724] hover:bg-[#500F1A] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#7E7873]">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#7E7873]">
            No categories created yet.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-[#E6DFD5] rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] bg-[#F5EFE6]">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#7E7873]">
                    No cover image
                  </div>
                )}
                {cat.featured && (
                  <span className="absolute top-2 left-2 bg-[#6B1724] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs">
                    Featured
                  </span>
                )}
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-xs">
                  {cat._count?.products || 0} Products
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-[#7E7873] font-mono block">slug: /{cat.slug}</span>
                  {cat.description && (
                    <p className="text-xs text-[#4A4644] mt-1.5 line-clamp-2 font-light">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#F5EFE6] flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#7E7873]">Order: #{cat.displayOrder}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1 text-[#7E7873] hover:text-[#6B1724] transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1 text-[#A89F91] hover:text-red-700 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xs shadow-2xl border border-[#E6DFD5] overflow-hidden">
            <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between bg-[#FAF8F5]">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1F1D1D]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#7E7873] hover:text-[#1F1D1D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pret & Ready-to-Wear"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  URL Slug (Optional - auto generated)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. pret-ready-to-wear"
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Atelier collection description..."
                  className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs focus:outline-none focus:border-[#6B1724]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1F1D1D] block mb-1">
                    Display Order Sequence
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D4C5B3] px-3 py-2 rounded-xs"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="text-[#6B1724]"
                    />
                    <span className="font-semibold text-[#1F1D1D]">Featured on Homepage</span>
                  </label>
                </div>
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
                  disabled={submitting}
                  className="bg-[#6B1724] hover:bg-[#500F1A] text-white px-6 py-2 rounded-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
