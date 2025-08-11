import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Order details
    items: [orderItemSchema],

    // Pricing information
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order status and tracking
    status: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
        'Returned',
      ],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: [
        'Credit Card',
        'Debit Card',
        'UPI',
        'Net Banking',
        'Cash on Delivery',
        'Wallet',
      ],
      required: true,
    },

    // Dates
    orderDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expectedDeliveryDate: {
      type: Date,
    },
    deliveredDate: {
      type: Date,
    },

    // Shipping information
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' },
      phone: String,
    },

    // Additional metadata
    source: {
      type: String,
      enum: ['Website', 'Mobile App', 'Phone', 'Store'],
      default: 'Website',
    },
    couponCode: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
orderSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual('uniqueProducts').get(function () {
  return this.items.length;
});

orderSchema.virtual('averageItemPrice').get(function () {
  if (this.items.length === 0) return 0;
  return this.subtotal / this.totalItems;
});

// Calculate order metrics
orderSchema.virtual('orderMetrics').get(function () {
  return {
    totalItems: this.totalItems,
    uniqueProducts: this.uniqueProducts,
    averageItemPrice: this.averageItemPrice,
    discountPercentage:
      this.subtotal > 0 ? (this.discount / this.subtotal) * 100 : 0,
    cartValue: this.totalAmount,
  };
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function (next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  // Calculate total amount
  this.totalAmount =
    this.subtotal - this.discount + this.tax + this.shippingCost;

  // Generate order ID if not provided
  if (!this.orderId) {
    this.orderId = `ORD${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;
  }

  next();
});

// Indexes for efficient queries
orderSchema.index({ userId: 1, orderDate: -1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: 1 });
orderSchema.index({ userId: 1 });

export default mongoose.model('Order', orderSchema);
