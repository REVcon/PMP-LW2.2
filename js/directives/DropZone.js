angular.module('Pmp').directive("dropzone", function() {
    return {
        restrict : 'E',
        scope: true,
        link: function (scope, elem) {
            elem.on('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            elem.on('dragenter', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

            elem.on('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var file = event.dataTransfer.files[0];
                var fileExtension = file.name.split('.').pop();
                if (fileExtension != "json") {
                    $window.alert("Недопустимый файл");
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (evt) {
                    try {
                        var list = JSON.parse(evt.target.result);
                    } catch (e) {
                        $window.alert("Недопустимый файл");
                    }
                    scope.placemarkCollection.removeAll();
                    for (var i = 0; i < list.length; ++i) {
                        scope.addPlacemark(list[i].coordinates.latitude, list[i].coordinates.longitude, list[i].name, list[i].isVisible);
                    }
                    scope.map.setBounds(scope.placemarkCollection.getBounds());
                };
                reader.readAsText(file);
            });
        }
    }
});