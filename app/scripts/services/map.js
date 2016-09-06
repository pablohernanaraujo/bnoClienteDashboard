'use strict';

angular.module('dashApp')
    .service('Map', function($q) {

    this.init = function() {
        var options = {
            center: new google.maps.LatLng(-34.6037389, -58.38157039999999),
            zoom: 14,
            scaleControl: false,
            draggable: false,
            scrollwheel: false,
            disableDefaultUI: true,
            styles:[{'featureType':'all',
                    'elementType':'labels',
                    'stylers':[{'visibility':'on'}]},
                    {'featureType':'all',
                    'elementType':'labels.text.fill',
                    'stylers':[{'saturation':36},
                    {'color':'#000000'},
                    {'lightness':40}]},
                    {'featureType':'all',
                    'elementType':'labels.text.stroke',
                    'stylers':[{'visibility':'on'},
                    {'color':'#000000'},
                    {'lightness':16}]},
                    {'featureType':'all',
                    'elementType':'labels.icon',
                    'stylers':[{'visibility':'off'}]},
                    {'featureType':'administrative',
                    'elementType':'geometry.fill',
                    'stylers':[{'color':'#000000'},
                    {'lightness':20}]},
                    {'featureType':'administrative',
                    'elementType':'geometry.stroke',
                    'stylers':[{'color':'#000000'},
                    {'lightness':17},
                    {'weight':1.2}]},
                    {'featureType':'administrative.country',
                    'elementType':'labels.text.fill',
                    'stylers':[{'color':'#00b5ff'}]},
                    {'featureType':'administrative.locality',
                    'elementType':'labels.text.fill',
                    'stylers':[{'color':'#006991'}]},
                    {'featureType':'administrative.neighborhood',
                    'elementType':'labels.text.fill',
                    'stylers':[{'color':'#006991'}]},
                    {'featureType':'landscape',
                    'elementType':'geometry',
                    'stylers':[{'color':'#000000'},
                    {'lightness':20}]},
                    {'featureType':'poi',
                    'elementType':'geometry',
                    'stylers':[{'color':'#000000'},
                    {'lightness':21},
                    {'visibility':'on'}]},
                    {'featureType':'poi.business',
                    'elementType':'geometry',
                    'stylers':[{'visibility':'on'}]},
                    {'featureType':'road.highway',
                    'elementType':'geometry.fill',
                    'stylers':[{'color':'#00aeef'},
                    {'lightness':0}]},
                    {'featureType':'road.highway',
                    'elementType':'geometry.stroke',
                    'stylers':[{'visibility':'off'}]},
                    {'featureType':'road.highway',
                    'elementType':'labels.text.fill',
                    'stylers':[{'color':'#ffffff'}]},
                    {'featureType':'road.highway',
                    'elementType':'labels.text.stroke',
                    'stylers':[{'color':'#00b5ff'}]},
                    {'featureType':'road.arterial',
                    'elementType':'geometry',
                    'stylers':[{'color':'#000000'},
                    {'lightness':18}]},
                    {'featureType':'road.arterial',
                    'elementType':'geometry.fill',
                    'stylers':[{'color':'#575757'}]},
                    {'featureType':'road.arterial',
                    'elementType':'labels.text.fill',
                    'stylers':[{'color':'#ffffff'}]},
                    {'featureType':'road.arterial',
                    'elementType':'labels.text.stroke',
                    'stylers':[{'color':'#2c2c2c'}]},
                    {'featureType':'road.local',
                    'elementType':'geometry',
                    'stylers':[{'color':'#000000'},
                    {'lightness':16}]},
                    {'featureType':'road.local',
                    'elementType':'labels.text.fill',
                    'stylers':[{'color':'#999999'}]},
                    {'featureType':'transit',
                    'elementType':'geometry',
                    'stylers':[{'color':'#000000'},
                    {'lightness':19}]},
                    {'featureType':'water',
                    'elementType':'geometry',
                    'stylers':[{'color':'#000000'},
                    {'lightness':17}]}]

        };
        this.map = new google.maps.Map(
            document.getElementById('map'), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    };

    this.search = function(str) {
        var d = $q.defer();
        this.places.textSearch({query: str}, function(results, status) {
            if (status === 'OK') {
                d.resolve(results[0]);
            }
            else {d.reject(status);}
        });
        return d.promise;
    };

    this.addMarker = function(res) {
        if(this.marker) {this.marker.setMap(null);}
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP,
            icon: './images/pin3.png'
        });
        this.map.setCenter(res.geometry.location);
    };

});
