"use strict";angular.module("dashApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","firebase","ui.materialize","validation.match","ng-file-model"]).run(["$window",function(a){angular.element(document).ready(function(){var a=new Image;a.onload=function(){$(".se-pre-con").fadeOut("slow")},a.onerror=function(){console.error("Cannot load image")},a.src="images/fondoInicio.d57a7eb5.jpg"})}]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/ingresar.html",controller:"IngresarCtrl",controllerAs:"ingresar"}).when("/registrarse",{templateUrl:"views/registrarse.html",controller:"RegistrarseCtrl",controllerAs:"registrarse"}).when("/dashboard",{templateUrl:"views/dashboard.html",controller:"DashboardCtrl",controllerAs:"dashboard",resolve:{currentAuth:["Authentication",function(a){return a.requireAuth()}]}}).when("/dashboard/:id",{templateUrl:"views/dashboardDetails.html",controller:"DashboardDetailsCtrl",controllerAs:"dashboardDetails",resolve:{currentAuth:["Authentication",function(a){return a.requireAuth()}]}}).otherwise({redirectTo:"/"})}]),angular.module("dashApp").controller("IngresarCtrl",["$rootScope","$scope","Authentication",function(a,b,c){a.PAGE="ingresar",b.userLogin=function(){c.login(b.user)}}]),angular.module("dashApp").controller("RegistrarseCtrl",["$rootScope","$scope","Authentication",function(a,b,c){a.PAGE="registrarse",b.userRegister=function(){c.register(b.user)}}]),angular.module("dashApp").controller("DashboardCtrl",["$rootScope","$scope","Authentication","firebase","$firebaseObject","$timeout","$interval",function(a,b,c,d,e,f,g){b.userLogout=function(){c.logout()};var h=function(){if(a.clienteUid){var c=d.database().ref("/clientes/"+a.clienteUid);b.cliente=e(c),g.cancel(k)}},i=function(){if(b.cliente){d.database().ref("/lugares/"+a.clienteUid).on("value",function(a){var c=a.val();f(function(){b.lugares=c},100)});g.cancel(l)}};b.$watch("lugares",function(a,c,d){b.lugares=a});var j,k=g(function(){h()},200),l=g(function(){i()},200);b.editar=function(a){if(b.eNombre=!1,b.eApellido=!1,j!==a)switch(j=a,a){case"eNombre":b.eNombre=!0;break;case"eApellido":b.eApellido=!0;break;default:b.eNombre=!1,b.eApellido=!1}else b.eNombre=!1,b.eApellido=!1,j=""},b.crearLugar=function(){c.crearLugar(b.lugar),b.lugar=null,b.myformlugar.$setPristine(),b.myformlugar.$setUntouched(),$("#lugarLabel").toggleClass("active")},b.deleteModal=function(c,e){b.modal=e,"abrir"===c&&$("#modal1").openModal(),"eliminar"===c&&(d.database().ref("/lugares/"+a.clienteUid).child(e.key).remove(),Materialize.toast("Eliminado con exito!",4e3,"green"))},$(document).ready(function(){$(".collapsible").collapsible({accordion:!1}),$(".modal-trigger").leanModal()})}]),angular.module("dashApp").controller("DashboardDetailsCtrl",["$rootScope","$scope","firebase","$firebaseObject","$routeParams","$timeout","Map",function(a,b,c,d,e,f,g){var h=c.database().ref("/lugares/"+a.clienteUid+"/"+e.id);b.lugar=d(h);var i;b.editar=function(a){if(b.eNombre=!1,b.eTipo=!1,b.eDireccion=!1,i!==a)switch(i=a,a){case"eNombre":b.eNombre=!0;break;case"eTipo":b.eTipo=!0;break;case"eDireccion":b.eDireccion=!0;break;default:b.eNombre=!1,b.eTipo=!1,b.eDireccion=!1}else b.eNombre=!1,b.eTipo=!1,b.eDireccion=!1,i=""},g.init(),b.direccion={},b.search=function(){a.authLoading=!0,g.search(b.buscarDireccion).then(function(c){b.buscarDireccion=null,b.myformsearch.$setPristine(),b.myformsearch.$setUntouched(),$("#direccionLabel").toggleClass("active"),g.addMarker(c),b.direccion.direccion=c.name,b.direccion.latitud=c.geometry.location.lat(),b.direccion.longitud=c.geometry.location.lng(),a.authLoading=!1},function(a){Materialize.toast(a,4e3,"red lighten-2")})},b.guardarDireccion=function(){b.lugar.direccion=b.direccion.direccion,b.lugar.latitud=b.direccion.latitud,b.lugar.longitud=b.direccion.longitud,b.lugar.$save(),Materialize.toast("Guardado con exito!",4e3,"green")},b.music=function(){var d=c.database().ref("/lugares/"+a.clienteUid+"/"+e.id).child("musicas").push(),f=d.key,g={estilo:b.agregarMusica,key:f};d.set(g),b.agregarMusica=null,b.myformmusic.$setPristine(),b.myformmusic.$setUntouched(),$("#musicLabel").toggleClass("active")},b.eliminarMusica=function(b){c.database().ref("/lugares/"+a.clienteUid+"/"+e.id).child("musicas").child(b.key).remove()},$(document).ready(function(){$("select").material_select(),$("ul.tabs").tabs()})}]),angular.module("dashApp").factory("Authentication",["$rootScope","firebase","$firebaseObject","$location","$timeout",function(a,b,c,d,e){var f={apiKey:"AIzaSyAwP6I2Nfx0G-pb6yp_Jm389xpUW2GjJRc",authDomain:"bno.firebaseapp.com",databaseURL:"https://bno.firebaseio.com",storageBucket:"firebase-bno.appspot.com"},g=b.initializeApp(f),h=g.auth(),i=g.database();h.onAuthStateChanged(function(b){if(b){a.navegador=!0,a.cargoTodo=!0;var f=i.ref("/clientes/"+b.uid),g=c(f);a.currentUser=g,a.clienteUid=b.uid,Materialize.toast("Bienvenido!",4e3),e(function(){d.path("/dashboard")})}else a.currentUser="",a.navegador=!1,a.cargoTodo=!0,e(function(){d.path("/")})});var j=function(){var a=b.auth().currentUser;a||d.path("/")};return{requireAuth:function(){return j()},login:function(b){a.authLoading=!0,h.signInWithEmailAndPassword(b.email,b.password)["catch"](function(b){b?(a.authLoading=!1,Materialize.toast(b.message,4e3,"red lighten-1")):a.authLoading=!1})},logout:function(){h.signOut().then(function(){},function(a){Materialize.toast(a.message,4e3,"red lighten-1")})},crearLugar:function(b){a.authLoading=!0;var c=i.ref("lugares/"+a.clienteUid).push(),d=c.key,e={nombre:b,status:1,key:d};c.set(e),a.authLoading=!1},register:function(c){a.authLoading=!0,h.createUserWithEmailAndPassword(c.email,c.password).then(function(d){i.ref("clientes").child(d.uid).set({regCliente:d.uid,nombre:c.nombre,apellido:c.apellido,email:c.email,date:b.database.ServerValue.TIMESTAMP,status:1}),a.authLoading=!1})["catch"](function(b){b.code,b.message;Materialize.toast(b.message,4e3,"red lighten-1"),a.authLoading=!1})}}}]),angular.module("dashApp").service("Map",["$q",function(a){this.init=function(){var a={center:new google.maps.LatLng(-34.6037389,-58.38157039999999),zoom:14,scaleControl:!1,draggable:!1,scrollwheel:!1,disableDefaultUI:!0,styles:[{featureType:"all",elementType:"labels",stylers:[{visibility:"on"}]},{featureType:"all",elementType:"labels.text.fill",stylers:[{saturation:36},{color:"#000000"},{lightness:40}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{visibility:"on"},{color:"#000000"},{lightness:16}]},{featureType:"all",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:17},{weight:1.2}]},{featureType:"administrative.country",elementType:"labels.text.fill",stylers:[{color:"#00b5ff"}]},{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#006991"}]},{featureType:"administrative.neighborhood",elementType:"labels.text.fill",stylers:[{color:"#006991"}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#000000"},{lightness:21},{visibility:"on"}]},{featureType:"poi.business",elementType:"geometry",stylers:[{visibility:"on"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#00aeef"},{lightness:0}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{visibility:"off"}]},{featureType:"road.highway",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"road.highway",elementType:"labels.text.stroke",stylers:[{color:"#00b5ff"}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#000000"},{lightness:18}]},{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#575757"}]},{featureType:"road.arterial",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"road.arterial",elementType:"labels.text.stroke",stylers:[{color:"#2c2c2c"}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#000000"},{lightness:16}]},{featureType:"road.local",elementType:"labels.text.fill",stylers:[{color:"#999999"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#000000"},{lightness:19}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#000000"},{lightness:17}]}]};this.map=new google.maps.Map(document.getElementById("map"),a),this.places=new google.maps.places.PlacesService(this.map)},this.search=function(b){var c=a.defer();return this.places.textSearch({query:b},function(a,b){"OK"===b?c.resolve(a[0]):c.reject(b)}),c.promise},this.addMarker=function(a){this.marker&&this.marker.setMap(null),this.marker=new google.maps.Marker({map:this.map,position:a.geometry.location,animation:google.maps.Animation.DROP,icon:"./images/pin3.3943ec43.png"}),this.map.setCenter(a.geometry.location)}}]),angular.module("dashApp").run(["$templateCache",function(a){a.put("views/dashboard.html",'<div class="row detallesScroll white-text dashboardPadding"> <div class="col s12"> <div class="fakeNav"></div> <h3 style="margin: 25px 0" class="color-principal">Datos personales</h3> <div class="divider"></div> <div class="section" style="position:relative; height:130px"> <a ng-click="editar(\'eNombre\')" class="btn-floating waves-effect waves-light bg-principal" style="position:absolute;right:10px;top:10px"> <i class="material-icons">mode_edit</i> </a> <h5>Nombre</h5> <p class="switchAnimation" ng-show="!eNombre">{{cliente.nombre}}</p> <input class="switchAnimation" style="margin-top:2px" ng-show="eNombre" ng-model="cliente.nombre" ng-change="cliente.$save()" id="nombre" type="text"> </div> <div class="divider"></div> <div class="section" style="position:relative; height:130px"> <a ng-click="editar(\'eApellido\')" class="btn-floating waves-effect waves-light bg-principal" style="position:absolute;right:10px;top:10px"> <i class="material-icons">mode_edit</i> </a> <h5>Apellido</h5> <p class="switchAnimation" ng-show="!eApellido">{{cliente.apellido}}</p> <input class="switchAnimation" style="margin-top:2px" ng-show="eApellido" ng-model="cliente.apellido" ng-change="cliente.$save()" id="apellido" type="text"> </div> <div class="divider"></div> <h3 style="margin: 25px 0" class="color-principal">Crea un nuevo lugar</h3> <form name="myformlugar" ng-submit="crearLugar()"> <div class="input-field"> <i class="material-icons prefix">place</i> <input id="lugar" type="text" ng-model="lugar" required> <label id="lugarLabel" for="lugar">Ingrese el nombre del lugar</label> </div> <button type="submit" class="waves-effect waves-light btn bg-principal" style="width: 100%" ng-disabled="myformlugar.$invalid || authLoading"> crear </button> </form> <h3 style="margin: 25px 0" class="color-principal">Lista de lugares</h3> <p ng-show="!lugares">No tienes ningun lugar creado</p> <div class="divider"></div> <div ng-show="lugares" style="margin-bottom:50px"> <div ng-repeat="place in lugares"> <div class="section" style="position:relative"> <a href="#/dashboard/{{place.key}}" class="btn-floating waves-effect waves-light bg-principal" style="position:absolute;right:10px;top:10px"> <i class="material-icons">mode_edit</i> </a> <a ng-click="deleteModal(\'abrir\', place)" class="btn-floating waves-effect waves-light red modal-trigger" style="position:absolute;right:10px;top:54px"> <i class="material-icons">delete</i> </a> <h5 style="margin-bottom:30px">{{place.nombre}}</h5> </div> <div class="divider"></div> </div> </div> </div> </div> <div id="modal1" class="modal red lighten-1 white-text"> <div class="modal-content"> <h4>Esta seguro que decea eliminar</h4> <h5>{{modal.nombre}}</h5> </div> <div class="divider"></div> <div class="modal-footer red lighten-1"> <a class="modal-action modal-close waves-effect waves-light btn-flat white-text" style="margin-left:5px">Cerrar</a> <a ng-click="deleteModal(\'eliminar\', modal)" class="modal-action modal-close waves-effect waves-red btn-flat white-text">Eliminar</a> </div> </div>'),a.put("views/dashboardDetails.html",'<div class="row"> <div class="col s12 m4"> <div class="fakeNav"></div> <h3 style="margin: 70px 0 25px" class="color-principal">Vista previa</h3> <div class="divider"></div> <div class="row"> <div class="col s12"> <ul class="tabs"> <li class="tab col s3"><a class="active" href="#test1">Lista</a></li> <li class="tab col s3"><a href="#test2">Individual</a></li> </ul> </div> <div id="test1" class="col s12"> <div class="centrarImagen"> <img class="responsive-img" src="images/privadoDisco.7a5d3fca.png"> <div class="lista"> <div class="listaImagen"> <img ng-show="lugar.logo" ng-src="{{lugar.logo.data}}" alt=""> <img ng-show="!lugar.logo" src="./images/logoPredeterminado.1e86e678.jpg" alt=""> </div> </div> </div> </div> <div id="test2" class="col s12"> <dic class="centrarImagen"> <img class="responsive-img" src="images/privadoIndividual.fa94ac0a.png"> </dic> </div> </div> </div> <div class="col s12 m8 white-text detallesScroll"> <div class="fakeNav"></div> <a class="waves-effect waves-light btn bg-principal" style="margin-top: 10px" href="#/dashboard"> <i class="material-icons left">keyboard_arrow_left</i> Volver </a> <h3 style="margin: 25px 0" class="color-principal">Lugar datos</h3> <div class="divider"></div> <div class="section" style="position:relative; height:130px"> <a ng-click="editar(\'eNombre\')" class="btn-floating waves-effect waves-light bg-principal" style="position:absolute;right:10px;top:10px"> <i class="material-icons">mode_edit</i> </a> <h5>Nombre</h5> <p class="switchAnimation" ng-show="!eNombre">{{lugar.nombre}}</p> <input class="switchAnimation" style="margin-top:2px" ng-show="eNombre" ng-model="lugar.nombre" ng-change="lugar.$save()" id="nombre" type="text"> </div> <div class="divider"></div> <div class="section" style="position:relative; height:130px"> <a ng-click="editar(\'eTipo\')" class="btn-floating waves-effect waves-light bg-principal switchAnimation" style="position:absolute;right:10px;top:10px"> <i class="material-icons">mode_edit</i> </a> <h5>Tipo <span>Debe seleccionar un tipo de lugar en editar modo.</span></h5> <p class="switchAnimation" ng-show="!eTipo">{{lugar.tipo}}</p> <div class="switchAnimation" input-field ng-show="eTipo" style="width:100%;margin-top:-12px"> <select ng-change="lugar.$save()" ng-model="lugar.tipo" material-select watch> <option value="" disabled selected>Seleciona una opcion</option> <option value="Disco">Disco</option> <option value="Bar">Bar</option> </select> </div> </div> <div class="divider"></div> <div class="section" style="position:relative; min-height:130px"> <a ng-show="lugar.direccion" ng-click="editar(\'eDireccion\')" class="btn-floating waves-effect waves-light bg-principal" style="position:absolute;right:10px;top:10px"> <i class="material-icons">mode_edit</i> </a> <h5>Dirección <span>Debe ingresar una dirección, la numeración debe ser sin puntos intermedios.</span></h5> <p class="switchAnimation" ng-show="!eDireccion">{{lugar.direccion}}</p> <div class="switchAnimation" ng-show="eDireccion || !lugar.direccion" style="width:100%; position:relative"> <form style="padding:0 20px" name="myformsearch" ng-submit="search()"> <div class="input-field"> <input id="direccion" type="text" ng-model="buscarDireccion" required> <label id="direccionLabel" for="direccion">Ejemplo: Av Rivadavia 2356</label> <button type="submit" class="waves-effect waves-light btn bg-principal" style="width:100%;margin-bottom:20px" ng-disabled="myformsearch.$invalid || authLoading"> Buscar </button> </div> </form> <div id="map"></div> <p style="margin: 15px 0;font-size:18px">Si la dirección es correcta, guardela.</p> <a class="waves-effect waves-light btn bg-principal" style="width:100%;margin-bottom:20px" ng-click="guardarDireccion()"> Guardar </a> </div> </div> <div class="divider"></div> <div class="section" style="position:relative; min-height:130px"> <h5>Estilo de música</h5> <form style="padding:0 20px" name="myformmusic" ng-submit="music()"> <div class="input-field"> <input id="music" type="text" ng-model="agregarMusica" autocomplete="off" required> <label id="musicLabel" for="music">Ejemplo: Dance</label> <button type="submit" class="waves-effect waves-light btn bg-principal" style="width:100%;margin-bottom:20px" ng-disabled="myformmusic.$invalid || authLoading"> Agregar </button> </div> </form> <div style="width:100%;padding:0 80px"> <ul class="collection" ng-show="lugar.musicas"> <li class="collection-item grey darken-4" ng-repeat="music in lugar.musicas">{{music.estilo}} <a ng-click="eliminarMusica(music)" class="btn-floating btn waves-effect waves-light red right" style="margin-top:-7px"> <i class="material-icons">delete</i> </a> </li> </ul> </div> </div> <div class="divider"></div> <div class="section" style="position:relative; min-height:130px"> <h5>Logo</h5> <h6>Nombre</h6><p>{{lugar.logo.name}}</p> <div class="file-field input-field"> <div class="btn bg-principal"> <span>File</span> <input type="file" ng-file-model="loguito"> </div> <div class="file-path-wrapper"> <input class="file-path" type="text"> </div> </div> </div> <div class="divider"></div> </div> </div>'),a.put("views/ingresar.html",'<div class="bg"> <div class="container white-text"> <div class="row"> <form name="myformlogin" ng-submit="userLogin()" class="col m6 s12 offset-m6" style="margin-top:200px"> <h4 class="center-align">Ingrese sus datos</h4> <div class="input-field"> <input id="email" type="email" ng-model="user.email" required> <label for="email">Email</label> </div> <div class="input-field"> <input id="password" type="password" ng-model="user.password" required> <label for="password">Password</label> </div> <button type="submit" class="waves-effect waves-light btn bg-principal" style="width:100%" ng-disabled="myformlogin.$invalid || authLoading"> Ingresar </button> </form> </div> </div> </div>'),a.put("views/registrarse.html",'<div class="bg"> <div class="container white-text"> <div class="row"> <form name="myformregister" ng-submit="userRegister()" class="col m6 s12 offset-m6" style="margin-top:200px"> <h4 class="center-align">Registrarse</h4> <div class="input-field"> <input id="nombre" type="text" ng-model="user.nombre" required> <label for="nombre">Nombre</label> </div> <div class="input-field"> <input id="apellido" type="text" ng-model="user.apellido" required> <label for="apellido">Apellido</label> </div> <div class="input-field"> <input id="email" type="email" ng-model="user.email" required> <label for="email">Email</label> </div> <div class="input-field"> <input id="password" type="password" ng-model="user.password" required> <label for="password">Password</label> </div> <div class="input-field"> <input id="passwordConfirm" name="passwordConfirm" type="password" ng-model="passwordConfirm" match="user.password" match-ignore-empty="true" required> <label for="passwordConfirm">Confirmar contraseña</label> </div> <div class="match" ng-show="myformregister.passwordConfirm.$error.match">Contraseña no concuerda!</div> <button type="submit" class="waves-effect waves-light btn bg-principal" style="width:100%" ng-disabled="myformregister.$invalid || authLoading"> Ingresar </button> </form> </div> </div> </div>')}]);