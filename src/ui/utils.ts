export function classNames(object: Record<string, any>): string {
  let classNames: string[] = [];

  for (let key in object) {
    if (object[key]) {
      classNames.push(key);
    }
  }

  return classNames.join(" ");
}
