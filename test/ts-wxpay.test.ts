import DummyClass from "../src/ts-wxpays"

/**
 * Dummy test
 */
describe("Dummy test", () => {
  it("works if true is truthy", () => {
  	console.log('测试中')
    expect(true).toBeTruthy()
  })

  it("DummyClass is instantiable", () => {
    expect(new DummyClass()).toBeInstanceOf(DummyClass)
  })
})
