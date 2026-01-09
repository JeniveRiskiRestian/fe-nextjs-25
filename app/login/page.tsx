'use client';

import { Button, TextField, Paper, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { serviceLogin } from '@/services/services';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await serviceLogin(formData);
      const { access_token } = response.data;
      
      // Store token in cookies (base64 encoded as per common project pattern if needed, or raw)
      // Most callAPI implementations expect btoa(token)
      Cookies.set('token', btoa(access_token), { expires: 1 });
      
      Swal.fire('Success', 'Login successful!', 'success');
      router.push('/');
      router.refresh(); // Force refresh to update Navbar state
    } catch (error: any) {
      Swal.fire('Error', error?.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" className="flex items-center justify-center min-h-screen">
      <Paper elevation={3} className="p-8 w-full">
        <Typography variant="h4" component="h1" className="text-center font-bold mb-6 text-black">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Email Address"
            name="email"
            type="email"
            variant="outlined"
            required
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            required
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={loading}
            className="mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Typography variant="body2" className="text-center mt-4 text-black">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}
