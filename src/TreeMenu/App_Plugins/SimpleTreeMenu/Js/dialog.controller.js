angular.module("umbraco.directives").controller('SimpleTreeMenu.DialogController', function ($scope, $timeout, contentResource) {

    $scope.save = function () {

        if (!$scope.doctyperender.$valid)
            return;

        var data = saveData($scope.model.node);

        $scope.model.submit(data);

        $scope.model.data = data;
    };

    $scope.close = function () {
        $scope.model.close();
    }

    $scope.$on("formSubmitting", function (ev, args) {
        $scope.model.data = saveData();
    });

    function saveData() {
        if ($scope.model.node) {
            var value = {};
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

            $scope.edit = true;

            if ($scope.model.data) {
                for (var t = 0; t < data.variants[0].tabs.length; t++) {
                    var tab = data.variants[0].tabs[t];
                    for (var p = 0; p < tab.properties.length; p++) {
                        var prop = tab.properties[p];

                        prop.view = "views/propertyeditors/".concat(prop.view, "/", prop.view, ".html");

                        if ($scope.model.data[prop.alias]) {
                            prop.value = $scope.model.data[prop.alias];
                        }
                    }
                }
            };

            $scope.model.node = data;
        });
    }

    $timeout(function () {
        if (!$scope.model.data)
            $scope.model.data = {};

        if ($scope.model.doctype) {
            $scope.model.selectedDoctype = $scope.model.doctype;
            loadData();
        }
    });


});