// ons.disableAutoStatusBarFill(); - Disable the status bar margin.
var app = angular.module('app', ['onsen', 'ngAudio','twitter.timeline']);

// tweet Controller
/*
*  AngularJS Directive for Twitter's Embedded Timeline with support for custom CSS.
*  https://github.com/userapp-io/twitter-timeline-angularjs
*/



// Radio Controller
var radio = null;
var isPlaying = false;

app.controller('radioController', function($scope, $sce, ngAudio){
	
	$scope.radioURL = 'http://91.121.165.88:8116/stream'; // http://streams.kqed.org/kqedradio.m3u
	$scope.buttonIcon = '<span class="ion-ios7-play"></span>';

	if (radio!==null) {		
	    $scope.radio = radio;
	    
	    if(isPlaying){
	    	$scope.buttonIcon = '<span class="ion-ios7-pause"></span>';
	    } else {
	    	$scope.buttonIcon = '<span class="ion-ios7-play"></span>';
	    }
	} else {
		
		isPlaying = false;
	    $scope.radio = ngAudio.load($scope.radioURL);
	    radio = $scope.radio;
	}

	$scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.startRadio = function(){

    	if(!isPlaying){
    		// Let's play it
    		isPlaying = true;
			$scope.radio.play();

			$scope.buttonIcon = '<span class="ion-ios7-pause"></span>';
			$scope.isFetching = true;

    	} else {
    		// Let's pause it
    		isPlaying = false;
			$scope.radio.pause();
			$scope.buttonIcon = '<span class="ion-ios7-play"></span>';

    	}

    }

    // Check if is Offline
	document.addEventListener("offline", function(){

		isPlaying = false;
		$scope.radio.stop();
		$scope.buttonIcon = '<span class="ion-ios7-play"></span>';
		$scope.radio = null;
		modal.show();
		setTimeout('modal.hide()', 8000);				

	}, false);

	document.addEventListener("online", function(){
		$scope.radio = ngAudio.load($scope.radioURL);
		radio = $scope.radio;
	});

});

var pad2 = function(number){
	return (number<10 ? '0' : '') + number;
}

app.filter('SecondsToTimeString', function() {
	return function(seconds) {
		var s = parseInt(seconds % 60);
		var m = parseInt((seconds / 60) % 60);
		var h = parseInt(((seconds / 60) / 60) % 60);
		if (seconds > 0) {
			return pad2(h) + ':' + pad2(m) + ':' + pad2(s);
		} else {
			return '00:00:00';
		}
	}
});

// News Controller

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);

app.controller('newsController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

	$scope.yourAPI = 'http://hugeclan.com/api/get_recent_posts/';
	$scope.items = [];
	$scope.totalPages = 0;
	$scope.currentPage = 1;
	$scope.pageNumber = 1;
	$scope.isFetching = true;

	$scope.getAllRecords = function(pageNumber){

		$scope.isFetching = true;

        $http.jsonp($scope.yourAPI+'/?page='+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

			$scope.items = $scope.items.concat(response.posts);
			$scope.totalPages = response.pages;
			$scope.isFetching = false;
			if($scope.currentPage==$scope.totalPages){
				$('.news-page #moreButton').fadeOut('fast');	
			}
    	});
	 
	};

	$scope.showPost = function(index){
			
		$rootScope.postContent = $scope.items[index];
	    $scope.ons.navigator.pushPage('post.html');

	};

	$scope.nextPage = function(){
		
		$scope.pageNumber = ($scope.currentPage + 1);
		if($scope.pageNumber <= $scope.totalPages){
			$scope.getAllRecords($scope.pageNumber);
			$scope.currentPage++;
		}

	}


}]);

app.controller('postController', [ '$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
	
	$scope.item = $rootScope.postContent;

	$scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}]);

/*! 
 * Roots v 2.0.0
 * Follow me @adanarchila at Codecanyon.net
 * URL: http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999
 * Don't forget to rate Roots if you like it! :)
 */

// In this file we are goint to include all the Controllers our app it's going to need

(function(){
  'use strict';
 
  // var app = angular.module('app', ['onsen']);

  // This is where you need to set up the the Ad IDs
  // You need to use different IDs for a banner and also a different ID for an Interstitial
	var ad_units = {
		ios : {
			banner: 'ca-app-pub-9758193265978664/8307345035', // or DFP format "/6253334/dfp_example_ad"
			interstitial: 'ca-app-pub-9758193265978664/8307345035'
		},
		android : {
			banner: 'ca-app-pub-9758193265978664/8307345035', // or DFP format "/6253334/dfp_example_ad"
			interstitial: 'ca-app-pub-9758193265978664/8307345035'
		}
	};

	// select the right Ad Id according to platform
	var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;


  // Banner Ads Controller 
  app.controller('adsController', [ '$scope', '$rootScope', function( $scope, $rootScope){


	  ons.ready(function(){

	  	if (! AdMob ) { console.log( 'admob plugin not ready' ); return; }

	  	if ( AdMob ){
	  		
		  	var defaultOptions = {
		        adSize: 'SMART_BANNER',
		        // width: integer, // valid when set adSize 'CUSTOM'
		        // height: integer, // valid when set adSize 'CUSTOM'
		        position: AdMob.AD_POSITION.BOTTOM_CENTER,
		        // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
		        bgColor: 'black', // color name, or '#RRGGBB'
		        isTesting: true, // set to true, to receiving test ad for testing purpose
		        // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
		    };

		    AdMob.setOptions( defaultOptions );		    

				// Let's create a banner 
				if(AdMob) AdMob.createBanner( {
		    adId:admobid.banner, 
		    position:AdMob.AD_POSITION.BOTTOM_CENTER, 
		    autoShow:true} );

						    
				/*
				// It will create a smart banner in bottom center using the default options
				if(AdMob) AdMob.createBanner( admobid.banner );

				// it will display smart banner at top center
				if(AdMob) AdMob.createBanner( {
				    adId:admobid.banner, 
				    position:AdMob.AD_POSITION.TOP_CENTER, 
				    autoShow:true} );

				// or, show a rect ad at bottom in overlap mode
				if(AdMob) AdMob.createBanner( {
				    adId:admobid.banner, 
				    adSize:'MEDIUM_RECTANGLE', 
				    overlap:true, 
				    position:AdMob.AD_POSITION.BOTTOM_CENTER, 
				    autoShow:true} );

				// or, show any size at any position
				if(AdMob) AdMob.createBanner( {
				    adId:admobid.banner, 
				    adSize:'CUSTOM',  width:200, height:200, 
				    overlap:true, 
				    position:AdMob.AD_POSITION.POS_XY, x:100, y:200, 
				    autoShow:true} );
				*/

		   
		  }

		  // Let's prepare and load ad resource in background, e.g. at begining of app home
			if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );

		}); 	

  }]);

  // Intersitial Ads Controller
  app.controller('interstitialController', [ '$scope', '$rootScope', function( $scope, $rootScope){    

  	// Let's show the intersitial when the user enters to the Interstitial Page
  	// If the ad doesn't appear is because it hasn't been loaded yet
  	if(AdMob) AdMob.showInterstitial();

		$scope.prepareIt = function(){
			
			if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );

		}

		$scope.showAnother = function(){

			if(AdMob) AdMob.showInterstitial();

		}
		

  }]);


})();


