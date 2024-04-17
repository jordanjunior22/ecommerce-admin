"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout';
import axios from 'axios';
import { redirect, useParams ,useRouter} from 'next/navigation';


export default function Page() {
    const {id} = useParams();
    const [Categories, setCategories] = useState(null);
    const router = useRouter();


    useEffect(()=>{
        if(!id){
          return;
        }
        axios.get('/api/categories').then(Response =>{
          const categories = Response.data;
          const FoundCategory = categories.find(category => String(category._id) === String(id));
          setCategories(FoundCategory);
        
        });
      },[id])
    function goBack(){
        router.push("/categories");
    }
    async function handleDelete(){
        await axios.delete('/api/categories?id='+id);
        goBack();
    }
  return (
    <AdminLayout>
        <h1>Do you reall want to delete {Categories?.name}</h1>
        <button className='bg-red-800 mr-4 text-white px-4 py-1' onClick={handleDelete}>Yes</button>
        <button className='bg-green-800 text-white px-4 py-1' onClick={goBack}>No</button>
  </AdminLayout>
  )
}
