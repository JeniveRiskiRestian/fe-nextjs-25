"use client";

import Layout from "@/components/components/Layout";
import { service, serviceDestroy } from "@/services/services";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProductVariantList() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);

  const columns: GridColDef[] = [
    {
      field: "product",
      headerName: "Product",
      flex: 1,
      valueGetter: (value, row) => {
        if (row.product) return row.product.name;
        return "-";
      },
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      valueGetter: (value, row) => {
        if (row.product?.product_category)
          return row.product.product_category.name;
        if (row.product?.category) return row.product.category.name;
        if (row.category) return row.category.name;
        return "-";
      },
    },
    { field: "name", headerName: "Variant Name", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      valueFormatter: (value) => {
        if (!value) return "-";
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value);
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link
            href={`/product-variants/${params.row.id}/edit`}
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
      const response = await service("product-variants");
      console.log("Product Variants API Response:", response); // Debug log

      // Handle different response structures
      let variantsData = [];
      if (response?.error) {
        throw new Error(response.message || "Failed to fetch variants");
      }

      if (Array.isArray(response?.data)) {
        variantsData = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        variantsData = response.data.data;
      } else if (Array.isArray(response)) {
        variantsData = response;
      }

      setRows(variantsData);
    } catch (error) {
      console.error("Failed to fetch variants", error);
      Swal.fire("Error", "Failed to fetch variants", "error");
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
        await serviceDestroy("product-variants", id.toString());
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        Swal.fire("Deleted!", "Variant has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete variant", "error");
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout>
      <div className="flex w-full justify-between items-center my-4">
        <h1 className="font-bold text-black text-2xl">Product Variants</h1>
        <Link href="/product-variants/create">
          <Button variant="contained">ADD VARIANT</Button>
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
