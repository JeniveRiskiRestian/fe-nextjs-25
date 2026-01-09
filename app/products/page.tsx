"use client";

import Layout from "@/components/components/Layout";
import { service, serviceDestroy } from "@/services/services";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProductList() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "code", headerName: "Code", flex: 0.5 },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      valueFormatter: (value) => {
        if (!value) return "-";
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value);
      },
    },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      valueGetter: (value, row) => {
        if (row.product_category) return row.product_category.name;
        if (row.category) return row.category.name;
        return "-";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link
            href={`/products/${params.row.id}/edit`}
            className="flex items-center"
          >
            <Button variant="contained" color="primary" size="small">
              Edit
            </Button>
          </Link>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const getData = async () => {
    setLoading(true);
    try {
      const response = await service("products");
      console.log("Products API Response:", response); // Debug log

      // Handle different response structures
      let productsData = [];
      if (response?.error) {
        throw new Error(response.message || "Failed to fetch products");
      }

      if (Array.isArray(response?.data)) {
        productsData = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      }

      setRows(productsData);
    } catch (error) {
      console.error("Failed to fetch products", error);
      Swal.fire("Error", "Failed to fetch products", "error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await serviceDestroy("products", id.toString());
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete product", "error");
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout>
      <div className="flex w-full justify-between items-center my-4">
        <h1 className="font-bold text-black text-2xl">Products</h1>
        <Link href="/products/create">
          <Button variant="contained">ADD PRODUCT</Button>
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
