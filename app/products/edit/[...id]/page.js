"use client"
import AdminLayout from '@/components/AdminLayout'
import React, { useEffect, useState} from 'react'
import { useParams } from 'next/navigation';
import axios from 'axios';
import Productform from '@/components/Productform';

export default function page() {
  const {id} = useParams();
  const [Product, setProduct] = useState(null);
  
  useEffect(()=>{
    if(!id){
      return;
    }
    axios.get('/api/products').then(Response =>{
      const products = Response.data;
      const FoundProduct = products.find(product => String(product._id) === String(id));
      setProduct(FoundProduct);
      //console.log(FoundProduct);
    });
  },[id])

  return (
    <AdminLayout>
      <h1>Edit Product</h1>
      {Product &&(
        <Productform {...Product}/>
      )}
      
    </AdminLayout>
  )
}
