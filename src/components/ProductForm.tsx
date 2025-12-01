'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import MediaGallery from '@/components/MediaGallery';

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
    image_url?: string;
    images?: string[];
    is_default?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    // Product Type State
    const [productType, setProductType] = useState<'simple' | 'variant'>(initialData?.product_type || 'simple');

    // Variant State
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]); // ["Color", "Size"]
    const [variants, setVariants] = useState<Variant[]>([]);
    const [loadingVariants, setLoadingVariants] = useState(false);

    const [formData, setFormData] = useState<Partial<Product>>(
        initialData || {
            name: '',
            price: 0,
            category: '',
            description: '',
            image_url: '',
            images: [],
            stock: 0,
            product_code: '',
        }
    );

    console.log('ProductForm rendered');

    useEffect(() => {
        console.log('ProductForm: useEffect (fetchData) called');
        const fetchData = async () => {
            console.log('ProductForm: fetching categories and attributes...');
            const { data: catData, error: catError } = await supabase.from('categories').select('id, name');
            if (catError) console.error('Error fetching categories:', catError);
            if (catData) {
                console.log('Categories fetched:', catData.length);
                setCategories(catData);
            }

            const { data: attrData, error: attrError } = await supabase.from('attributes').select('*');
            if (attrError) console.error('Error fetching attributes:', attrError);
            if (attrData) {
                console.log('Attributes fetched:', attrData.length);
                setAttributes(attrData);
            }
        };
        fetchData();
    }, []);

    // Fetch variants in edit mode
    useEffect(() => {
        if (!isEdit || !initialData?.id || productType !== 'variant') return;

        const fetchVariants = async () => {
            setLoadingVariants(true);
            const { data: variantsData, error } = await supabase
                .from('product_variants')
                .select(`
                    id, sku, price, stock, image_url, images, is_default,
                    product_variant_attributes (
                        value,
                        attributes (name)
                    )
                `)
                .eq('product_id', parseInt(initialData.id));

            if (error) {
                console.error('Error fetching variants:', error);
                setLoadingVariants(false);
                return;
            }

            if (variantsData) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedVariants: Variant[] = variantsData.map((v: any) => {
                    const attributes: Record<string, string> = {};
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    v.product_variant_attributes.forEach((pva: any) => {
                        attributes[pva.attributes.name] = pva.value;
                    });
                    return {
                        id: v.id,
                        sku: v.sku,
                        price: v.price,
                        stock: v.stock,
                        image_url: v.image_url,
                        images: v.images,
                        is_default: v.is_default,
                        attributes
                    };
                });

                setVariants(formattedVariants);

                // Extract unique attributes
                const attrs = new Set<string>();
                formattedVariants.forEach(v => {
                    Object.keys(v.attributes).forEach(k => attrs.add(k));
                });
                setSelectedAttributes(Array.from(attrs));
            }
            setLoadingVariants(false);
        };

        fetchVariants();
    }, [isEdit, initialData?.id, productType, supabase]);

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
                setFormData(prev => ({ ...prev, image_url: publicUrl }));
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

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index) || [],
        }));
    };

    // Media Picker Logic
    const [mediaPickerTarget, setMediaPickerTarget] = useState<{ type: 'main' | 'gallery' | 'variant_main' | 'variant_gallery', variantIndex?: number }>({ type: 'main' });

    const openMediaPicker = (type: 'main' | 'gallery' | 'variant_main' | 'variant_gallery', variantIndex?: number) => {
        setMediaPickerTarget({ type, variantIndex });
        (document.getElementById('media_picker_modal') as HTMLDialogElement)?.showModal();
    };

    const handleMediaSelect = (url: string | string[]) => {
        if (mediaPickerTarget.type === 'main') {
            if (typeof url === 'string') {
                setFormData(prev => ({ ...prev, image_url: url }));
            }
        } else if (mediaPickerTarget.type === 'gallery') {
            const urls = Array.isArray(url) ? url : [url];
            setFormData(prev => {
                const currentImages = prev.images || [];
                const newImages = urls.filter(u => !currentImages.includes(u));
                return { ...prev, images: [...currentImages, ...newImages] };
            });
        } else if (mediaPickerTarget.type === 'variant_main' && mediaPickerTarget.variantIndex !== undefined) {
            if (typeof url === 'string') {
                updateVariant(mediaPickerTarget.variantIndex, 'image_url', url);
            }
        } else if (mediaPickerTarget.type === 'variant_gallery' && mediaPickerTarget.variantIndex !== undefined) {
            const urls = Array.isArray(url) ? url : [url];
            const currentImages = variants[mediaPickerTarget.variantIndex].images || [];
            const newImages = urls.filter(u => !currentImages.includes(u));
            if (newImages.length > 0) {
                const updatedImages = [...currentImages, ...newImages];
                updateVariant(mediaPickerTarget.variantIndex, 'images', updatedImages as unknown as string);
            }
        }
        (document.getElementById('media_picker_modal') as HTMLDialogElement)?.close();
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
            attributes: selectedAttributes.reduce((acc, attr) => ({ ...acc, [attr]: '' }), {}),
            image_url: '',
            images: [],
            is_default: false
        };
        setVariants([...variants, newVariant]);
    };

    const updateVariant = (index: number, field: keyof Variant | string, value: string | number | string[] | boolean) => {
        const updatedVariants = [...variants];
        if (field === 'is_default') {
            // Uncheck all others
            updatedVariants.forEach((v, i) => {
                v.is_default = i === index ? (value as boolean) : false;
            });
        } else if (field === 'sku' || field === 'price' || field === 'stock' || field === 'image_url' || field === 'images') {
            updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        } else {
            // It's an attribute
            updatedVariants[index].attributes = {
                ...updatedVariants[index].attributes,
                [field]: value as string
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
                image_url: formData.image_url,
                images: formData.images,
                product_type: productType,
                product_code: formData.product_code,
            };

            // If variable product, set price/stock and main image from default variant
            if (productType === 'variant') {
                const defaultVariant = variants.find(v => v.is_default) || variants[0];

                if (defaultVariant) {
                    productData.price = defaultVariant.price;
                    productData.stock = defaultVariant.stock;
                    if (defaultVariant.image_url) {
                        productData.image_url = defaultVariant.image_url;
                    }
                } else {
                    productData.price = 0;
                    productData.stock = 0;
                }
            }

            const selectedCategory = categories.find(c => c.name === formData.category);
            if (selectedCategory) {
                productData.category_id = selectedCategory.id;
            }

            let productId = initialData?.id;

            if (isEdit && productId) {
                // Update Product
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productId);
                if (error) throw error;
            } else {
                // Insert Product
                const { data: newProduct, error } = await supabase
                    .from('products')
                    .insert([productData])
                    .select()
                    .single();
                if (error) throw error;
                productId = newProduct.id;
            }

            // Handle Variants
            if (productType === 'variant') {
                // 1. Delete removed variants (only if editing)
                if (isEdit && productId) {
                    const currentVariantIds = variants.filter(v => v.id).map(v => v.id);
                    let query = supabase.from('product_variants').delete().eq('product_id', productId);

                    if (currentVariantIds.length > 0) {
                        query = query.not('id', 'in', `(${currentVariantIds.join(',')})`);
                    }

                    const { error: deleteError } = await query;
                    if (deleteError) throw deleteError;
                }

                // 2. Upsert/Insert variants
                for (const variant of variants) {
                    let variantId = variant.id;
                    const variantDataPayload = {
                        product_id: productId,
                        sku: variant.sku,
                        price: variant.price,
                        stock: variant.stock,
                        image_url: variant.image_url,
                        images: variant.images,
                        is_default: variant.is_default
                    };

                    if (variantId) {
                        // Update existing variant
                        const { error: updateVarError } = await supabase
                            .from('product_variants')
                            .update(variantDataPayload)
                            .eq('id', variantId);
                        if (updateVarError) throw updateVarError;
                    } else {
                        // Insert new variant
                        const { data: newVariant, error: insertVarError } = await supabase
                            .from('product_variants')
                            .insert(variantDataPayload)
                            .select()
                            .single();
                        if (insertVarError) throw insertVarError;
                        variantId = newVariant.id;
                    }

                    // 3. Handle Attributes (Delete all for this variant and re-insert)
                    if (variantId) {
                        await supabase.from('product_variant_attributes').delete().eq('variant_id', variantId);

                        for (const [attrName, attrValue] of Object.entries(variant.attributes)) {
                            const attribute = attributes.find(a => a.name === attrName);
                            if (attribute) {
                                await supabase.from('product_variant_attributes').insert({
                                    variant_id: variantId,
                                    attribute_id: attribute.id,
                                    value: attrValue
                                });
                            }
                        }
                    }
                }
            }

            alert(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
            router.push('/admin/products');
        } catch (error: unknown) {
            console.error('Error saving product:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            alert(`Error saving product: ${message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-base-100 p-6 rounded-lg shadow">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Product Name</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Product Code</span></label>
                        <input type="text" name="product_code" value={formData.product_code || ''} onChange={handleChange} className="input input-bordered w-full" placeholder="e.g. PROD-001" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Category</span></label>
                        <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full" required>
                            <option value="" disabled>Select Category</option>
                            {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div className="form-control col-span-2">
                        <label className="label w-full"><span className="label-text ">Description</span></label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered h-24 w-full" required></textarea>
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
                    <div className="space-y-4">
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

                        {/* Gallery Images for Simple Product */}
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Gallery Images</span></label>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2 items-center">
                                    <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, false)} className="file-input file-input-bordered w-full max-w-xs" disabled={uploading} />
                                    <span className="text-sm font-bold">OR</span>
                                    <button type="button" onClick={() => openMediaPicker('gallery')} className="btn btn-outline gap-2">
                                        <ImageIcon size={16} />
                                        Select from Library
                                    </button>
                                </div>

                                {formData.images && formData.images.length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative group w-24 h-24">
                                                <Image src={img} alt={`Gallery ${index}`} fill className="object-cover rounded border" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="btn btn-xs btn-circle btn-error absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Variant Product Fields */}
                {productType === 'variant' && (
                    <div className="border p-4 rounded-lg bg-base-200 space-y-4">
                        <h3 className="font-bold text-lg">Variants</h3>

                        {loadingVariants ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-10 bg-base-300 rounded w-1/3 mb-4"></div>
                                <div className="h-40 bg-base-300 rounded w-full mb-4"></div>
                                <div className="h-40 bg-base-300 rounded w-full"></div>
                            </div>
                        ) : (
                            <>
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
                                            <div key={attr} className="badge badge-neutral gap-2 p-3">
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
                                        {variants.map((variant, index) => (
                                            <div key={index} className={`card bg-base-100 shadow-sm p-4 border ${variant.is_default ? 'border-primary border-2' : ''}`}>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                                                    {selectedAttributes.map(attrName => {
                                                        const attribute = attributes.find(a => a.name === attrName);
                                                        const type = attribute?.type || 'text';

                                                        return (
                                                            <div key={attrName} className="form-control">
                                                                <label className="label text-xs">{attrName}</label>
                                                                {type === 'color' ? (
                                                                    <div className="flex gap-2">
                                                                        {(() => {
                                                                            const currentValue = variant.attributes[attrName] || '';
                                                                            const [name, hex] = currentValue.includes('|')
                                                                                ? currentValue.split('|')
                                                                                : ['', currentValue || '#000000'];

                                                                            const handleColorChange = (newHex: string) => {
                                                                                const newValue = `${name}|${newHex}`;
                                                                                updateVariant(index, attrName, newValue);
                                                                            };

                                                                            const handleNameChange = (newName: string) => {
                                                                                const newValue = `${newName}|${hex}`;
                                                                                updateVariant(index, attrName, newValue);
                                                                            };

                                                                            return (
                                                                                <>
                                                                                    <input
                                                                                        type="color"
                                                                                        className="input input-bordered input-sm w-12 p-1 h-8"
                                                                                        value={hex}
                                                                                        onChange={(e) => handleColorChange(e.target.value)}
                                                                                    />
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Color Name (e.g. Pastel Yellow)"
                                                                                        className="input input-bordered input-sm flex-1"
                                                                                        value={name}
                                                                                        onChange={(e) => handleNameChange(e.target.value)}
                                                                                        required
                                                                                    />
                                                                                </>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                ) : type === 'number' ? (
                                                                    <input
                                                                        type="number"
                                                                        placeholder={attrName}
                                                                        className="input input-bordered input-sm"
                                                                        value={variant.attributes[attrName] || ''}
                                                                        onChange={(e) => updateVariant(index, attrName, e.target.value)}
                                                                        required
                                                                    />
                                                                ) : (
                                                                    <input
                                                                        type="text"
                                                                        placeholder={attrName}
                                                                        className="input input-bordered input-sm"
                                                                        value={variant.attributes[attrName] || ''}
                                                                        onChange={(e) => updateVariant(index, attrName, e.target.value)}
                                                                        required
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
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
                                                <div className="form-control w-fit">
                                                    <label className="label cursor-pointer gap-2">
                                                        <span className="label-text text-xs font-bold">Default Variant</span>
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox checkbox-sm checkbox-neutral"
                                                            checked={variant.is_default || false}
                                                            onChange={(e) => updateVariant(index, 'is_default', e.target.checked)}
                                                        />
                                                    </label>
                                                </div>

                                                {/* Variant Images */}
                                                <div className="mt-4 border-t pt-2">
                                                    <label className="label text-xs font-bold">Variant Images</label>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs w-20">Main:</span>
                                                            <button type="button" onClick={() => openMediaPicker('variant_main', index)} className="btn btn-xs btn-outline gap-1">
                                                                <ImageIcon size={12} /> Select
                                                            </button>
                                                            {variant.image_url && (
                                                                <div className="avatar">
                                                                    <div className="w-8 h-8 rounded border relative">
                                                                        <Image src={variant.image_url} alt="Variant Main" fill className="object-cover" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs w-20">Gallery:</span>
                                                            <button type="button" onClick={() => openMediaPicker('variant_gallery', index)} className="btn btn-xs btn-outline gap-1">
                                                                <ImageIcon size={12} /> Add
                                                            </button>
                                                            <div className="flex gap-1">
                                                                {variant.images?.map((img, imgIndex) => (
                                                                    <div key={imgIndex} className="avatar">
                                                                        <div className="w-8 h-8 rounded border relative">
                                                                            <Image src={img} alt={`Variant ${imgIndex}`} fill className="object-cover" />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end mt-2">
                                                    <button type="button" onClick={() => removeVariant(index)} className="btn btn-xs btn-error btn-outline">Remove</button>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" onClick={addVariant} className="btn btn-accent btn-sm">+ Add Variant</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Images & Description (Common) */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Main Image</span></label>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="file-input file-input-bordered w-full max-w-xs" disabled={uploading} />
                        <span className="text-sm font-bold">OR</span>
                        <button type="button" onClick={() => openMediaPicker('main')} className="btn btn-outline gap-2">
                            <ImageIcon size={16} />
                            Select from Library
                        </button>
                        <span className="text-sm font-bold">OR</span>
                        <input type="url" name="image" value={formData.image_url} onChange={handleChange} className="input input-bordered w-full" placeholder="Enter image URL" />
                    </div>
                    {formData.image_url && <div className="mt-4 relative w-32 h-32 rounded border overflow-hidden">
                        <Image src={formData.image_url} alt="Main" fill className="object-cover" />
                    </div>}
                </div>


                <div className="flex justify-end gap-4">
                    <button type="button" className="btn btn-ghost" onClick={() => router.back()} disabled={uploading}>Cancel</button>
                    <button type="submit" className="btn btn-neutral" disabled={uploading}>{uploading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}</button>
                </div>
            </form>

            {/* Media Picker Modal */}
            <dialog id="media_picker_modal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-4">Select Image from Library</h3>
                    <div className="max-h-[60vh] overflow-y-auto">
                        <MediaGallery
                            selectable
                            allowMultiple={mediaPickerTarget.type === 'gallery' || mediaPickerTarget.type === 'variant_gallery'}
                            onSelect={handleMediaSelect}
                        />
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
