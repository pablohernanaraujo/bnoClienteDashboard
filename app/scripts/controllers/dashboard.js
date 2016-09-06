'use strict';

angular.module('dashApp')
  .controller('DashboardCtrl', function ( $rootScope, $scope, Authentication, firebase, $firebaseObject, $timeout, $interval ) {

    $scope.userLogout = function(){
  		Authentication.logout();
  	};

    var findClient = function(){
      if($rootScope.clienteUid){
        var cliente = firebase.database().ref('/clientes/' + $rootScope.clienteUid);
        $scope.cliente = $firebaseObject(cliente);

        $interval.cancel(intervalClient);
      }
    };

    var findLugares = function(){
      if($scope.cliente){
        var lugares = firebase.database().ref('/lugares/' + $rootScope.clienteUid)
          .on('value', function(snapshot) {
            var places = snapshot.val();
            $timeout(function(){
              $scope.lugares = places;
            },100);
          });

        $interval.cancel(intervalLugares);
      }
    };

    $scope.$watch('lugares', function (newValue, oldValue, scope) {
      $scope.lugares = newValue;
    });

    var intervalClient = $interval(function(){
      findClient();
    },200);

    var intervalLugares = $interval(function(){
      findLugares();
    },200);

    var actual;
    $scope.editar = function(edi){

      $scope.eNombre = false;
      $scope.eApellido = false;

      if(actual !== edi){
        actual = edi;

        switch(edi)
        {
          case 'eNombre':
            $scope.eNombre = true;
            break;
          case 'eApellido':
            $scope.eApellido = true;
            break;
          default:
            $scope.eNombre = false;
            $scope.eApellido = false;
        }
      }else{
        $scope.eNombre = false;
        $scope.eApellido = false;

        actual = '';
      }
    };

    $scope.crearLugar = function(){
  		Authentication.crearLugar($scope.lugar);
      $scope.lugar = null;
      $scope.myformlugar.$setPristine();
      $scope.myformlugar.$setUntouched();
      $('#lugarLabel').toggleClass('active');
  	};

    $scope.deleteModal = function(abrirCerrar, place){
      $scope.modal = place;
      if(abrirCerrar === 'abrir'){
        $('#modal1').openModal();
      }
      if(abrirCerrar === 'eliminar'){
        firebase.database().ref('/lugares/' + $rootScope.clienteUid).child(place.key).remove();
        Materialize.toast('Eliminado con exito!', 4000, 'green'); 
      }
    };

    $(document).ready(function(){
     $('.collapsible').collapsible({
       accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
     });
     $('.modal-trigger').leanModal();
   });

  });
