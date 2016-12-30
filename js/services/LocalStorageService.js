angular.module('Pmp').factory('LocalStorageService', function () {
    return {
        save: function (placemarkCollection, circleRadius, isCircleVisible) {
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
            localStorage.setItem('placemarks', JSON.stringify(placemarks));
            localStorage.setItem('circleRadius', JSON.stringify(circleRadius));
            localStorage.setItem('isCircleVisible', JSON.stringify(isCircleVisible));
            return true;
        },

        getPlacemarks: function () {
            return JSON.parse(localStorage.getItem('placemarks'));
        },

        getCircleRadius: function () {
            return JSON.parse(localStorage.getItem('circleRadius'));
        },

        getCircleVisible: function () {
            return JSON.parse(localStorage.getItem('isCircleVisible'))
        }
    };
});