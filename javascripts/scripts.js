$(document).ready(function(){
    var $placeImage = $("#placeImage");
    var $searchForm = $("#searchForm");

    $searchForm.submit(function(e){
        loadData(e);
    });

    function loadData(e){
        e.preventDefault();
        var $streetSource = $("#street")
        var $citySource = $("#city");
        var $completeAddress = $streetSource.val() + ', ' + $citySource.val(); 
        
        $placeImage.append("<img src='https://maps.googleapis.com/maps/api/streetview?size=500x300&location="+$completeAddress+"&key=AIzaSyDGxY_Mg_cOM4uNKdFe-TaBYqpBBBfxSQM'>");
        $streetSource[0].val = "";
        $citySource[0].val = "";
    };
});


