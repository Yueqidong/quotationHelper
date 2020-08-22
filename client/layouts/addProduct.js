import './addProduct.html';
import { products } from '../../lib/collections.js';

Template.addProduct.events({
  'submit form':function(e,template){
    e.preventDefault();
    var newProduct ={
      productSKU:$(e.target).find('[name=productSKU]').val(),
      price:$(e.target).find('[name=price]').val(),
      description:$(e.target).find('[name=description]').val()
    };
    newProduct._id=products.insert(newProduct);
    swal("Good job!", "A new product has been added", "success");
    FlowRouter.go("/");
  }
});
