import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {

        product: {
          type: mongoose.Schema.ObjectId,
          ref: "products"
        },
        quantity: {
          type: Number,
          default: 1
        }

      }
    ],
    default: []
  }
});

cartSchema.pre("find", function() {
  this.populate("products.product");
})

cartSchema.plugin(mongoosePaginate);

export const cartModel = mongoose.model(cartCollection, cartSchema)
export default cartModel;