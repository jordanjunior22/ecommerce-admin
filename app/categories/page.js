"use client"
import React, { useEffect } from 'react'
import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import axios from 'axios';
import { useRouter } from 'next/navigation'

export default function page() {
    const router = useRouter();
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('');
    const [Categories, setCategories] = useState('');
    const [parentCategory, setParentCategory] =useState('');
    const [properties, SetProperties] = useState([]);

    useEffect(()=>{
        axios.get('/api/categories').then(results  => {
            setCategories(results.data);
        })
    },[])

    async function fetchCategory(){
        axios.get('/api/categories').then(result =>{
            setCategories(result.data);
        })
    }

    async function saveCategory(ev){
        ev.preventDefault();
        const data = {name,parentCategory,properties:properties.map(p=>({ name:p.name, values:p.values.split(',')}))}
        //console.log(data);
        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }else{
            await axios.post('/api/categories', data);
            
        }
        setName('');
        setParentCategory('');
        SetProperties([]);
        fetchCategory();
    }
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        SetProperties(category.properties.map(({name,values})=>({
            name,
            values:values.join(',')
        })))
        
    }
    function addProperty(){
        SetProperties(prev=>{
            return [...prev, {name:'',values:''}];
        });
    }
    function handlePropertyNameChange(index,property,newName){
        SetProperties(prev =>{
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }
    function handlePropertyValuesChange(index,property,newValues){
        SetProperties(prev =>{
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }
    function removeProperty(indexToRemove){
        SetProperties(prev=>{
            const newProperties =[...prev];
            return newProperties.filter((p,pIndex)=>{
                return pIndex !== indexToRemove;
            })
        })
    }
  return (
    <AdminLayout>
        <h1>Categories</h1>
        <label>{editedCategory ? `Edit Category ${editedCategory.name}`: 'Create New Category Name'}</label>
        <form onSubmit={saveCategory}>
        <div className="flex gap-1">
            <input type='text' placeholder='categories' value={name} onChange={ev => setName(ev.target.value)}/>
            <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                <option value="0" >No parent Category</option>
                {Categories.length > 0 && Categories.map(category => (
                    <option value={category._id}>{category.name}</option>
                ))}
            </select>
        </div>
        <div className='mt-2'>
            <label className='block'>Properties</label>
            <button onClick={addProperty} type='button' className='btn-default mb-2'>Add new property</button>   
            {properties.length > 0 && properties.map((property,index) =>(
                <div className='flex gap-1 mb-2'>
                    <input className='mb-0' type="text" value={property.name} onChange={ev=>handlePropertyNameChange(index,property,ev.target.value)} placeholder="propery name (example: color)"/>
                    <input className='mb-0' type="text" value={property.values} onChange={ev=>handlePropertyValuesChange(index,property,ev.target.value)} placeholder="values, comma seperated"/>
                    <button type='button' onClick={()=>removeProperty(index)} className='btn-default' >Remove</button>
                </div>
            ))}
        </div>
        <div className='flex gap-1'>
        {editedCategory && (
            <button type='button' onClick={()=> {setEditedCategory(null); setName(''); setParentCategory(''); SetProperties([]);}} className='btn-default'>Cancel</button>
        )}
        <button type='submit' className='btn-primary py-1 '>Save</button>
        </div>
       
        </form>
        {!editedCategory && (
        <table className='basic mt-4'>
            <thead>
                <tr>
                    <td>Categories Name</td>
                    <td> Parent Categories</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {Categories.length > 0 && Categories.map(category => (
                    <tr>
                        <td>{category.name}</td>
                        <td>{category?.parent?.name}</td>
                        <td>
                            <button onClick={()=> editCategory(category)} className='btn-default mr-1'>Edit</button>
                            <button onClick={() => router.push(`/categories/delete/${category._id}`)} className='btn-red'>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    
        )}
        
    </AdminLayout>
  )
}
