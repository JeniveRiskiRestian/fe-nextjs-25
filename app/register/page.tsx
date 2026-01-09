'use client';

import { Button, TextField, Paper, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { serviceRegister } from '@/services/services';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await serviceRegister(formData);
      Swal.fire('Success', 'Registration successful! Please login.', 'success');
      router.push('/login');
    } catch (error: any) {
      Swal.fire('Error', error?.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" className="flex items-center justify-center min-h-screen">
      <Paper elevation={3} className="p-8 w-full">
        <Typography variant="h4" component="h1" className="text-center font-bold mb-6 text-black">
          Register
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Full Name"
            name="name"
            variant="outlined"
            required
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
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
          <TextField
            label="Confirm Password"
            name="password_confirmation"
            type="password"
            variant="outlined"
            required
            fullWidth
            value={formData.password_confirmation}
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
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Typography variant="body2" className="text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}
