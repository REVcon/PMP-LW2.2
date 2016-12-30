angular.module('Pmp').factory('LocalStorageService', function () {
    return {
        save: function (placemarks, circleRadius, isCircleVisible) {
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