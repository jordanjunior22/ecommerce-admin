import mongoose from 'mongoose'
import { Category } from '@/models/categories';
import { authOptions, isAdmin } from '../auth/[...nextauth]/route';


export async function POST(Request){
    const {name, parentCategory,properties} = await Request.json();
    mongoose.connect(process.env.MONGO_URL);
    if(await isAdmin()){
      const categoryItems = await Category.create({name, parent: parentCategory || null, properties});
      return Response.json(categoryItems);
    }else{
      return Response.json({});
    }

}

export async function GET(){
    mongoose.connect(process.env.MONGO_URL);
    if(await isAdmin()){
      return Response.json(
        await Category.find().populate('parent')
      );
    }else{
      return Response.json({});
    }

}

export async function PUT(Request){
  const {name, parentCategory,properties,_id} = await Request.json();
  mongoose.connect(process.env.MONGO_URL);
  if(await isAdmin()){
    const categoryItems = await Category.updateOne({_id},{name, parent: parentCategory || null, properties});
    return Response.json(categoryItems);
  }
  else{
    return Response.json({});
  }

}

export async function DELETE(Request) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(Request.url);
  const _id = url.searchParams.get('id');
  if(await isAdmin()){
    await Category.deleteOne({_id});
    return Response.json(true);
  }
  else{
    return Response.json({});
  }
}