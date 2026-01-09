"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { serviceLogout } from "@/services/services";
import Swal from "sweetalert2";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await serviceLogout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      Cookies.remove('token');
      setIsLoggedIn(false);
      Swal.fire('Success', 'Logged out successfully', 'success');
      router.push('/login');
    }
  };

  return (
    <nav className="w-full relative bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link
                  href="/"
                  className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                >
                  Home
                </Link>
                {isLoggedIn && (
                  <>
                    <Link
                      href="/product-category"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      Product Category
                    </Link>
                    <Link
                      href="/products"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      Product
                    </Link>
                    <Link
                      href="/product-variants"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      Product Variant
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="text-gray-300 hover:text-white text-sm font-medium">
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
