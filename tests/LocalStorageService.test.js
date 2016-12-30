describe('LocalStorageService test', function () {

    beforeEach(module('Pmp'));
    beforeEach(module('yaMap'));

    var LocalStorageService,
        scope;

    beforeEach(inject(function (_LocalStorageService_) {
        LocalStorageService = _LocalStorageService_;
        spyOn(placemarkCollection, 'getLength').and.callFake(function() {
            return 0;
        });
    }));

    it('Can save map state', function () {
        expect(LocalStorageService.save([], 5, true)).toBeTruthy();
    });
});
