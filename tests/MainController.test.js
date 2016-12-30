describe('MainController test', function() {

    beforeEach(module('Pmp'));

    var MainController,
        scope;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        MainController = $controller('MainController', {
            $scope: scope
        });
    }));

    it('Circle is invisible by default', function () {
        expect(scope.isCircleVisible).toBeFalsy();
    });
    it('Circle radius equal 100 by default', function () {
        expect(scope.circleRadius).toEqual(100);
    });
    it('Get empty array if placemarkCollection undefined', function () {
        expect(scope.getPlacemarks()).toEqual([]);
    });
    it('Can add new placemark', function () {
        scope.placemarkCollection = new ymaps.GeoObjectCollection();
        expect(scope.getPlacemarks()).toEqual([]);
    });
});