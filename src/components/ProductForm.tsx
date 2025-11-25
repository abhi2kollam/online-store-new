'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/services/mockData';
import { supabase } from '@/lib/supabase';

interface ProductFormProps {
    initialData?: Product;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [newImageUrl, setNewImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
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

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('id, name');
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('products').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            if (isMain) {
                setFormData(prev => ({ ...prev, image: publicUrl }));
            } else {
                setFormData(prev => ({ ...prev, images: [...(prev.images || []), publicUrl] }));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
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
        setUploading(true);

        try {
            const slug = formData.name?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const productData = {
                name: formData.name,
                slug,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
                category_id: 1, // Default fallback
                image_url: formData.image,
                images: formData.images,
            };

            const selectedCategory = categories.find(c => c.name === formData.category);
            if (selectedCategory) {
                productData.category_id = selectedCategory.id;
            }

            const { error } = await supabase
                .from('products')
                .insert([productData]);

            if (error) throw error;

            alert(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
            router.push('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product. Please try again.');
        } finally {
            setUploading(false);
        }
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
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Main Image</span>
                </label>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, true)}
                            className="file-input file-input-bordered w-full max-w-xs"
                            disabled={uploading}
                        />
                        <span className="text-sm">OR</span>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="Enter image URL"
                        />
                    </div>

                    {formData.image && (
                        <div className="relative w-40 h-40 shrink-0 rounded-lg overflow-hidden border border-base-300">
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
                <div className="flex flex-col gap-2">
                    <div className="flex gap-4 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, false)}
                            className="file-input file-input-bordered w-full max-w-xs"
                            disabled={uploading}
                        />
                        <span className="text-sm">OR</span>
                        <div className="flex gap-2 w-full">
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
                <button type="button" className="btn btn-ghost" onClick={() => router.back()} disabled={uploading}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    );
}
