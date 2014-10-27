'use strict';

angular.module('projectxApp').controller('CustomersCtrl', function ($scope, $state, ENV, Session, CustomersService, _) {
  $scope.customer = {};

  CustomersService.createForm($state.params.companyId).then(function(response) {
    $scope.fields = response.data.customer.fields;
    $scope.billingAddressFields = response.data.customer.billing_address.fields;
    $scope.shippingAddressFields = response.data.customer.shipping_address.fields;

    $scope.links = response.data.customer.links;
  });

  $scope.create = function create(){
    CustomersService.submitForm(postPath(), $scope.customer).then(function() {
      $state.go('companies.customers.index', {companyId: $state.params.companyId });
    });
  };

  function postPath() {
    return _.chain($scope.links)
      .filter(function(link) { return link.rel === 'create'; })
      .pluck('href')
      .value();
  }
});