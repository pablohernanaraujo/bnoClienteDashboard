'use strict';

angular.module('dashApp')
  .controller('DashboardDetailsCtrl', function ( $rootScope, $scope, firebase, $firebaseObject, $routeParams, $timeout, Map, Authentication ) {

    var refLugar = firebase.database().ref('/lugares/' + $rootScope.clienteUid + '/' + $routeParams.id);
    $scope.lugar = $firebaseObject(refLugar);

    var actual;
    $scope.editar = function(edi){

      $scope.eNombre = false;
      $scope.eTipo = false;
      $scope.eDireccion = false;
      $scope.eLogo = false;
      $scope.eTextologo = false;
      $scope.eImagen = false;
      $scope.eTextoimagen = false;

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
            $timeout(function(){
              Map.init();
            },100);
            break;
          case 'eLogo':
              $scope.eLogo = true;
              break;
          case 'eTextologo':
              $scope.eTextologo = true;
              break;
          case 'eImagen':
              $scope.eImagen = true;
              break;
          case 'eTextoimagen':
              $scope.eTextoimagen = true;
              break;
          default:
            $scope.eNombre = false;
            $scope.eTipo = false;
            $scope.eDireccion = false;
            $scope.eLogo = false;
            $scope.eTextologo = false;
            $scope.eImagen = false;
            $scope.eTextoimagen = false;
        }
      }else{
        $scope.eNombre = false;
        $scope.eTipo = false;
        $scope.eDireccion = false;
        $scope.eLogo = false;
        $scope.eTextologo = false;
        $scope.eImagen = false;
        $scope.eTextoimagen = false;

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

    $scope.guardarLogo = function(){
      Materialize.toast( 'Guardando logo...' , 4000);
      var file    = document.querySelector('input[type=file]').files[0];
      var reader  = new FileReader();

      if (file) {
        reader.readAsDataURL(file);
        $scope.srcLogo = file;
        Authentication.subirLogo(file, refLugar);
      } else {
        $scope.srcLogo = '';
      }
    };

    $scope.guardarImagen = function(){
      Materialize.toast( 'Guardando imagen...' , 4000);
      var file    = document.getElementById('imagensita').files[0];
      var reader  = new FileReader();

      if (file) {
        reader.readAsDataURL(file);
        $scope.srcImagen = file;
        Authentication.subirImagen(file, refLugar);
      } else {
        $scope.srcImagen = '';
      }
    };

    $scope.dias = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,24,25,26,27,28,29,30,31];
    $scope.meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    $scope.anos = [2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999,1998,1997,1996,1995,1994,1993,1992,1991,1990,1989,1988,1987,1986,1985,1984,1983,1982,1981,1980];

    $(document).ready(function() {
      $('select').material_select();
      $('ul.tabs').tabs();

    });
  });
