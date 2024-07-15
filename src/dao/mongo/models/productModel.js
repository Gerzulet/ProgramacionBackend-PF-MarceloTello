import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "products";

const productSchema = mongoose.Schema({
  
  title: {
    type:String,
    required: true,
    index: { background: true}
  },
  code: { 
    type: String, 
    unique: true,
    index: true
  },
  description: {
    type:String,
    required: true
  },
  category: {
    type:String,
    required: true,
    index: {background: true}
  },
  price: {
    type:Number,
    required: true,
    index: true
  },
  thumbnail: {
    type:Array,
    required: false,
    default: []
  },
  stock: {
    type:Number,
    required: true
  },
  status: {
    type:Boolean,
    required: false,
    default:true
  }

});


productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;