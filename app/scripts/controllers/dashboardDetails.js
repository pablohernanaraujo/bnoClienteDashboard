'use strict';

angular.module('dashApp')
  .controller('DashboardDetailsCtrl', function ( $rootScope, $scope, firebase, $firebaseObject, $routeParams, $timeout, Map ) {

    var refLugar = firebase.database().ref('/lugares/' + $rootScope.clienteUid + '/' + $routeParams.id);
    $scope.lugar = $firebaseObject(refLugar);

    var actual;
    $scope.editar = function(edi){

      $scope.eNombre = false;
      $scope.eTipo = false;
      $scope.eDireccion = false;

      if(actual !== edi){
        actual = edi;

        switch(edi)
        {
          case 'eNombre':
            $scope.eNombre = true;
            break;
          case 'eTipo':
            $scope.eTipo = true;
            break;
          case 'eDireccion':
            $scope.eDireccion = true;
            break;
          default:
            $scope.eNombre = false;
            $scope.eTipo = false;
            $scope.eDireccion = false;
        }
      }else{
        $scope.eNombre = false;
        $scope.eTipo = false;
        $scope.eDireccion = false;

        actual = '';
      }
    };

    Map.init();

    $scope.direccion = {};

    $scope.search = function() {
      $rootScope.authLoading = true;
      Map.search($scope.buscarDireccion)
        .then(
            function(res) { // success
                $scope.buscarDireccion = null;
                $scope.myformsearch.$setPristine();
                $scope.myformsearch.$setUntouched();
                $('#direccionLabel').toggleClass('active');

                Map.addMarker(res);
                $scope.direccion.direccion = res.name;
                $scope.direccion.latitud = res.geometry.location.lat();
                $scope.direccion.longitud = res.geometry.location.lng();
                $rootScope.authLoading = false;
            },
            function(error) {
                Materialize.toast(error, 4000, 'red lighten-2');
            }
        );
    };

    $scope.guardarDireccion = function(){
      $scope.lugar.direccion = $scope.direccion.direccion;
      $scope.lugar.latitud = $scope.direccion.latitud;
      $scope.lugar.longitud = $scope.direccion.longitud;
      $scope.lugar.$save();
      Materialize.toast('Guardado con exito!', 4000, 'green');
    };

    $scope.music = function(){
      var musicaRef = firebase.database().ref('/lugares/' + $rootScope.clienteUid + '/' + $routeParams.id).child('musicas')
        .push();
      var key = musicaRef.key;

      var newMusica = {
        estilo: $scope.agregarMusica,
        key: key
      };

      musicaRef.set(newMusica);

      $scope.agregarMusica = null;
      $scope.myformmusic.$setPristine();
      $scope.myformmusic.$setUntouched();
      $('#musicLabel').toggleClass('active');
    };

    $scope.eliminarMusica = function(music){
      firebase.database().ref('/lugares/' + $rootScope.clienteUid + '/' + $routeParams.id).child('musicas').child(music.key).remove();
    };

    // $scope.$watch(
    //   'loguito',
    //   function( newValue, oldValue ) {
    //       // $scope.lugar.logo = newValue;
    //       // $scope.lugar.$save();
    //   }
    // );

    $(document).ready(function() {
      $('select').material_select();
      $('ul.tabs').tabs();
    });
  });
