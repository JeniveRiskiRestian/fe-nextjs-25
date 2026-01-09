"use client";

import Layout from "@/components/components/Layout";
import { serviceStore } from "@/services/services";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

export default function CreateProductCategory() {
  const router = useRouter();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await serviceStore("product-categories", formData);
    Swal.fire("Success", "Category created", "success");
    router.push("/product-category");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Create Category</h1>

      <form onSubmit={submit} className="mt-4 space-y-4">
        <TextField name="name" label="Name" required fullWidth />
        <TextField name="description" label="Description" fullWidth />

        <div className="flex justify-end gap-2">
          <Button onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </div>
      </form>
    </Layout>
  );
}
