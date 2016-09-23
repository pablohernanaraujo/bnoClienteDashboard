'use strict';

angular
  .module('dashApp')
  .factory('Authentication', function ( $rootScope, firebase, $firebaseObject, $location, $timeout ) {

    var firebaseConfig = {
      apiKey: 'AIzaSyBehsFdvvDHW60NGBlF0lAs_OJCZi7eXIY',
      authDomain: 'bno-firebase.firebaseapp.com',
      databaseURL: 'https://bno-firebase.firebaseio.com',
      storageBucket: 'bno-firebase.appspot.com',
      messagingSenderId: '853361409695'
    };

    var firebaseApp = firebase.initializeApp(firebaseConfig);
    var firebaseAuth = firebaseApp.auth();
    var firebaseDb = firebaseApp.database();
    var firebaseST = firebase.storage();

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

        var lugarRef = firebaseDb.ref('lugares/' + $rootScope.clienteUid).push();
        var key = lugarRef.key;

        var newData={
          nombre: lugar,
          status: 1,
          key: key
        };

        lugarRef.set(newData);

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
              date: firebase.database.ServerValue.TIMESTAMP,
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
      },
      subirLogo: function(logo, refLugar){
        var guardarLogo = firebaseST.ref().child('logos/' + logo.name).put(logo);

        guardarLogo.on('state_changed', function(snapshot){
          // Observe state change events such as progress, pause, and resume
          // See below for more detail
        }, function(error) {
          console.log(error);
          Materialize.toast( error.message , 4000, 'red lighten-1');
        }, function() {
          var user = firebase.auth().currentUser;
          var downloadURL = guardarLogo.snapshot.downloadURL;
          refLugar.update({
            logo: {
              url: downloadURL,
              nombre: logo.name,
              size: logo.size
            }
          });

          var logosStorage = firebaseDb.ref('logos/' + user.uid).push({
            logo: {
              url: downloadURL,
              nombre: logo.name,
              size: logo.size
            }
          });

          Materialize.toast( 'Logo guardado exitosamente' , 4000, 'green lighten-1');

        });
      },
      subirImagen: function(imagen, refLugar){
        var guardarImagen = firebaseST.ref().child('imagenes/' + imagen.name).put(imagen);

        guardarImagen.on('state_changed', function(snapshot){
        }, function(error) {
          console.log(error);
          Materialize.toast( error.message , 4000, 'red lighten-1');
        }, function() {
          var user = firebase.auth().currentUser;
          var downloadURL = guardarImagen.snapshot.downloadURL;
          refLugar.update({
            imagen: {
              url: downloadURL,
              nombre: imagen.name,
              size: imagen.size
            }
          });

          var imagenesStorage = firebaseDb.ref('imagenes/' + user.uid).push({
            imagen: {
              url: downloadURL,
              nombre: imagen.name,
              size: imagen.size
            }
          });

          Materialize.toast( 'Imagen guardada exitosamente' , 4000, 'green lighten-1');

        });
      }
    };
  });
