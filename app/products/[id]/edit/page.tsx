'use client';

import Layout from '@/components/components/Layout';
import { service, serviceShow, serviceUpdate } from '@/services/services';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories for dropdown
        const catRes = await service('product-categories');
        setCategories(catRes.data.data || catRes.data);

        // Fetch product data
        const productRes = await serviceShow('products', id);
        const product = productRes.data;
        
        setName(product.name);
        setCode(product.code);
        setPrice(product.price || ""); 
        
        setCategoryId(product.product_category_id);
        setDescription(product.description);
        
        setLoading(false);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to fetch data', 'error');
        router.push('/products');
      }
    };
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('code', code);
    formData.append('price', price); 
    
    formData.append('product_category_id', categoryId);
    formData.append('description', description);
    formData.append('_method', 'PUT');

    try {
      await serviceUpdate('products', formData, id);
      Swal.fire('Success', 'Product updated successfully', 'success');
      router.push('/products');
    } catch (error: any) {
      Swal.fire('Error', error?.response?.data?.message || 'Failed to update product', 'error');
    }
  };

  if (loading) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1 className="text-black text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField 
            name="name" 
            label="Name" 
            variant="standard" 
            required 
            fullWidth 
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField 
            name="code" 
            label="Code" 
            variant="standard" 
            required 
            fullWidth 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField 
            name="price" 
            label="Price" 
            type="number"
            variant="standard" 
            required 
            fullWidth 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          
          <FormControl fullWidth variant="standard" required>
            <InputLabel shrink>Category</InputLabel>
            <Select 
              name="product_category_id" 
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as string)}
              displayEmpty
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField 
            name="description" 
            label="Description" 
            variant="standard" 
            fullWidth 
            multiline 
            rows={2} 
            className="md:col-span-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outlined" color="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </div>
      </form>
    </Layout>
  );
}
