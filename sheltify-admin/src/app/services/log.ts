export class Log {
  static assertExists<T>(value: T | null | undefined, valueName = 'value'): value is T {
    if (value === null || value === undefined) {
      console.warn(`${valueName} is null or undefined`);
      return false;
    } else {
      return true;
    }
  }
}
