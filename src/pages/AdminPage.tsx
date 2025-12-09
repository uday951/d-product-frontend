import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NeonButton from '../components/NeonButton';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price: '',
    description: '',
    category: 'digital',
    image: '',
    downloadLink: '',
    inStock: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product created successfully!');
      setFormData({
        title: '',
        slug: '',
        price: '',
        description: '',
        category: 'digital',
        image: '',
        downloadLink: '',
        inStock: true
      });
      fetchProducts();
    } catch (error) {
      alert('Error creating product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold neon-text text-center mb-8">Admin Panel</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Product Form */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold text-yellow-500 mb-6">Create Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
                  }}
                  className="w-full px-4 py-2 bg-black/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Slug (auto-generated)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Download Link (PDF/Drive)</label>
                <input
                  type="url"
                  value={formData.downloadLink}
                  onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500"
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500"
                >
                  <option value="digital">Digital</option>
                  <option value="physical">Physical</option>
                </select>
              </div>

              <NeonButton type="submit" className="w-full">
                Create Product
              </NeonButton>
            </form>
          </div>

          {/* Products List */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold text-yellow-500 mb-6">Products</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {products.map((product) => (
                <div key={product._id} className="bg-black/50 rounded-lg p-4 border border-yellow-500/20">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-yellow-500">{product.title}</h3>
                      <p className="text-sm text-gray-400">${product.price}</p>
                      <p className="text-xs text-gray-500 mt-1">Slug: {product.slug}</p>
                      {product.downloadLink && (
                        <p className="text-xs text-green-400 mt-1">✓ Download link set</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-400 hover:text-red-300 ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;