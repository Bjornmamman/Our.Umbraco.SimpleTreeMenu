angular.module("umbraco").controller('SimpleTreeMenu.DoctypePicker', function ($scope, contentTypeResource, elementTypeResource) {
    var vm = this;

    vm.items = [];
    vm.loaded = false;

    if (elementTypeResource) {
        elementTypeResource.getAll().then(function (data) {
            vm.items = data;

            if (!data || data.length == 0) {
                loadWithLegazy();
            }

            if (($scope.model.value === "" || $scope.model.value === "undefined") && vm.items.length > 0) {
                $scope.model.value = vm.items[0].alias;
            }

            vm.loaded = true;
        });

    } else {
        loadWithLegazy();
    }

    var loadWithLegazy = function () {
        //Fallback to old method when 
        contentTypeResource.getAll().then(function (data) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].isElement === true) {
                    vm.items.push(data[i]);
                }
            }

            if (($scope.model.value === "" || $scope.model.value === "undefined") && vm.items.length > 0) {
                $scope.model.value = vm.items[0].alias;
            }

            vm.loaded = true;
        });
    }


});