angular.module("umbraco").controller('SimpleTreeMenu.DoctypePicker', function ($scope, contentTypeResource) {
    var vm = this;

    vm.items = [];

    contentTypeResource.getAll().then(function (data) {
    
        for (var i = 0; i < data.length; i++) {
            if (data[i].isElement === true)
            {
                vm.items.push(data[i]);
            }
        }

        if (($scope.model.value === "" || $scope.model.value === "undefined") && vm.items.length > 0) {
            $scope.model.value = vm.items[0].alias;
        }
    });


});