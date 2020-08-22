import './export.html';
import './exporter.js';
import { Template } from 'meteor/templating';
import swal from 'sweetalert';

//An events handler that invoke a global function in order to export all attendance data
Template.export.events({
  "click #export": function() {
    MyAppExporter.exportAllContacts();
  }
});
