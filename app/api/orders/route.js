import mongoose from 'mongoose'
import { authOptions, isAdmin } from '../auth/[...nextauth]/route';
import { Order } from '@/models/Order';
export async function GET(){
    mongoose.connect(process.env.MONGO_URL);
    if(await isAdmin()){
      return Response.json(
        await Order.find().sort({createdAt:-1})
      );
    }else{
      return Response.json({});
    }

}