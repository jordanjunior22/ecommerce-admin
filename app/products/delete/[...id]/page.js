"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { redirect, useParams ,useRouter} from 'next/navigation';


export default function Page() {
    const {id} = useParams();
    const [Product, setProduct] = useState(null);
    const router = useRouter()


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
    function goBack(){
        router.push("/products")
    }
    async function handleDelete(){
        await axios.delete('/api/products?id='+id);
        goBack();
    }
  return (
    <AdminLayout>
        <h1>Do you reall want to delete {Product?.title}</h1>
        <button className='bg-red-800 mr-4 text-white px-4 py-1' onClick={handleDelete}>Yes</button>
        <button className='bg-green-800 text-white px-4 py-1' onClick={goBack}>No</button>
  </AdminLayout>
  )
}
