"use client"
import AdminLayout from '@/components/AdminLayout'
import Productform from '@/components/Productform';

export default function page() {

  return (
    <AdminLayout>
      <h1>New Product</h1>
      <Productform/>
    </AdminLayout>
  )
}
