// Import Mongoose

const { mongoose } = require("../server");

// Create Admin Schema

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
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
    isSuperAdmin: {
        type: Boolean,
        required: true,
    },
    creatingDate: {
        type: Date,
        default: Date.now(),
    },
});

// Create Store Model From Admin Schema

const adminModel = mongoose.model("admin", adminSchema);

// Create Product Schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    categoryId: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    discountInOfferPeriod: {
        type: Number,
        default: 0,
    },
    offerDescription: String,
    numberOfOrders: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    country: {
        type: String,
        default: "KW",
    },
    ratings: {
        type: Object,
        default: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
    },
    postOfDate: {
        type: Date,
        default: Date.now(),
    },
    imagePath: {
        type: String,
        required: true,
    },
    galleryImagesPaths: Array,
    startDiscountPeriod: Date,
    endDiscountPeriod: Date,
});

// Create Product Model From Product Schema

const productModel = mongoose.model("product", productSchema);

// Create User Schema

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    provider: {
        type: String,
        default: "same-site",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    previewName: {
        type: String,
        default: "",
    },
    billingAddress: {
        firstName: {
            type: String,
            default: "",
        },
        lastName: {
            type: String,
            default: "",
        },
        companyName: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "KW",
        },
        streetAddress: {
            type: String,
            default: "",
        },
        apartmentNumber: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "",
        },
        postalCode: {
            type: String,
            default: "",
        },
        phoneNumber: {
            type: String,
            default: "0096560048235",
        },
        email: {
            type: String,
            default: "",
        },
    },
    shippingAddress: {
        firstName: {
            type: String,
            default: "",
        },
        lastName: {
            type: String,
            default: "",
        },
        companyName: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "KW",
        },
        streetAddress: {
            type: String,
            default: "",
        },
        apartmentNumber: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "",
        },
        postalCode: {
            type: String,
            default: "",
        },
        phoneNumber: {
            type: String,
            default: "0096560048235",
        },
        email: {
            type: String,
            default: "",
        },
    },
    language: {
        type: String,
        enum: [
            "ar",
            "en",
            "de",
            "tr"
        ],
        default: "en"
    },
    dateOfCreation: {
        type: Date,
        default: Date.now()
    },
});

// Create User Model From User Schema

const userModel = mongoose.model("user", userSchema);

// Create Account Verification Codes Schema

const accountVerificationCodesShema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    createdDate: Date,
    expirationDate: {
        type: Date,
        required: true,
    },
    requestTimeCount: {
        type: Number,
        default: 1,
    },
    isBlockingFromReceiveTheCode: {
        type: Boolean,
        default: false,
    },
    receiveBlockingExpirationDate: Date,
    typeOfUse: {
        type: String,
        default: "to activate account",
        enum: [
            "to activate account",
            "to reset password",
        ],
    }
});

// Create Account Verification Codes Model From Account Codes Schema

const accountVerificationCodesModel = mongoose.model("account_verification_codes", accountVerificationCodesShema);

// Create Category Schema

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

// Create Category Model From Category Schema

const categoryModel = mongoose.model("category", categorySchema);

// Create Order Schema

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: "",
    },
    totalPriceBeforeDiscount: {
        type: Number,
        default: 0,
    },
    totalDiscount: {
        type: Number,
        default: 0,
    },
    totalPriceAfterDiscount: {
        type: Number,
        default: 0,
    },
    orderAmount: {
        type: Number,
        default: 0,
    },
    checkoutStatus: {
        type: String,
        default: "Checkout Incomplete",
        enum: [
            "Checkout Incomplete",
            "Checkout Successfull"
        ],
    },
    creator: {
        type: String,
        required: true,
        enum: [
            "user",
            "guest"
        ],
    },
    paymentGateway: {
        type: String,
        required: true,
        enum: [
            "tap",
        ],
    },
    status: {
        type: String,
        default: "pending",
        enum: [
            "pending",
            "shipping",
            "completed"
        ]
    },
    billingAddress: {
        firstName: {
            type: String,
            default: "none",
        },
        lastName: {
            type: String,
            default: "none",
        },
        companyName: {
            type: String,
            default: "none",
        },
        country: {
            type: String,
            default: "none",
        },
        streetAddress: {
            type: String,
            default: "none",
        },
        apartmentNumber: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "none",
        },
        postalCode: {
            type: Number,
            default: 0,
        },
        phone: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "none",
        },
    },
    shippingAddress: {
        firstName: {
            type: String,
            default: "none",
        },
        lastName: {
            type: String,
            default: "none",
        },
        companyName: {
            type: String,
            default: "none",
        },
        country: {
            type: String,
            default: "none",
        },
        streetAddress: {
            type: String,
            default: "none",
        },
        apartmentNumber: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "none",
        },
        postalCode: {
            type: Number,
            default: 0,
        },
        phone: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "none",
        },
    },
    products: [{
        productId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        name: {
            type: String,
            default: "none",
        },
        unitPrice: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        imagePath: {
            type: String,
            default: "none",
        },
    }],
    addedDate: {
        type: Date,
        default: Date.now(),
    },
    orderNumber: Number,
    requestNotes: {
        type: String,
        default: "",
    },
    isReturned: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        default: false,
        type: Boolean,
    },
    shippingCost: {
        forLocalProducts: {
            type: Number,
            default: 0,
        },
        forInternationalProducts: {
            type: Number,
            default: 0,
        }
    },
    shippingMethod: {
        forLocalProducts: {
            type: String,
            enum: ["normal", "fast"],
            required: true
        },
        forInternationalProducts: {
            type: String,
            enum: ["normal", "fast"],
            required: true
        }
    },
    language: {
        type: String,
        enum: [
            "ar",
            "en",
            "de",
            "tr"
        ],
        default: "en"
    },
});

// Create Order Model From Order Schema

const orderModel = mongoose.model("order", orderSchema);

// Create Brand Schema

const brandSchema = new mongoose.Schema({
    imagePath: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
});

// Create Brand Model From Brand Schema

const brandModel = mongoose.model("brand", brandSchema);

// Create Appeared Sections Schema

const appearedSectionsSchema = new mongoose.Schema({
    sectionName: String,
    isAppeared: {
        type: Boolean,
        default: false,
    },
});

// Create Appeared Sections Model From Appeared Sections Schema

const appearedSectionsModel = mongoose.model("appeared_sections", appearedSectionsSchema);

// Create Global Password Schema

const globalPasswordSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// Create Global Password Model From Global Password Schema

const globalPasswordModel = mongoose.model("global_password", globalPasswordSchema);

// Create Referal Schema

const referalShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    referalDate: {
        type: Date,
        default: Date.now(),
    },
    isAppeared: {
        type: Boolean,
        default: true,
    }
});

// Create Referal Model From Referal Schema

const referalModel = mongoose.model("referal", referalShema);

// Create Favorite Product Schema

const favoriteProductShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

// Create Favorite Product Model From Favorite Product Schema

const favoriteProductModel = mongoose.model("favorite_products", favoriteProductShema);

// Create Products Wallet Schema

const productsWalletShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

// Create Products Wallet Model From Products Wallet Schema

const productsWalletModel = mongoose.model("products_wallet", productsWalletShema);

// Create Product Rating Schema

const productsRatingShema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        enum: [1,2,3,4,5]
    }
});

// Create Products Rating Model From Products Rating Schema

const productsRatingModel = mongoose.model("products_rating", productsRatingShema);

// Create Ads Schema

const adSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["text", "image"],
    },
    content: String,
    imagePath: String,
    dateOfPost: {
        type: Date,
        default: Date.now(),
    },
});

// Create Ads Model From Ads Schema

const adModel = mongoose.model("ad", adSchema);

// Create Coupon Schema

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    discountPercentage: {
        type: Number,
        default: false,
    },
    creatingDate: {
        type: Date,
        default: Date.now(),
    },
});

// Create Coupon Model From Coupon Schema

const couponModel = mongoose.model("coupon", couponSchema);

module.exports = {
    mongoose,
    adminModel,
    productModel,
    userModel,
    accountVerificationCodesModel,
    categoryModel,
    orderModel,
    brandModel,
    appearedSectionsModel,
    globalPasswordModel,
    referalModel,
    favoriteProductModel,
    productsWalletModel,
    productsRatingModel,
    adModel,
    couponModel
}