'use strict';

angular
  .module('dashApp')
  .factory('Authentication', function ( $rootScope, firebase, $firebaseObject, $location, $timeout ) {

    var firebaseConfig = {
      apiKey: 'AIzaSyAwP6I2Nfx0G-pb6yp_Jm389xpUW2GjJRc',
      authDomain: 'bno.firebaseapp.com',
      databaseURL: 'https://bno.firebaseio.com',
      storageBucket: 'firebase-bno.appspot.com',
    };

    var firebaseApp = firebase.initializeApp(firebaseConfig);
    var firebaseAuth = firebaseApp.auth();
    var firebaseDb = firebaseApp.database();

    firebaseAuth.onAuthStateChanged(function(user) {
      if (user) {
        $rootScope.navegador = true;
        $rootScope.cargoTodo = true;

        var ref = firebaseDb.ref('/clientes/' + user.uid);
        var cliente = $firebaseObject(ref);
        $rootScope.currentUser = cliente;
        $rootScope.clienteUid = user.uid;

        Materialize.toast('Bienvenido!', 4000);

        $timeout(function() {
          $location.path('/dashboard');
        });
      } else {
        $rootScope.currentUser = '';
        $rootScope.navegador = false;
        $rootScope.cargoTodo = true;

        $timeout(function() {
          $location.path('/');
        });
      }
    });

    var requireAuth = function(){
      var user = firebase.auth().currentUser;

      if (user) {
        // User is signed in.
      } else {
        $location.path('/');
        // No user is signed in.
      }
    };

    return{
      requireAuth: function(){
        return requireAuth();
      },
      login: function(user){
        $rootScope.authLoading = true;
  			firebaseAuth.signInWithEmailAndPassword(
  				user.email,
  				user.password
  			).catch(function(error){
          if(error){
            $rootScope.authLoading = false;
            Materialize.toast( error.message , 4000, 'red lighten-1');
          }else{
            $rootScope.authLoading = false;
          }
  			});
  		},
      logout: function(){
        firebaseAuth.signOut().then(function() {
        }, function(error) {
          Materialize.toast( error.message , 4000, 'red lighten-1');
        });
  		},
      crearLugar: function(lugar){
        $rootScope.authLoading = true;

        var myRef = firebaseDb.ref('lugares/' + $rootScope.clienteUid).push();
        var key = myRef.key;

        var newData={
          nombre: lugar,
          status: 1,
          key: key
        };

         myRef.set(newData);

        $rootScope.authLoading = false;
      },
      register: function(cliente){
        $rootScope.authLoading = true;
        firebaseAuth.createUserWithEmailAndPassword(cliente.email, cliente.password)
          .then(function(regCliente){

            firebaseDb.ref('clientes').child(regCliente.uid).set({
      				regCliente: regCliente.uid,
      				nombre: cliente.nombre,
      				apellido: cliente.apellido,
      				email: cliente.email,
      				status: 1
            });
            $rootScope.authLoading = false;
          })
          .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            Materialize.toast( error.message , 4000, 'red lighten-1');
            $rootScope.authLoading = false;
          });
      }
    };
  });
