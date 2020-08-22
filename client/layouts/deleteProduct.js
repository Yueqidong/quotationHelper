import './deleteProduct.html';
import { products } from '../../lib/collections.js';

Template.productList.helpers({
  product:function(){
    return products.find();
  }
});

Template.productList.events({
  'click .delete':function(){
    productID = this._id;
    products.remove({_id:productID});
    swal("Message", "A product has been deleted", "success");
    FlowRouter.go("/");
  }
});
