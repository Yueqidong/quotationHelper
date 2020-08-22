import Papa from 'papaparse';

MyAppExporter = {
	exportAllContacts: function() {
		var self = this;
		//To call the method in the server side
		Meteor.call("exportAllContacts", function(error, data) {

			if ( error ) {
				alert(error);
				return false;
			}
			//Convert data into a csv file
			var csv = Papa.unparse(data);
			self._downloadCSV(csv);
		});
	},
	//This function enables users to download a csv file that contains all the attendance data
	_downloadCSV: function(csv) {
		var blob = new Blob([csv]);
		var a = window.document.createElement("a");
	    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
	    a.download = "exportedData.csv";
	    document.body.appendChild(a);
	    a.click();
	    document.body.removeChild(a);
	}
}
