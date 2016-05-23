(function () {
  'use strict';

  angular
    .module('base.ctrl',[])
    .controller('BaseCtrl', ['$rootScope','$scope','$ionicPlatform','$timeout',function ($rootScope,$scope,$ionicPlatform,$timeout) {
      //variables
      var self = this;
      self.canScanCard = false;

      //function declaration
      self.scan = scan;
      self.doRefresh = doRefresh;

      self.cardIOResponseFields = [
        "card_type",
        "redacted_card_number",
        "card_number",
        "expiry_month",
        "expiry_year",
        "cvv",
        "zip"
      ];

      self.fieldName = {
        card_type: 'Card Type',
        redacted_card_number: 'Redacted Card No',
        card_number: 'Card No',
        expiry_month: 'Expiry Month',
        expiry_year: 'Expiry Year',
        cvv: 'cvv',
        zip: 'zip',
      };

      function onCardIOCheck(canScan) {
        if (!canScan) {
          self.canScanCard = false;
          self.labelStatus = 'Not available. Ensure you are using device...';
        }
        else {
          self.canScanCard = true;
          self.labelStatus = 'Can Scan Card Now';
        }
      }

      $ionicPlatform.ready(function(){
        // $timeout(function(){
          if(window.CardIO) {
            CardIO.canScan(onCardIOCheck);
          }
        // });

      });

      function onCardIOComplete(response) {
        console.log("card.io scan complete");
        for (var i = 0, len = self.cardIOResponseFields.length; i < len; i++) {
          var field = self.cardIOResponseFields[i];
          self.data = response;
          console.log(field + ": " + response[field]);
          self.labelStatus = 'CardIO scan is completed';
          $scope.$apply();
        }
      }

      function onCardIOCancel() {
        console.log("card.io scan cancelled");
      }

      function scan() {
        if(self.canScanCard) {
          CardIO.scan({
                "expiry": true,
                "cvv": true,
                "zip": true,
                "suppressManual": false,
                "suppressConfirm": false,
                "hideLogo": true
            },
            onCardIOComplete,
            onCardIOCancel
          );
        }
        else {
          console.log("Cannot Scan Card !!");
        }

      }

      function doRefresh(){
        $scope.$broadcast('scroll.refreshComplete');
        $window.location.reload(true)
      }
  }]);

})();
