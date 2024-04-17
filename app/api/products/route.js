import mongoose from 'mongoose'
import { Product } from '@/models/products';
import { isAdmin } from '../auth/[...nextauth]/route';

export async function POST(Request){
    const data = await Request.json();
    mongoose.connect(process.env.MONGO_URL);
    if(await isAdmin()){
        const productItems = await Product.create(data);
        return Response.json(productItems);
    }else{
        return Response.json({});        
    }

}

export async function GET(){
    mongoose.connect(process.env.MONGO_URL);
    if(await isAdmin()){
        return Response.json(
            await Product.find()
          );
    }else{
        return Response.json({});        
    }


    
}


export async function PUT(Request){
    mongoose.connect(process.env.MONGO_URL);
    const {_id, ...data} = await Request.json();
    if(await isAdmin()){
        await Product.findByIdAndUpdate(_id, data);
        return Response.json(true);
    }else{
        return Response.json({});        
    }
}

export async function DELETE(Request) {
    mongoose.connect(process.env.MONGO_URL);
    const url = new URL(Request.url);
    const _id = url.searchParams.get('id');
    console.log(_id);
    if(await isAdmin()){
        await Product.deleteOne({_id});
        return Response.json(true);
    }else{
        return Response.json({});        
    }
  }

