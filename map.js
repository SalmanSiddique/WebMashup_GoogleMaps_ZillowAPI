var zwsid = "X1-ZWz1b3db8ojh1n_6o78e";
google.maps.event.addDomListener(window, 'load', initialize);
var request = new XMLHttpRequest();
var geocoder;
var map;
var newlatlng;
var mapOptions;
var markers = [];
var housevalue="";

function initialize () {
	request.onreadystatechange = function() {
	if (request.readyState == 4 && request.status==200) {
		displayResult();
		}
	}
	geocoder = new google.maps.Geocoder();
	newlatlng = new google.maps.LatLng('32.75','-97.13');
	mapOptions = {zoom: 16, center: newlatlng}
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var marker = new google.maps.Marker({
             position: newlatlng,
             map: map,
	         icon: 'home.png'
		});
	markers.push(marker);
	google.maps.event.addListener(map, 'click', function(event) {
	doReverseGeocoding(event.latLng);
	});
}

function doReverseGeocoding(latLng){
    geocoder.geocode( { 'latLng': latLng}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
		var infowindow = new google.maps.InfoWindow();
		if (results[0]) {
		var res = results[0].formatted_address.split(',');
				if(res.length==4 && res!=null)
				{
					 address=res[0];
					 city=res[1];
					 state=res[2];
					 zipcode=res[3];
					 openURL(address,city,state,zipcode)
				}
				else
				{
					alert('Reverse Geocode cannot find the postal address based on the location provided, please try again');
				}
			}
		} 
		else {
			alert("Reverse Geocode cannot find the postal address based on the location provided, please try again " + status);
		}
    });
}
 function doGeoCoding(geoaddress) {
    geocoder.geocode( { 'address': geoaddress}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
	    var infowindow = new google.maps.InfoWindow();
		map.setZoom(16); 
		map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
             position: results[0].geometry.location,
             map: map,
	         title: results[0].formatted_address,
	         icon: 'home.png'
		});
		markers.push(marker);
		google.maps.event.addListener(marker, 'click', function() {
	        infowindow.close();
            infowindow.setContent('Cost of house: $'+housevalue+'<br/>Postal address: '+results[0].formatted_address);
            infowindow.open(map,marker);
		});
      } else {
        alert("Geocode cannot find the location based on the postal address provided, please try again " + status);
      }
    });
  }

function displayResult () {
		var xmldoc = request.responseXML;
        if(xmldoc.getElementsByTagName("code")[0].childNodes[0].nodeValue == '0')
			{
				for(i=0;i<xmldoc.getElementsByTagName("result").length;i++) {
					housevalue = xmldoc.getElementsByTagName("amount")[i].childNodes[0].nodeValue;
					var geoaddress = xmldoc.getElementsByTagName("street")[i].childNodes[0].nodeValue +", "+xmldoc.getElementsByTagName("city")[i].childNodes[0].nodeValue+", "+xmldoc.getElementsByTagName("state")[i].childNodes[0].nodeValue+", "+xmldoc.getElementsByTagName("zipcode")[i].childNodes[0].nodeValue;
					document.getElementById("output").innerHTML = "<br/><br/>Cost of house: $"+housevalue+"<br/>Postal address: "+geoaddress + document.getElementById("output").innerHTML;
					doGeoCoding(geoaddress);
				}
			}
			else
			{
			   alert('Zillow does not have any information for the provided address, please try again with different address');
			}
}

function clearAll()
{
	document.getElementById("output").innerHTML = "";
	for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
    }
}

function openURL(address,city,state,zipcode)
{
	request.open("GET",encodeURI("proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode));
	request.withCredentials = "true";
	request.send(null);
}

function sendRequest() {
	
    var fulladdress = document.getElementById("address").value;
	var res = fulladdress.split(',');
	if(res!=null && res.length==4)
	{
		var address = res[0].trim();
		var city = res[1].trim();
		var state = res[2].trim();
		var zipcode = res[3].trim();
		openURL(address,city,state,zipcode);
	}
	else if (res!=null && res.length==3)
	{
		var address = res[0].trim();
		var city = res[1].trim();
		var state = res[2].trim();
		openURL(address,city,state,'');
	}
	else
	{
		alert('Invalid address, please try providing more specific address with atleast fields: street address, city, state using comma separated values Eg 1) 620 Circle Dr, Arlington, TX 2) 620 Circle Dr, Arlington, TX, 76010 ');
	}
}