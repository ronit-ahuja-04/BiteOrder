const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, '"name" is a required field.'], trim: true },
    category: {
      type: String,
      required: [true, '"category" is a required field.'],
      trim: true,
      lowercase: true,
      enum: {
        values: ['starters', 'mains', 'breads', 'desserts', 'beverages'],
        message: '"category" must be one of: starters, mains, breads, desserts, beverages.',
      },
    },
    price: {
      type: Number,
      required: [true, '"price" is a required field.'],
      min: [1, '"price" must be a positive number.'],
    },
    halfPrice: { type: Number, min: 0 },
    isVeg: { type: Boolean, default: true },
    description: { type: String, trim: true, default: 'Delicious handcrafted chef specialty dish.' },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    ratingCount: { type: Number, min: 0, default: 1 },
    prepTime: { type: Number, min: 1, default: 15 },
    calories: { type: String, default: '300 kcal' },
    isBestseller: { type: Boolean, default: false },
    isChefSpecial: { type: Boolean, default: false },
    availableAddons: { type: [addonSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      // Expose the ObjectId as a string `id` so the React client keeps using item.id
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

// Indexes: fast category filtering and text search on name/description
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
