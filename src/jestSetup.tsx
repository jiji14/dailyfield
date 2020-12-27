export function matchMediaSetup(): void {
  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        matches: true,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    };
}
