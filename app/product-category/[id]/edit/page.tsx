"use client";

import Layout from "@/components/components/Layout";
import { serviceShow, serviceUpdate } from "@/services/services";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditProductCategory({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await serviceShow("product-categories", id);
        setName(res.data.name);
        setDescription(res.data.description);
        setLoading(false);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch data", "error");
        router.push("/product-category");
      }
    };
    fetchData();
  }, [id, router]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("_method", "PUT"); // Laravel sometimes needs this for FormData PUT

    try {
      await serviceUpdate("product-categories", formData, id);
      Swal.fire("Success", "Category updated", "success");
      router.push("/product-category");
    } catch (error) {
      Swal.fire("Error", "Failed to update category", "error");
    }
  };

  if (loading) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Edit Category</h1>

      <form onSubmit={submit} className="mt-4 space-y-4">
        <TextField 
          name="name" 
          label="Name" 
          required 
          fullWidth 
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField 
          name="description" 
          label="Description" 
          fullWidth 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <div className="flex justify-end gap-2">
          <Button onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </div>
      </form>
    </Layout>
  );
}
