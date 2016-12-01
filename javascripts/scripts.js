$(document).ready(function(){
    var $placeImage = $("#placeImage");
    var $searchForm = $("#searchForm");
    var $placeNytInfo = $("#placeNytInfo");
    var $placeWikiInfo = $("#placeWikiInfo");

    $searchForm.submit(function(e){
        loadData(e);
    });

    function loadData(e){
        e.preventDefault();
        
        var $streetSource = $("#street");
        var $citySource = $("#city");
        var $completeAddress = $streetSource.val() + ', ' + $citySource.val();
        var loadingTextNyt = "<h3>Searching in New York Times articles ....</h3>";
        var loadingTextWiki = "<h3>Searching in Wikipedia ....</h3>";
        var newYorkTimesURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";   // NewYork Times API request
        
        newYorkTimesURL += '?'+ $.param({
            'api-key':"76bd84159cd34d57ab3169c66ade9e8a",
            'q': $streetSource.val()
        });
        
        $placeImage.empty(); // Remove previous searched image to Insert New image per search
        $placeNytInfo.empty(); // Remove previous NYT news to Insert New news hedings per search
        $placeWikiInfo.empty();
        
        // Add image from Google Street View API of matched address
        // $placeImage.append("<img id = 'searchImage' src='https://maps.googleapis.com/maps/api/streetview?size=500x300&location="+$completeAddress+"&key=AIzaSyDGxY_Mg_cOM4uNKdFe-TaBYqpBBBfxSQM'>");
        
        // $placeNytInfo.append(loadingTextNyt);
        // $placeWikiInfo.append(loadingTextWiki);
        
        /************** NYT API request *********/
        
        $.getJSON(newYorkTimesURL)
            .done(function(data){
                // console.log(data.response.docs);
                var title = "<h3>Matched results from New York Times magazine</h3>"
                var matchItems = data.response.docs; // Array of matched search news in NYT
                var outDiv = '<ol>'
                
                matchItems.forEach(function(item){
                    outDiv += '<li><a target="_blank" href="'+item.web_url+'">'+item.headline.main+'</a><p>'+item.lead_paragraph+'</p></li>';
                });
                outDiv +='</ol>';
                $placeNytInfo.empty(); // Remove previous NYT news to Insert New news hedings per search
                $placeNytInfo.addClass("informationBox");
                $placeNytInfo.append(title);
                $placeNytInfo.append(outDiv);
            })
            .fail(function(err){
                $placeNytInfo.empty();
                $placeNytInfo.addClass("informationBox");
                var errorMessage = "<h3 style='color:#c83349;'>Sorry, NewYork Times articles could not be loaded.</h3>";
                $placeNytInfo.append(errorMessage);
            });
        /************** Wikipedia API request *********/   
        $.ajax( {
            url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+ $citySource.val() +"&format=json",
            dataType: 'jsonp',
            crossDomain: true
            })
            .done(function(data){
                if(!data.error){
                    var matchItems = data.query.search;
                    var outDiv = '<ol>';
                    var title = '<h3>Matched results from Wikipedia</h3>';
                    
                    matchItems.forEach(function(item){
                        outDiv += '<li><a target="_blank" href="https://www.wikipedia.org/wiki/'+ item.title +'">'+ item.title +'</a><p>'+item.snippet+'</p></li>';
                    });
                    outDiv +='</ol>';
                    $placeWikiInfo.empty(); // Remove previous NYT news to Insert New news hedings per search
                    $placeWikiInfo.addClass("informationBox");
                    $placeWikiInfo.append(title);
                    $placeWikiInfo.append(outDiv);
                }else{
                    $placeWikiInfo.empty();
                    $placeWikiInfo.addClass("informationBox");
                    $placeWikiInfo.append("<h3 style='color:#c83349;'>Failed to load wikipedia content</h3>");
                }
                
            })
            .fail(function(err){
                $placeWikiInfo.empty();
                $placeWikiInfo.addClass("informationBox");
                $placeWikiInfo.append("<h3 style='color:#c83349;'>Failed to load wikipedia content</h3>");
            });

        // $streetSource.val("");   // Empty search fields items in the end
        // $citySource.val("");
    };
});

/************** In Global Scope --> Google Geocoding API *********/
function initMap(){
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 60.1639305, lng: 24.9001875},
        zoom: 10
    });
    var geocoder = new google.maps.Geocoder();

    document.getElementById('submitButton').addEventListener('click',function(){
        geocodeAddress(geocoder, map);
    });

    function geocodeAddress(geocoder, resultsMap) {
        var address =  document.getElementById('street').value +', '+ document.getElementById('city').value;
        console.log(address);
        geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location
            });
        } else {
            alert('Oops! Google cannot find the place');
        }
        });
    }
}
