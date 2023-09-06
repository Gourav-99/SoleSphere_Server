import mongoose from "mongoose";
const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    sizes: {
      type: [String],
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    user: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
ProductSchema.pre("save", function (next) {
  // Trim tags
  if (this.tags && Array.isArray(this.tags)) {
    this.tags = this.tags[0].split(",").map((size) => size.trim());
  }

  // Trim sizes
  if (this.sizes && Array.isArray(this.sizes)) {
    this.sizes = this.sizes[0].split(",").map((size) => size.trim());
  }

  next();
});

export const Product = mongoose.model("Product", ProductSchema);
