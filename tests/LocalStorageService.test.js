describe('LocalStorageService test', function () {

    beforeEach(module('Pmp'));

    var LocalStorageService,
        scope;

    beforeEach(inject(function (_LocalStorageService_) {
        LocalStorageService = _LocalStorageService_;
    }));

    it('Can save map state', function () {
        expect(LocalStorageService.save([], 5, true)).toBeTruthy();
    });

    it('Can get placemarks', function () {
        expect(LocalStorageService.save([1,3], 5, true)).toBeTruthy();
        expect(LocalStorageService.getPlacemarks()).toEqual([1,3]);
    });

    it('Can get circle visible', function () {
        expect(LocalStorageService.save([1,2], 5, true)).toBeTruthy();
        expect(LocalStorageService.getCircleVisible()).toBeTruthy();
    });
});
