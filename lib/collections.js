import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Random } from 'meteor/random'

export const clients = new Mongo.Collection('clients');
export const products = new Mongo.Collection('products');
export const Pokemon = new Mongo.Collection('pokemon');
export const quotation = new Mongo.Collection('quotation');


const userSchema = new SimpleSchema({
  userTitle:{
    type: String,
    label: "User Title"
  },
  name:{
    type: String,
    label: "name"
  },
  companyName:{
    type: String,
    label:"Company Name"
  },
  companyAddress:{
    type:String,
    label:"Company Address"
  },
  BusinessRegistrationNo:{
    type:Number,
    label:"Business Registration Number"
  },
  email:{
    type:String,
    label:"Email"
  },
  contact:{
    type:String,
    label:"Contact"
  },
  password:{
    type:String,
    label:"Password",
    autoValue: function(){
      return Random.id([8]);
    }
  },
  createdAt:{
    type:Date,
    label:"Created At",
    autoValue: function(){
      return new Date()
    }
  }
});

const productSchema = new SimpleSchema({
  productSKU:{
    type:String,
    label:"Product SKU"
  },
  price:{
    type:Number,
    label:"Unit Price"
  },
  description:{
    type:String,
    label:"Product Description"
  }
});

const quotationSchema = new SimpleSchema({
  quotationID:{
    type:String,
    label:"Quotation Reference",
    optional: true
  },
  userID:{
    type:String,
    label:"User ID"
  },
  companyName:{
    type:String,
    label:"Company Name"
  },
  companyAddress:{
    type:String,
    label:"Company Address"
  },
  discount:{
    type:String,
    label:"Discount"
  },
  invoice:{
    type:Array,
    maxCount:7
  },
  'invoice.$': Object,
  'invoice.$.productSKU': String,
  'invoice.$.price': Number,
  'invoice.$.description': String,
  'invoice.$.quantity': Number,
  'invoice.$.subtotal':Number,
});


Pokemon.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "Name"
  },
  description: {
    type: String,
    label: "Description"
  },
  image_url: {
    type: String,
    label: "Image URL"
  }
}));

clients.attachSchema(userSchema);
products.attachSchema(productSchema);
quotation.attachSchema(quotationSchema);
