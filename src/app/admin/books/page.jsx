"use client"

import AdminLayout from "@/components/admin/adminLayout";
import BooksManagement from "@/components/admin/booksManagement";

export default function AdminBooksPage() {
  return (
    <AdminLayout>
      <div className="px-4 lg:px-6">
        <BooksManagement />
      </div>
    </AdminLayout>
  );
} 