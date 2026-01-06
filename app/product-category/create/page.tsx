import Layout from "@/components/components/Layout";
import { TextField } from "@mui/material";
import React from 'react'

export default function page() {
  return (
    <Layout>
        <h1 className="text-black text-2xl font-bold">Product Category Create</h1>
        <form action="" className="w-full">
            <div className="grid grid-cols-2 gap-4 my-4">
            <TextField name="name" id="name" label="Name" variant="standard" />
            <TextField
                name="description"
                id="description"
                label="description"
                variant="standard"
             />
            </div>
        </form>
    </Layout>
  )
}
