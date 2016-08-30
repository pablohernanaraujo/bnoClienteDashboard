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

        $timeout(function(){
          var lugares = firebase.database().ref('/lugares/' + $rootScope.clienteUid)
            .on('value', function(snapshot) {
              var places = snapshot.val();
              if(places !== null){
                $scope.lugares = places;
              }else{
                $scope.lugares = false;
              }
            });
        },10);

        $interval.cancel(intervalClient);
      }
    };

    var intervalClient = $interval(function(){
      findClient();
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

    $(document).ready(function(){
     $('.collapsible').collapsible({
       accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
     });
   });

  });
