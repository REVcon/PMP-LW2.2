describe('MainController test', function () {

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

    describe('Actions with placemarks', function () {

        beforeEach(function () {
            var collectionMock = function () {
                var collection = [];
                this.length = 0;
                this.add = function (item) {
                    collection.push(item);
                    this.length++;
                };
                this.remove = function(item){
                    for (var i = 0; i < this.length; ++i){
                        if (collection[i] = item){
                            collection.splice( i, 1 );
                            this.length--;
                            return;
                        }
                    }
                }
            };
            scope.placemarkCollection = new collectionMock();
        });

        it('Get empty array if placemarkCollection undefined', function () {
            scope.placemarkCollection = undefined;
            expect(scope.getPlacemarks()).toEqual([]);
        });

        it('Can add new placemark', function () {
            expect(scope.placemarkCollection.length).toEqual(0);
            scope.addPlacemark(50, 50, 'name', true);
            expect(scope.placemarkCollection.length).toEqual(1);
        });

        it('Can remove placemark', function () {
            var placemark = scope.addPlacemark(50, 50, 'name', true);
            expect(scope.placemarkCollection.length).toEqual(1);
            scope.removePlacemark(placemark);
            expect(scope.placemarkCollection.length).toEqual(0);
        });
    });
});

var ymaps = {};
ymaps.Placemark = function (coords, data, options) {
    var result = {};
    result.coordinates = coords;
    result.data = data;
    result.options = options;
    return result;
};

