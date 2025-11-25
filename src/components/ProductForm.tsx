'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/services/mockData';

interface ProductFormProps {
    initialData?: Product;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [newImageUrl, setNewImageUrl] = useState('');
    const [formData, setFormData] = useState<Partial<Product>>(
        initialData || {
            name: '',
            price: 0,
            category: '',
            description: '',
            image: '',
            images: [],
            stock: 0,
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
        }));
    };

    const handleAddImage = () => {
        if (newImageUrl && !formData.images?.includes(newImageUrl)) {
            setFormData((prev) => ({
                ...prev,
                images: [...(prev.images || []), newImageUrl],
            }));
            setNewImageUrl('');
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index) || [],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
        router.push('/admin/products');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-base-100 p-6 rounded-lg shadow">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Product Name</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Price</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        step="0.01"
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Stock</span>
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Category</span>
                </label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                >
                    <option value="" disabled>Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Sports">Sports</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Electronics">Electronics</option>
                </select>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Main Image URL</span>
                </label>
                <div className="flex gap-4 items-start">
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="Enter main image URL"
                        required
                    />
                    {formData.image && (
                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-base-300">
                            <img src={formData.image} alt="Main" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Additional Images</span>
                </label>

                {/* Image List */}
                {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {formData.images.map((img, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-base-300">
                                <img src={img} alt={`Additional ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Image */}
                <div className="flex gap-2">
                    <input
                        type="url"
                        placeholder="Enter additional image URL"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="input input-bordered w-full"
                    />
                    <button type="button" onClick={handleAddImage} className="btn btn-secondary">
                        Add
                    </button>
                </div>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Description</span>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-24 w-full"
                    required
                ></textarea>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="btn btn-ghost" onClick={() => router.back()}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    {isEdit ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}
