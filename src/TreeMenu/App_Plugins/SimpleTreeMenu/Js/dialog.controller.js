angular.module("umbraco.directives").controller('SimpleTreeMenu.DialogController', function ($scope, $timeout, contentTypeResource, contentResource, notificationsService) {

    var vm = this;

    vm.loadingNode = true;

    vm.save = function () {
        if (!$scope.doctyperender.$valid)
            return;

        var data = saveData($scope.model.node);

        $scope.model.submit(data);

        $scope.model.data = data;
    };

    vm.close = function () {
        $scope.model.close();
    };

    vm.saving = false;

    $scope.$on("formSubmitting", function (ev, args) {

        if (!vm.saving) {

            $scope.model.data = saveData();

            vm.saving = false;
        }
        
    });

    function saveData() {
        vm.saving = true;

        if ($scope.model.node) {
            var value = {};

            $scope.$broadcast('formSubmitting', { scope: $scope });

            for (var t = 0; t < $scope.model.node.variants[0].tabs.length; t++) {

                var tab = $scope.model.node.variants[0].tabs[t];

                for (var p = 0; p < tab.properties.length; p++) {

                    var prop = tab.properties[p];

                    if (typeof prop.value !== "function") {
                        value[prop.alias] = prop.value;
                    }
                }
            }

            return value;
        } else {
            return null;
        }
    }

    function loadData() {
        contentResource.getScaffold(-20, $scope.model.selectedDoctype).then(function (data) {

            vm.edit = true;

            if ($scope.model.data) {
                for (var t = 0; t < data.variants[0].tabs.length; t++) {
                    var tab = data.variants[0].tabs[t];
                    for (var p = 0; p < tab.properties.length; p++) {
                        var prop = tab.properties[p];
                        if ($scope.model.data[prop.alias]) {
                            prop.value = $scope.model.data[prop.alias];
                        }
                    }
                }
            };

            $scope.model.node = data;

            vm.loadingNode = false;
        }, function (error) {
                notificationsService.error("Error loading document type: \"" + $scope.model.selectedDoctype + "\"", error.errorMsg);
        });
    }

    $timeout(function () {

        if (!$scope.model.data)
            $scope.model.data = {};

        if ($scope.model.doctype) {

            $scope.model.selectedDoctype = $scope.model.doctype;

            contentTypeResource.getAll().then(function (data) {
                
                var doctype;

                for (var i = 0; i < data.length; i++) {
                    if (data[i].alias === $scope.model.selectedDoctype)
                    {
                        doctype = data[i];
                        break;
                    }
                }

                if (doctype == undefined) {
                    notificationsService.error("Error loading document type: \"" + $scope.model.selectedDoctype + "\"", "");
                    $scope.model.close();
                } else if (doctype && doctype.isElement === false) {
                    notificationsService.error("Error loading document type: \"" + $scope.model.selectedDoctype + "\"", "\"" + $scope.model.selectedDoctype + "\" is not an element type");
                    $scope.model.close();
                } else {
                    loadData();
                }

                
            });
            
        }
    });


});