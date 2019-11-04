import isFunction from "../isFunction";

describe("isFunction", () => {
   it("returns true when argument is an anonymous function", () => {
       const result = isFunction(function(){})
       expect(result).toEqual(true);
   });

   it("returns true when argument is an anonymous arrow function", () => {
       const result = isFunction(()=>{});
       expect(result).toEqual(true)
   });

   it("returns true when argument is a named function", () => {
       const result = isFunction(function named(){});
       expect(result).toEqual(true);
   });

   it("returns true when argument is a stored arrow function", () => {
       const func = () => {};
       const result = isFunction(func);
       expect(result).toEqual(true);
   });

   it("returns true when argument is a stored named function", () => {
       function named(){}
       const result = isFunction(named);
       expect(result).toEqual(true);
   });

   it("returns false when argument is a generator", () => {
       function* generator(){yield undefined;}
       const result = isFunction(generator);
       expect(result).toEqual(false);
   });

    it("returns false when argument is undefined", () => {
        const result = isFunction(undefined);
        expect(result).toEqual(false);
    });

    it("returns false when argument is false", () => {
        const result = isFunction(false);
        expect(result).toEqual(false);
    });

    it("returns false when argument is true", () => {
        const result = isFunction(true);
        expect(result).toEqual(false);
    });

    it("returns false when argument is an empty string ", () => {
        const result = isFunction("");
        expect(result).toEqual(false);
    });

    it("returns false when argument is a string", () => {
        const result = isFunction("string");
        expect(result).toEqual(false);
    });

    it("returns false when argument is 0", () => {
        const result = isFunction(0);
        expect(result).toEqual(false);
    });

    it("returns false when argument is NaN", () => {
        const result = isFunction(NaN);
        expect(result).toEqual(false);
    });

    it("returns false when argument is a number", () => {
        const result = isFunction(100);
        expect(result).toEqual(false);
    });

    it("returns false when argument is an error", () => {
        const result = isFunction(Error());
        expect(result).toEqual(false);
    });

    it("returns false when argument is an empty array", () => {
        const result = isFunction([]);
        expect(result).toEqual(false);
    });

    it("returns false when argument is an array", () => {
        const result = isFunction([1, 2, 3]);
        expect(result).toEqual(false);
    });

    it("returns false when argument is an empty object", () => {
        const result = isFunction({});
        expect(result).toEqual(false);
    });

    it("returns false when argument is non-empty object", () => {
        const result = isFunction({prop1: 1, prop2: 2});
        expect(result).toEqual(false);
    });
});