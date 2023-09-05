import mongoose from "mongoose";
import { hashPassword } from "../../utils/auth.utils";

const UserSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
      // 0-normal and 1-business account
    },
    profilePicture: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    bussiness: {
      type: String,
      required: function () {
        return this.role === 1;
      },
    },
    lastLogin: {
      type: Date,
      required: false,
    },
    myOrders: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        orderedQuantity: {
          type: Number,
          required: true,
        },
        orderedSize: {
          type: String,
          required: true,
        },
      },
      {
        timestamps: true,
      },
    ],
    tokens: [
      {
        type: String,
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("fullName").get(function () {
  return `${this.fName} ${this.lName}`;
});

UserSchema.virtual("initials").get(function () {
  return `${this.fName[0]}${this.lName[0]}`;
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
  }

  if (this.isModified("role") && this.role === 1) {
    console.log("here role is 1");
    this.orders = [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ];
    this.products = [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ];
  }

  next();
});

export const User = mongoose.model("User", UserSchema);
