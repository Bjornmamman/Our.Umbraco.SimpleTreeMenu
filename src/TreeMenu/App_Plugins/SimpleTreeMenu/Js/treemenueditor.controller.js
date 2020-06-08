angular.module("umbraco").controller('SimpleTreeMenu.EditorController', function ($scope, $interpolate, notificationsService, localizationService, overlayService, editorService) {

    var doctype = $scope.model.config.doctype;
    
    var vm = this;

    vm.inited = false;

    if (typeof $scope.model.value == "string" || typeof $scope.model.value == "undefined")
        $scope.model.value = {};

    if (!$scope.model.value.items)
        $scope.model.value.items = [];

    $scope.treeOptions = {
        dropped: function (e) {
            setLevels();
        },
        
        dragStart: function (event) {
            vm.setDirty();
        }
    };


    try {
        vm.nameExp = !!$scope.model.config.nameTemplate
            ? $interpolate($scope.model.config.nameTemplate)
            : undefined;
    } catch (error) {
        notificationsService.error("Simple Tree Menu error", error);
    }

   

    $scope.items = $.extend(true, [], $scope.model.value.items);


    function init() {
        setLevels();

        vm.inited = true;
    }

    


    var cleanItem = function() {
        return {
            "id": vm.nextId(),
            "key": String.CreateGuid(),
            "contentTypeAlias": doctype,
            "name": ""
        }
    }

    var setLevels = function() {
        (function (list, depth) {
            var meth = arguments.callee;
            for (var i = 0; i < list.length; i++) {
                list[i].level = depth;
                if (list[i].items && list[i].items.length > 0) meth(list[i].items, depth + 1);
            }
        })($scope.items, 0);
    }

    vm.getName = function (node, index) {
        if (!vm.nameExp)
            return node.name || "Item " + node.id;

        var newName = "";

        try {
            if (node.properties) {
                var props = node.properties;

                props["$id"] = node.id;
                props["$key"] = node.key;
                props["$type"] = node.contentTypeAlias;
                props["$level"] = node.level;
                props["$index"] = index;

                newName = vm.nameExp(props);

                delete props["$id"];
                delete props["$key"];
                delete props["$type"];
                delete props["$level"];
                delete props["$index"];
            }
        } catch (error) {
        }

        
        

        if (!newName || newName.length === 0)
            newName = "Item " + node.id;

        node.name = newName;

        return newName;
    }

    vm.openEditor = function (node) {

        vm.setDirty();

        node.selected = true;

        editorService.closeAll();

        editorService.open({
            view: '/app_plugins/SimpleTreeMenu/Views/dialog.html',
            show: true,
            doctype: doctype,
            size: 'small',
            data: node.properties,
            submit: function (data) {

                node.properties = data;
                node.selected = false;

                editorService.close();
            },
            close: function () {
                editorService.close();
                node.selected = false;

                if (node.properties == undefined)
                    vm.deleteNode(node);
            }
        });
    }

    vm.addNode = function (node) {

        var newNode = cleanItem();

        if (node) {
            if (!node.items)
                node.items = [];

            newNode.level = node.level + 1;
            node.items.push(newNode);
            vm.openEditor(node.items[node.items.length - 1]);

        } else {
            newNode.level = 0;
            $scope.items.push(newNode);
            vm.openEditor($scope.items[$scope.items.length - 1]);
        }

        vm.setDirty();
    }

    vm.requestDeleteNode = function (node) {
        localizationService.localizeMany(["content_nestedContentDeleteItem", "general_delete", "general_cancel", "contentTypeEditor_yesDelete"]).then(function (data) {
            const overlay = {
                title: data[1],
                content: data[0],
                closeButtonLabel: data[2],
                submitButtonLabel: data[3],
                submitButtonStyle: "danger",
                close: function () {
                    overlayService.close();
                },
                submit: function () {
                    vm.deleteNode(node);
                    overlayService.close();
                }
            };

            overlayService.open(overlay);
        });
    }

    vm.setDirty = function () {
        if ($scope.propertyForm) {
            $scope.propertyForm.$setDirty();
        }
    };

    vm.deleteNode = function (node) {
        var item;
        (function (list) {
            var meth = arguments.callee;
            for (var i = 0; i < list.length; i++) {
                if (item) return;
                if (list[i].key == node.key) { item = list[i]; list.splice(i, 1); return; }
                if (list[i].items && list[i].items.length > 0) meth(list[i].items);
            }
        })($scope.items);

        if (item) {
            vm.setDirty();

            delete item;

            return true;
        }

        return false;
        
    }

    vm.toggle = function (node) {
        //node.collapsed = node.collapsed == undefined ? false : !node.collapsed;
    }

    vm.nextId = function () {
        var id = 0;
        (function (list) {
            var meth = arguments.callee;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id > id) { id = list[i].id; }
                if (list[i].items && list[i].items.length > 0) meth(list[i].items);
            }
        })($scope.items);

        return id + 1;
    }

    vm.findNode = function (key) {
        var item;

        (function (list) {
            var meth = arguments.callee;
            for (var i = 0; i < list.length; i++) {
                if (item) return;
                if (list[i].key == key) { item = list[i]; return; }
                if (list[i].items && list[i].items.length > 0) meth(list[i].items);
            }
        })($scope.items);

        return item;
    }

    vm.findParentList = function (key) {
        var items;

        (function (list) {
            var meth = arguments.callee;
            for (var i = 0; i < list.length; i++) {
                if (items) return;
                if (list[i].key == key) { items = list; return; }
                if (list[i].items && list[i].items.length > 0) meth(list[i].items);
            }
        })($scope.items);

        return items;
    }

    vm.duplicate = function (item) {
        var items = vm.findParentList(item.key);
        var clone = $.extend(true, {}, item);

        clone.$$hashKey = undefined;
        clone.id = vm.nextId();
        clone.key = String.CreateGuid();

        var id = clone.id;

        if (clone.items && clone.items.length > 0) {
            (function (list) {
                var meth = arguments.callee;
                for (var i = 0; i < list.length; i++) {

                    list[i].$$hashKey = undefined;
                    list[i].id = vm.nextId();
                    list[i].key = String.CreateGuid();

                    if (list[i].items && list[i].items.length > 0) meth(list[i].items);
                }
            })(clone.items);
        }

        

        

        items.push(clone);

        vm.setDirty();
    }



    $scope.$on("formSubmitting", function (ev, args) {

        var clone = $.extend(true, [], $scope.items);

        $scope.model.value.items = clone;

    });

    init();
});