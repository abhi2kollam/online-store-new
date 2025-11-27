'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/services/mockData';
import { createClient } from '@/utils/supabase/client';

interface ProductFormProps {
    initialData?: Product;
    isEdit?: boolean;
}

interface Attribute {
    id: number;
    name: string;
    type: string;
}

interface Variant {
    id?: number;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, string>; // { "Color": "Red", "Size": "XL" }
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const supabase = createClient();
    const router = useRouter();
    const [newImageUrl, setNewImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    // Product Type State
    const [productType, setProductType] = useState<'simple' | 'variant'>('simple');

    // Variant State
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]); // ["Color", "Size"]
    const [variants, setVariants] = useState<Variant[]>([]);

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
        const fetchData = async () => {
            const { data: catData } = await supabase.from('categories').select('id, name');
            if (catData) setCategories(catData);

            const { data: attrData } = await supabase.from('attributes').select('*');
            if (attrData) setAttributes(attrData);
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

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

    // Variant Logic
    const handleAttributeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const attrName = e.target.value;
        if (attrName && !selectedAttributes.includes(attrName)) {
            setSelectedAttributes([...selectedAttributes, attrName]);
        }
    };

    const handleRemoveAttribute = (attrName: string) => {
        setSelectedAttributes(selectedAttributes.filter(a => a !== attrName));
        // Also clear variants as they might depend on this attribute
        setVariants([]);
    };

    const addVariant = () => {
        const newVariant: Variant = {
            sku: '',
            price: formData.price || 0,
            stock: 0,
            attributes: selectedAttributes.reduce((acc, attr) => ({ ...acc, [attr]: '' }), {})
        };
        setVariants([...variants, newVariant]);
    };

    const updateVariant = (index: number, field: keyof Variant | string, value: any) => {
        const updatedVariants = [...variants];
        if (field === 'sku' || field === 'price' || field === 'stock') {
            updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        } else {
            // It's an attribute
            updatedVariants[index].attributes = {
                ...updatedVariants[index].attributes,
                [field]: value
            };
        }
        setVariants(updatedVariants);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
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
                product_type: productType,
            };

            const selectedCategory = categories.find(c => c.name === formData.category);
            if (selectedCategory) {
                productData.category_id = selectedCategory.id;
            }

            // Insert Product
            const { data: newProduct, error } = await supabase
                .from('products')
                .insert([productData])
                .select()
                .single();

            if (error) throw error;

            // Insert Variants
            if (productType === 'variant' && variants.length > 0) {
                for (const variant of variants) {
                    const { data: variantData, error: variantError } = await supabase
                        .from('product_variants')
                        .insert({
                            product_id: newProduct.id,
                            sku: variant.sku,
                            price: variant.price,
                            stock: variant.stock
                        })
                        .select()
                        .single();

                    if (variantError) throw variantError;

                    // Insert Variant Attributes
                    for (const [attrName, attrValue] of Object.entries(variant.attributes)) {
                        const attribute = attributes.find(a => a.name === attrName);
                        if (attribute) {
                            await supabase.from('product_variant_attributes').insert({
                                variant_id: variantData.id,
                                attribute_id: attribute.id,
                                value: attrValue
                            });
                        }
                    }
                }
            }

            alert(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
            router.push('/admin/products');
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert(`Error saving product: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-base-100 p-6 rounded-lg shadow">
            {/* Basic Info */}
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Product Name</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered w-full" required />
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Category</span></label>
                    <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full" required>
                        <option value="" disabled>Select Category</option>
                        {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Product Type</span></label>
                    <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value as 'simple' | 'variant')}
                        className="select select-bordered w-full"
                    >
                        <option value="simple">Simple Product</option>
                        <option value="variant">Variable Product</option>
                    </select>
                </div>
            </div>

            {/* Simple Product Fields */}
            {productType === 'simple' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Price</span></label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="input input-bordered w-full" step="0.01" required />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Stock</span></label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                </div>
            )}

            {/* Variant Product Fields */}
            {productType === 'variant' && (
                <div className="border p-4 rounded-lg bg-base-200 space-y-4">
                    <h3 className="font-bold text-lg">Variants</h3>

                    {/* Attribute Selector */}
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="form-control w-full max-w-xs">
                            <label className="label"><span className="label-text font-semibold">Add Attribute</span></label>
                            <select className="select select-bordered" onChange={handleAttributeSelect} value="">
                                <option value="" disabled>Select Attribute</option>
                                {attributes.filter(a => !selectedAttributes.includes(a.name)).map(a => (
                                    <option key={a.id} value={a.name}>{a.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Attributes */}
                        <div className="flex flex-wrap gap-2 mb-1">
                            {selectedAttributes.map(attr => (
                                <div key={attr} className="badge badge-primary gap-2 p-3">
                                    {attr}
                                    <button type="button" onClick={() => handleRemoveAttribute(attr)} className="btn btn-xs btn-circle btn-ghost">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* Variant List */}
                    {selectedAttributes.length > 0 && (
                        <div className="space-y-4">
                            <button type="button" onClick={addVariant} className="btn btn-accent btn-sm">+ Add Variant</button>

                            {variants.map((variant, index) => (
                                <div key={index} className="card bg-base-100 shadow-sm p-4 border">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                                        {selectedAttributes.map(attr => (
                                            <div key={attr} className="form-control">
                                                <label className="label text-xs">{attr}</label>
                                                <input
                                                    type="text"
                                                    placeholder={attr}
                                                    className="input input-bordered input-sm"
                                                    value={variant.attributes[attr] || ''}
                                                    onChange={(e) => updateVariant(index, attr, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="form-control">
                                            <label className="label text-xs">SKU</label>
                                            <input
                                                type="text"
                                                className="input input-bordered input-sm"
                                                value={variant.sku}
                                                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label text-xs">Price</label>
                                            <input
                                                type="number"
                                                className="input input-bordered input-sm"
                                                value={variant.price}
                                                onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                                                required
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label text-xs">Stock</label>
                                            <input
                                                type="number"
                                                className="input input-bordered input-sm"
                                                value={variant.stock}
                                                onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <button type="button" onClick={() => removeVariant(index)} className="btn btn-xs btn-error btn-outline">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Images & Description (Common) */}
            <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Main Image</span></label>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="file-input file-input-bordered w-full max-w-xs" disabled={uploading} />
                    <span className="text-sm font-bold">OR</span>
                    <input type="url" name="image" value={formData.image} onChange={handleChange} className="input input-bordered w-full" placeholder="Enter image URL" />
                </div>
                {formData.image && <img src={formData.image} alt="Main" className="mt-4 w-32 h-32 object-cover rounded border" />}
            </div>

            <div className="form-control">
                <label className="label w-full"><span className="label-text ">Description</span></label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered h-24 w-full" required></textarea>
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" className="btn btn-ghost" onClick={() => router.back()} disabled={uploading}>Cancel</button>
                <button type="submit" className="btn btn-neutral" disabled={uploading}>{uploading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}</button>
            </div>
        </form>
    );
}
