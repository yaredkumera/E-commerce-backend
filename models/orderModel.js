import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  firstName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  townCity: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ['bank', 'cod'],
    default: 'cod',
  },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
export default Order