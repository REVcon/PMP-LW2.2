angular.module('Pmp').controller('MainController', ['$scope', '$window', 'LocalStorageService',
    function ($scope, $window, LocalStorageService) {
        $scope.isCircleVisible = false;
        $scope.circleRadius = 100;

        $scope.handlePlacemarkEdit = function (placemark) {
            placemark.properties.set('balloonContent', placemark.name);
        };

        $scope.removePlacemark = function (placemark) {
            $scope.placemarkCollection.remove(placemark);
        };

        $scope.getPlacemarks = function () {
            if (!$scope.placemarkCollection) {
                return [];
            }
            var result = $scope.placemarkCollection.toArray();
            result.forEach(function (placemark) {
                placemark.name = placemark.properties.get('balloonContent');
                placemark.isVisible = placemark.options.get('visible');
            });
            return result;
        };

        $scope.changePlacemarkVisible = function (placemark) {
            var isVisible = placemark.options.get('visible');
            placemark.options.set('visible', !isVisible);
        };

        $scope.getCurrentPosition = function () {
            ymaps.geolocation.get({
                provider: 'yandex',
                mapStateAutoApply: true
            }).then(function (result) {
                var coords = result.geoObjects.position;
                if (isPlacemarkNotExist(coords[0], coords[1])) {
                    var name = "Мое местоположение";
                    $scope.addPlacemark(coords[1], coords[0], name, true);
                    $scope.map.setBounds($scope.placemarkCollection.getBounds());
                }
            });
        };

        $scope.showInRadius = function () {
            $scope.map.geoObjects.removeAll();
            $scope.map.geoObjects.add($scope.placemarkCollection);
            $scope.isCircleVisible = true;
            ymaps.geolocation.get({
                provider: 'yandex',
                mapStateAutoApply: true
            }).then(function (result) {
                var coords = result.geoObjects.position;
                var circle = new ymaps.Circle([[coords[0], coords[1]], $scope.circleRadius], null, null);
                $scope.map.geoObjects.add(circle);
                var geoQuery = ymaps.geoQuery($scope.placemarkCollection);
                var objectsInsideCircle = geoQuery.searchInside(circle);
                for (var i = 0; i < $scope.placemarkCollection.getLength(); ++i) {
                    $scope.placemarkCollection.get(i).options.set('visible', false);
                    var basicCoords = $scope.placemarkCollection.get(i).geometry.getCoordinates();
                    for (var j = 0; j < objectsInsideCircle.getLength(); ++j) {
                        var insideCoords = objectsInsideCircle.get(j).geometry.getCoordinates();
                        if (insideCoords[0] == basicCoords[0] && insideCoords[1] == basicCoords[1]) {
                            $scope.placemarkCollection.get(i).options.set('visible', true);
                            break;
                        }
                    }
                }
                $scope.$apply();
            });
        };

        $scope.showAll = function () {
            $scope.map.geoObjects.removeAll();
            $scope.map.geoObjects.add($scope.placemarkCollection);
            $scope.isCircleVisible = false;
            $scope.placemarkCollection.toArray().forEach(function (placemark) {
                placemark.options.set('visible', true);
            });
        };

        showCircle = function () {
            $scope.map.geoObjects.removeAll();
            $scope.map.geoObjects.add($scope.placemarkCollection);
            $scope.isCircleVisible = true;
            ymaps.geolocation.get({
                provider: 'yandex',
                mapStateAutoApply: true
            }).then(function (result) {
                var coords = result.geoObjects.position;
                circle = new ymaps.Circle([[coords[0], coords[1]], $scope.circleRadius], null, null);
                $scope.map.geoObjects.add(circle);
            });
            $scope.$apply();
        };

        isPlacemarkNotExist = function (latitude, longitude) {
            for (var i = 0; i < $scope.placemarkCollection.getLength(); i++) {
                var coords = $scope.placemarkCollection.get(i).geometry.getCoordinates();
                if (coords[0] == latitude && coords[1] == longitude) {
                    return false;
                }
            }
            return true;
        };

        $scope.afterMapInit = function (yaMap) {
            $scope.map = yaMap;
            $scope.placemarkCollection = new ymaps.GeoObjectCollection();
            $scope.map.geoObjects.add($scope.placemarkCollection);
            $scope.map.events.add("click", function (e) {
                var coords = e.get('coords');
                ymaps.geocode(coords).then(function (res) {
                    var name = res.geoObjects.get(0).properties.get('name');
                    if (isPlacemarkNotExist(coords[0], coords[1])) {
                        $scope.addPlacemark(coords[1], coords[0], name, true);
                    }
                });
            });
            var placemarks = LocalStorageService.getPlacemarks();
            var circleRadius = LocalStorageService.getCircleRadius();
            var isCircleVisible = LocalStorageService.getCircleVisible();
            if (placemarks) {
                for (var i = 0; i < placemarks.length; ++i) {
                    $scope.addPlacemark(placemarks[i].coordinates.latitude, placemarks[i].coordinates.longitude, placemarks[i].name, placemarks[i].isVisible);
                }
                $scope.map.setBounds($scope.placemarkCollection.getBounds());
            }
            if (circleRadius) {
                $scope.circleRadius = circleRadius;
            }

            if (isCircleVisible != undefined) {
                $scope.isCircleVisible = isCircleVisible;
                if ($scope.isCircleVisible) {
                    showCircle();
                }
            }
        };

        $scope.addPlacemark = function (latitude, longitude, name, isVisible) {
            var coords = [longitude, latitude];
            var data = {
                balloonContent: name
            };
            var options = {
                balloonHasCloseButton: true,
                visible: isVisible
            };
            var placemark = new ymaps.Placemark(coords, data, options);
            $scope.placemarkCollection.add(placemark);
            $scope.$apply();
            return placemark;
        };

        collectionToArray = function(collection){
            var placemarks = [];
            for (var i = 0; i < placemarkCollection.getLength(); ++i) {
                var placemark = {};
                placemark.name = placemarkCollection.get(i).properties.get('balloonContent');
                var coords = placemarkCollection.get(i).geometry.getCoordinates();
                placemark.coordinates = {};
                placemark.coordinates.latitude = coords[1];
                placemark.coordinates.longitude = coords[0];
                placemark.isVisible = placemarkCollection.get(i).options.get('visible');
                placemarks.push(placemark);
            }
            return placemarks;
        };

        saveToLocalStorage = function () {
            LocalStorageService.save(collectionToArray($scope.placemarkCollection), $scope.circleRadius, $scope.isCircleVisible);
        };

        $window.addEventListener('beforeunload', saveToLocalStorage);
    }]);