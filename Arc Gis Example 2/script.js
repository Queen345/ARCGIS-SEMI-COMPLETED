       
require(["esri/Map", 
         "esri/views/MapView", 
         "esri/widgets/Directions", 
         "esri/layers/RouteLayer",
         "esri/views/SceneView",
         "esri/layers/TileLayer",
         "esri/layers/FeatureLayer",
         "esri/widgets/Measurement",
         "esri/widgets/Legend"], function(
  Map,
  MapView,
  Directions,
  RouteLayer,
  SceneView,
  TileLayer,
  FeatureLayer,
  Measurement,
  Legend 
) {

  // An authorization string used to access the basemap, geocoding and routing services
  const apiKey = "AAPK7bf6401f8bea414a85a701aac7b8b0earjPpn-zyl2_mqTHnklC_VwDFtA6qdRwKbklzUpMZNT3i7907OsQv7pFSkZqvs8pc";

  // create a new RouteLayer, required for Directions widget
  const routeLayer = new RouteLayer();

   // World Ocean Base Basemap
   const tileLayer = new TileLayer({
    url:
      "https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer"
  });

  // Capital cities in Europe FeatureLayer
  const featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/africa_country_capitals/FeatureServer/0"
  });

  // new RouteLayer must be added to the map
  const map = new Map({
    basemap: "streets-navigation-vector",
    layers: [ routeLayer]
  });

  const view = new MapView({
    zoom: 5,
    center: [5.635332, -0.123399],
    container: "viewDiv",
    map: map
  });

  // new RouteLayer must be added to Directions widget
  let directionsWidget = new Directions({
    layer: routeLayer,
    apiKey,
    view
  });

  // Add the Directions widget to the top left corner of the view
  view.ui.add(directionsWidget, {
    position: "top-left"
  });

   // Create SceneView with similar extent to MapView
   const sceneView = new SceneView({
    scale: 123456789,
    center:  [5.635332, -0.123399],
    map: map
  });

   

    // Set the activeView to the 2D MapView
    let activeView = MapView;

    // Create new instance of the Measurement widget
    const measurement = new Measurement();

    // Create new instance of the Legend widget
    const legend = new Legend({
    layerInfos: [{
        layer: routeLayer,
        title: "European Capital Cities"
    }]
    });
  
    // Set-up event handlers for buttons and click events
    const switchButton = document.getElementById("switch-btn");
    const distanceButton = document.getElementById('distance');
    const areaButton = document.getElementById('area');
    const clearButton = document.getElementById('clear');
    const priceBtn = document.getElementById('btn');

    switchButton.addEventListener("click", () => {
    switchView();
    });
    distanceButton.addEventListener("click", function() {
    distanceMeasurement();
    });
    areaButton.addEventListener("click", () => {
    areaMeasurement();
    });
    clearButton.addEventListener("click", () => {
    clearMeasurements();
    });
    // priceBtn.addEventListener('click', () => {
    //   estimatePrice()
    // })


    // estimatePrice.addEventListener("click", () => {
    //     convert();
    // });



    // Call the loadView() function for the initial view
    loadView();

    // The loadView() function to define the view for the widgets and div
    function loadView() {
    activeView.set({
        container: "viewDiv"
    });
    // Add the appropriate measurement UI to the bottom-right when activated
    activeView.ui.add(measurement, "bottom-right");
    // Add the legend to the bottom left
    activeView.ui.add(legend, "bottom-left");
    // Set the views for the widgets
    measurement.view = activeView;
    legend.view = activeView;
    }

    // When the 2D or 3D button is activated, the switchView() function is called
    function switchView() {
    // Clone the viewpoint for the MapView or SceneView
    const viewpoint = activeView.viewpoint.clone();
    // Get the view type, either 2d or 3d
    const type = activeView.type;

    // Clear any measurements that had been drawn
    clearMeasurements();

    // Reset the measurement tools in the div
    activeView.container = null;
    activeView = null;
    // Set the view based on whether it switched to 2D MapView or 3D SceneView
    activeView = type.toUpperCase() === "2D" ? sceneView : mapView;
    activeView.set({
        container: "viewDiv",
        viewpoint: viewpoint
    });
    // Add the appropriate measurement UI to the bottom-right when activated
    activeView.ui.add(measurement, "bottom-right");
    // Add the legend to the bottom left
    activeView.ui.add(legend, "bottom-left");

    // Set the views for the widgets
    measurement.view = activeView;
    legend.view = activeView;
    // Reset the value of the 2D or 3D switching button
    switchButton.value = type.toUpperCase();
    }

    // Call the appropriate DistanceMeasurement2D or DirectLineMeasurement3D
    function distanceMeasurement() {
    const type = activeView.type;
    measurement.activeTool = type.toUpperCase() === "2D" ? "distance" : "direct-line";
    distanceButton.classList.add("active");
    areaButton.classList.remove("active");
    }

    // Call the appropriate AreaMeasurement2D or AreaMeasurement3D
    function areaMeasurement() {
    measurement.activeTool = "area";
    distanceButton.classList.remove("active");
    areaButton.classList.add("active");
    }

    // Clears all measurements
    function clearMeasurements() {
    distanceButton.classList.remove("active");
    areaButton.classList.remove("active");
    measurement.clear();
    }

    // function estimatePrice(){
    //   var mapDistance = document.getElementById('convert');
    //   const pricePerMile = 35;
    //   var estimatedPrice = parseFloat(mapDistance) * pricePerMile;
    //   displayEstimation.innerHTML = estimatedPrice;
    // }



});
// var btn = document.getElementById('btn');
var btn = document.getElementById('btn');
var distance = document.getElementById('Distance');
var mile = document.getElementById('mile');
var price = document.getElementById('price');



function showDistance(inputDist){
  var miles = 1.609;
  var costPerMile = 35;
  var calculatedMiles = inputDist / miles;
  var estimatedCost = calculatedMiles * costPerMile;

  mile.innerHTML = 'Distance in miles is: ' + calculatedMiles ;
  price.innerHTML = 'Estimated cost for the  distance: $' + estimatedCost;

}



btn.addEventListener('click', () =>{
  showDistance(distance.value)
})

