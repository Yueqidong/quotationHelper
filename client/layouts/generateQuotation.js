import './generateQuotation.html';
import { products,clients } from '../../lib/collections.js';
import { quotation } from '../../lib/collections.js';

Template.generateQuotation.helpers({
  product:function(){
    return products.find();
  }
});

Template.generateQuotation.events({
  'click .add':function(){
    var doc = products.find().fetch();
    var num = products.find().count();
    var productArray = [];
    for(let i = 0; i<num; i++){
      productArray.push(doc[i].productSKU);
    }

    var items;
    $.each(productArray,function(index,item){
      items+="<option>"+item+"</option>";
    });
    var row =
    '<br>'+
    '<br>'+
    '<div id="post">'+
    '<label>Product SKU:</label>'+
    '<select name="productSKU[]" class="form-control">'+
    items+
    '</select>'+
    '<br>'+
    '<br>'+
    '<label>Quantity:</label>'+
    '<input type="number" min="1" class="form-control" name="quantity[]" required>'+
    '</div>';
    $(".quantity").after(row);
  },
  'click .remove':function(){
    $("form #post:last").remove();
  },
  'submit form':function(e){
    e.preventDefault();
    var priceArray = [];
    var arr = $('input[name="quantity[]"]').map(function () {
    return $(this).val(); // $(this).val()
    }).get();

    var arr1 = $('select[name="productSKU[]"]').map(function () {
    return $(this).val(); // $(this).val()
    }).get();

    var discount = $(e.target).find('[name=discount]').val();

    var doc = products.find({productSKU:{$in:arr1}}).fetch();
    for(let i = 0; i<arr1.length; i++){
        priceArray.push(doc[i].price);
    }

    var descriptionArr = [];
    for(let i = 0; i<arr1.length; i++){
        descriptionArr.push(doc[i].description);
    }

    var subtotal = [];
    for(let i = 0; i<arr.length;i++){
      subtotal.push(arr[i]*priceArray[i]);
    }
    console.log(subtotal);

    var arr2 = [];
    for(let i = 0; i<arr1.length;i++){
      arr2.push({productSKU:arr1[i],price:priceArray[i],description:descriptionArr[i],quantity:arr[i],subtotal:subtotal[i]});
    }
    console.log(arr2);
    var userID = Accounts.userId();
    var companyEmail = Accounts.user().profile.email;
    var doc = clients.find({email:companyEmail}).fetch();

    var companyName = doc[0].companyName;
    var companyAddress = doc[0].companyAddress;


    var post ={
      quotationID:0,
      userID:userID,
      companyName:companyName,
      companyAddress:companyAddress,
      discount:discount,
      invoice:arr2
    };
    Meteor.call('addRecord',post,(error,response)=>{
      if(error){
        console.log(error.reason);
      }else{
        swal("Good job!", "Done", "success");
        FlowRouter.go("/");
      }
    })
  },
  'click .saveAndPrint':function(e,inst){
    var priceArray = [];
    var arr = $('input[name="quantity[]"]').map(function () {
    return $(this).val(); // $(this).val()
    }).get();

    var arr1 = $('select[name="productSKU[]"]').map(function () {
    return $(this).val(); // $(this).val()
    }).get();

    var discount = inst.$('[name=discount]').val();
    console.log(discount);

    var doc = products.find({productSKU:{$in:arr1}}).fetch();
    for(let i = 0; i<arr1.length; i++){
        priceArray.push(doc[i].price);
    }

    var descriptionArr = [];
    for(let i = 0; i<arr1.length; i++){
        descriptionArr.push(doc[i].description);
    }

    var subtotal = [];
    for(let i = 0; i<arr.length;i++){
      subtotal.push(arr[i]*priceArray[i]);
    }
    var arr2 = [];
    for(let i = 0; i<arr1.length;i++){
      arr2.push({productSKU:arr1[i],price:priceArray[i],description:descriptionArr[i],quantity:arr[i],subtotal:subtotal[i]});
    }
    console.log(arr2);
    var userID = Accounts.userId();
    var companyEmail = Accounts.user().profile.email;
    var doc = clients.find({email:companyEmail}).fetch();
    var companyName = doc[0].companyName;
    var companyAddress = doc[0].companyAddress;


    var post ={
      quotationID:0,
      userID:userID,
      companyName:companyName,
      companyAddress:companyAddress,
      discount:discount,
      invoice:arr2
    };
    Meteor.call('addRecord',post,(error,response)=>{
      if(error){
        console.log(error.reason);
      }else{
        swal("Good job!", "Done", "success");
        Meteor.call('generate_pdf',response, function(err, res) {
          if (err) {
             console.error(err);
          } else if (res) {
            var pdfResult = res;
            let pdfWindow = window.open("")
            pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(pdfResult) + "'></iframe>")
            FlowRouter.go("/");
          }
        })
      }
    })
  },
  'click .saveAndEmail':function(e,inst){
    var priceArray = [];
    var arr = $('input[name="quantity[]"]').map(function () {
    return $(this).val(); // $(this).val()
    }).get();

    var arr1 = $('select[name="productSKU[]"]').map(function () {
    return $(this).val(); // $(this).val()
    }).get();

    var discount = inst.$('[name=discount]').val();
    console.log(discount);

    var doc = products.find({productSKU:{$in:arr1}}).fetch();
    for(let i = 0; i<arr1.length; i++){
        priceArray.push(doc[i].price);
    }

    var descriptionArr = [];
    for(let i = 0; i<arr1.length; i++){
        descriptionArr.push(doc[i].description);
    }

    var subtotal = [];
    for(let i = 0; i<arr.length;i++){
      subtotal.push(arr[i]*priceArray[i]);
    }
    var arr2 = [];
    for(let i = 0; i<arr1.length;i++){
      arr2.push({productSKU:arr1[i],price:priceArray[i],description:descriptionArr[i],quantity:arr[i],subtotal:subtotal[i]});
    }
    console.log(arr2);
    var userID = Accounts.userId();
    var companyEmail = Accounts.user().profile.email;
    var doc = clients.find({email:companyEmail}).fetch();
    var companyName = doc[0].companyName;
    var companyAddress = doc[0].companyAddress;


    var post ={
      quotationID:0,
      userID:userID,
      companyName:companyName,
      companyAddress:companyAddress,
      discount:discount,
      invoice:arr2
    };

    var from = "attendancenoreply@gmail.com";
    var subject = "A new quotation is generated";
    var text = "Please check your quotation in the attachment."

    Meteor.call('addRecord',post,(error,response)=>{
      if(error){
        console.log(error.reason);
      }else{
        Meteor.call('generate_pdf',response, function(err, res) {
          if (err) {
             console.error(err);
          } else if (res) {
            var pdfResult = res;
            console.log(pdfResult);
            Meteor.call('sendPDF',companyEmail,from,subject,text,pdfResult,(error,response)=>{
              if(error){
                console.log(error.reason);
              }else{
                swal("Good job!", "The quotation has been sent to your email", "success");
                FlowRouter.go("/");
              }
            });

          }
        })
      }
    })
  }
});
