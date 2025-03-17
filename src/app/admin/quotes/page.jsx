"use client"

import AdminLayout from "@/components/admin/adminLayout";
import { useSearchParams } from "next/navigation";
import QuotesPanel from "@/components/admin/quotesPanel";

export default function AdminQuotesPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('bookId');

  return (
    <AdminLayout>
      <div className="px-4 lg:px-6">
        <h1 className="text-xl font-semibold mb-4">金句管理</h1>
        <QuotesPanel bookId={bookId} />
      </div>
    </AdminLayout>
  );
} 