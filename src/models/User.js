import mongoose from 'mongoose';

// user ka schema banate hain
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' },
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },

    // Cohort information
    cohort: {
      type: String,
      enum: [
        'High Spender',
        'Frequent Buyer',
        'Bulk Buyer',
        'Loyal Customer',
        'At Risk',
        'Inactive',
        'Regular Customer',
        'New Customer',
      ],
      default: 'New Customer',
    },

    // Calculated metrics (updated by cohort service)
    metrics: {
      totalOrders: { type: Number, default: 0 },
      totalSpent: { type: Number, default: 0 },
      avgCartValue: { type: Number, default: 0 },
      avgItemsPerOrder: { type: Number, default: 0 },
      orderFrequency: { type: Number, default: 0 }, // orders per month
      daysSinceLastOrder: { type: Number, default: null },
      daysSinceFirstOrder: { type: Number, default: null },
      lifetimeValue: { type: Number, default: 0 },
      lastOrderDate: { type: Date, default: null },
      firstOrderDate: { type: Date, default: null },
    },

    // Clustering data (for K-means)
    clusterData: {
      clusterId: { type: Number, default: null },
      features: {
        normalizedCartValue: { type: Number, default: 0 },
        normalizedFrequency: { type: Number, default: 0 },
        normalizedRecency: { type: Number, default: 0 },
        normalizedLifetimeValue: { type: Number, default: 0 },
      },
    },

    // Status and tracking
    isActive: {
      type: Boolean,
      default: true,
    },
    lastCohortUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user age
userSchema.virtual('age').get(function () {
  if (this.dateOfBirth) {
    return Math.floor(
      (Date.now() - this.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
  }
  return null;
});

// Virtual for account age in days
userSchema.virtual('accountAge').get(function () {
  if (this.registrationDate) {
    return Math.floor(
      (Date.now() - this.registrationDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }
  return 0;
});

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ cohort: 1 });
userSchema.index({ 'metrics.totalSpent': -1 });
userSchema.index({ 'metrics.totalOrders': -1 });
userSchema.index({ lastCohortUpdate: 1 });

export default mongoose.model('User', userSchema);
