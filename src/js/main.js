/*
 * Solo una instancia de mapa es necesaria
 * ¡Y solo tendremos una y solo una!
 */
var map = null;
var directionsDisplay, directionsService;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), { //acá nuestro código nos dara una ubicación del mapaen general
        zoom: 5, //el zoom cambia de acuerdo que tan cerca querramos que se vea nuestro mapa
        center: { lat: -9.1191427, lng: -77.0349046 }, //esta es la ubicacion inicial
        mapTypeControl: false,
        zoomControl: true,
        streetViewControl: false
    });

    //autocompletado de origen
    var origen = document.getElementById("origen");
    var autocompleteOrigen = new google.maps.places.Autocomplete(origen);
    autocompleteOrigen.bindTo('bounds', map);

    //autocompletado de destino
    var destino = document.getElementById("destino");
    var autocompleteDestino = new google.maps.places.Autocomplete(destino);
    autocompleteDestino.bindTo('bounds', map);

    directionsDisplay = new google.maps.DirectionsRenderer( /*{suppressMarkers: true}*/ );
    directionsService = new google.maps.DirectionsService();

    directionsDisplay.setMap(map);
};

var onRutaClick = function() {
    console.log("Click en ruta");
    calculateAndDisplayRoute(directionsService, directionsDisplay);
};

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: document.getElementById('origen').value,
        destination: document.getElementById('destino').value,
        travelMode: 'DRIVING'
    }, (response, status) => {
        console.log("Response : " + JSON.stringify(response) + " STATUS > " + status);
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Falló el cáculo de ruta ' + status);
        }
    });
}

function limpiar() {
    for (let i in markers) {
        markers[i].setMap(null);
    }
    markers.length = 0;

    directionsDisplay.setMap(null);
    directionsDisplay = new google.maps.DirectionsRenderer( /*{suppressMarkers: true}*/ );
    directionsDisplay.setMap(map);
}

function buscar() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
    }
}

var funcionExito = function(posicion) {
    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;

    var miUbicacion = new google.maps.Marker({
        position: { lat: latitud, lng: longitud },
        animation: google.maps.Animation.DROP,
        //draggable:true, //con esto puedo mover mi icono donde yo quiera
        //title:"Drag me!",
        map: map
    });

    markers.push(miUbicacion);

    map.setZoom(17);
    map.setCenter({ lat: latitud, lng: longitud });
}

var funcionError = function(error) {
    alert("Tenemos problemas encontrando tu ubicación");
}