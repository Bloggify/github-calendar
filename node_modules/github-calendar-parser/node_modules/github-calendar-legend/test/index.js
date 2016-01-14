const tester = require("tester")
    , legend = require("../lib")
    ;

tester.describe("GitHub Contributions Calendar legend", test => {
    test.should("be an array", () => {
        test.expect(legend).toBeAn(Array);
    });
    test.should("have 5 elements", () => {
        test.expect(legend.length).toEqual(5);
    });
    test.it("check the elements", () => {
        test.expect(legend[0]).toBe("#eee");
        test.expect(legend[1]).toBe("#d6e685");
        test.expect(legend[2]).toBe("#8cc665");
        test.expect(legend[3]).toBe("#44a340");
        test.expect(legend[4]).toBe("#1e6823");
    });
});
