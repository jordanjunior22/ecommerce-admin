"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { redirect } from 'next/navigation';
import Spinner from './Spinner';
import { ReactSortable } from 'react-sortablejs';


export default function Productform({_id,title:existingTitle,description:existingDescription,price:existingpPice,images:existingImages,category:assignedCategory,properties:assignedProperties}) {
    const [title, setTitle] = useState( existingTitle || '');
    const [description, setDescription] = useState( existingDescription || '');
    const [price, setPrice] = useState( existingpPice || '');
    const [images,setImages] = useState(existingImages || []);
    const [productPageRedirect, setProductPageRedirect] = useState(false);
    const [isUploading, setIsUploading] = useState()
    const [categories,SetCategories] = useState([]);
    const [category, setCategory] = useState(assignedCategory||'');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});

    useEffect(()=>{
      axios.get('/api/categories').then(results=>{
        SetCategories(results.data);
      })
    },[])
    async function saveProduct(ev){
      ev.preventDefault();
      const data = {title, description, price, images, category,properties:productProperties}
      if(_id){
        await axios.put('/api/products', {...data, _id})
        setProductPageRedirect(true);
      }
      else{
        await axios.post('/api/products', data)
        setProductPageRedirect(true);
      }
    }
    
    if(productPageRedirect){
      return redirect('/products');
    }
    
    async function UploadImage(ev){
      const files = ev.target.files;
      const formData = new FormData();

      //console.log(files);
      for (const file of Array.from(files)) {
        setIsUploading(true);
        formData.append('files', file);
      }

      formData.append('otherData', 'some data');

      const Response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
        const res = await Response.json();
        
         setImages(oldImages =>{
          return [...oldImages, ...res.data.links]
         })
        setIsUploading(false);
    }
    
    function updateImageOrder(images){
      setImages(images);
    }

    const propertiesToFill = [];
    if(categories.length > 0 && category){
      let selCatInfo = categories.find(({_id})=> _id === category)
      propertiesToFill.push(...selCatInfo.properties);
      while(selCatInfo?.parent?._id){
        const parentCat = categories.find(({_id})=> _id === parent?._id)
        propertiesToFill.push(...parentCat.properties);
        selCatInfo = parentCat;

      }
    }
  
    function setProductProp(propName, value){
      setProductProperties(prev => {
        const newProductProps = {...prev};
        newProductProps[propName] = value;
        return newProductProps;
      });
    }
    return (
          <form onSubmit={saveProduct} >
              <label>Product Name</label>
              <input type='text' placeholder='Product Name' value={title} onChange={ev => setTitle(ev.target.value)}/>
              <label>Categories</label>
              <select value={category} onChange={ev => setCategory(ev.target.value)}> 
                <option value="">UnCategorized</option>
                {categories.length > 0 && categories.map(c => (
                  <option value={c._id}>{c.name}</option>

                ))}
              </select>
              {categories.length > 0 && propertiesToFill.map( p => (
                <div className=''>
                  <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                  <div>
                    <select onChange={ev => setProductProp(p.name, ev.target.value)} value={productProperties[p.name]}>
                      {p.values.map(v =>(
                        <option value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                </div>

              ))}
              <label>Photos</label>
          
              <div className='mb-2 flex flex-wrap gap-2'>
              <ReactSortable className='flex flex-wrap gap-2' list={images} setList={updateImageOrder}>
                {images.map((image, index) => (
                  <div key={index} className='h-24 bg-white shadow-sm rounded-sm border border-gray-200 p-4'>
                    <img src={image} alt='photos' className='rounded-lg'/>
                  </div>
                ))}
              </ReactSortable>

              {isUploading &&(
                <div className='h-24 p-1 flex items-center'>
                  <Spinner/>
                </div>
              )}
              
                <label className='w-24 h-24 text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-sm border border-primary cursor-pointer'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  <div>
                    Add image
                  </div>
                  <input type="file" onChange={UploadImage} className='hidden'/>
                </label>

                {!images?.length && (
                  <div>No photos in this product</div>
                )}
              </div>
              
              <label>Description</label>        
              <textarea placeholder='description' value={description} onChange={ev => setDescription(ev.target.value)}></textarea>
              <label>Price (in USD)</label>        
              <input type='number' placeholder='price' value={price} onChange={ev => setPrice(ev.target.value)}/>
              <button type='submit' className='btn-primary'>Save</button>
          </form>
         

    )
}
