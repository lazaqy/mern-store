import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    orderId: {
        type: String,
        required: [true, "Please enter an orderId"],
        unique: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    product_details: {
        name: String,
        image: Array,
    },
    paymentId: {
        type: String,
        default: "",
    },
    payment_status: {
        type: String,
        default: "",
    },
    delivery_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    },
    subTotalAmount: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    invoice_reciept: {
        type: String,
        default: "",
    }
}, {
    timestamps: true
});

const OrderModel = mongoose.model("Order", orderSchema);   

export default OrderModel