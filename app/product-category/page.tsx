"use client";

import Layout from "@/components/components/Layout";
import { service, serviceDestroy } from "@/services/services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProductCategoryPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await service("product-categories");
      const categoriesData = res?.data?.data || res?.data || res || [];
      // Ensure rows is always an array
      setRows(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      Swal.fire("Error", "Failed to fetch categories", "error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await serviceDestroy("product-categories", id);
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete category", "error");
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link href={`/product-category/${params.row.id}/edit`}>
            <Button size="small" variant="contained">
              Edit
            </Button>
          </Link>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex w-full justify-between items-center my-4">
        <h1 className="font-bold text-black text-2xl">Product Category</h1>
        <Link href="/product-category/create">
          <Button variant="contained">ADD CATEGORY</Button>
        </Link>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
        />
      </div>
    </Layout>
  );
}
