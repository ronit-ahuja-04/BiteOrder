const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: String, unique: true, index: true },
    tableNumber: { type: String, default: '12' },
    orderType: { type: String, enum: ['dine-in', 'takeaway'], default: 'dine-in' },
    items: {
      type: [mongoose.Schema.Types.Mixed],
      validate: [(v) => Array.isArray(v) && v.length > 0, 'Order must contain at least one item.'],
    },
    subtotal: { type: Number, default: 0, min: 0 },
    gst: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
    customer: {
      name: { type: String, default: 'Guest Customer' },
      mobile: { type: String, default: '9876543210' },
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'],
        message: 'Invalid status. Valid statuses are: Pending, Preparing, Ready, Served, Cancelled',
      },
      default: 'Pending',
    },
  },
  { timestamps: true, toJSON: { versionKey: false } }
);

// Generate a human-friendly order number (BO-1001, BO-1002, ...)
orderSchema.pre('validate', async function () {
  if (!this.orderId) {
    const count = await this.constructor.countDocuments();
    this.orderId = `BO-${1001 + count}-${Date.now().toString(36).slice(-3).toUpperCase()}`;
  }
});

// Indexes: "my orders" (owner + newest first) and admin filtering by status
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
