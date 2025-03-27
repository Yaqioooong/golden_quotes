"use client"

import AdminLayout from "@/components/admin/adminLayout";
import { useSearchParams } from "next/navigation";
import QuotesPanel from "@/components/admin/quotesPanel";
import { Suspense } from "react";

export default function AdminQuotesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="px-4 lg:px-6">
          <h1 className="text-xl font-semibold mb-4">金句管理</h1>
          <QuotesPanel />
        </div>
      </Suspense>
    </AdminLayout>
  );
}