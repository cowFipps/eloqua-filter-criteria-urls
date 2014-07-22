/*
 * Author: Kyle Phelps
 * Date: July 22, 2014
 * Version: 0.1
 * Description: Run from command line while passing filter name in the args:
 *		user$ node filterCriteria.js 'filter name'
*/

// Include the request library for Node.js  
var request = require('request');  
  
//  Basic Authentication credentials  
var username = "companyName\\userName";  
var password = "password";  
var authenticationHeader = "Basic " + new Buffer(username + ":" + password).toString("base64");
//set filter name from args
var filterName = process.argv.slice(2);


//Vars
var numCriteria;
var urlIdContainer={};
var urlContainer={};
  
// Search for shared filter 
request(  
    {  
        url : "https://secure.eloqua.com/API/REST/1.0/assets/contact/filters?search='" + filterName + "'&depth=complete", 
        headers : { "Authorization" : authenticationHeader }
    },  
    function (error, response, body) {  
        json = JSON.parse(body);	
		numCriteria = json.elements[0].criteria.length;
		console.log('numCriteria: ', numCriteria);
		
		for(var z=0; z<numCriteria; z++){
			urlIdContainer[z] = json.elements[0].criteria[z].trackedUrlIds;
		}	
		
		console.log('urlIdContainer: ', urlIdContainer);

		//iterate through the shared filter criteria
		for(var y=0; y<numCriteria; y++){
			
			//for each criteria, filter through the link IDs
			for(var x = 0; x < urlIdContainer[y].length; x++){
				
				//retrieve URL of each link ID 
				request(  
				    {  
						url : "https://secure.eloqua.com/API/REST/1.0/assets/trackedUrl/" + urlIdContainer[y][x] + "?depth=minimal",
				        headers : { "Authorization" : authenticationHeader }
				    },  
				    function (error, response, body) {  
				        json = JSON.parse(body);
						urlContainer = json.name;
						console.log(urlContainer); 
				    }  
				);
			}
		}
    }  
);  