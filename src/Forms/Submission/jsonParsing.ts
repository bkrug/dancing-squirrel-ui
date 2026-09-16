function toCamelCase(key: string, value: any) {
  if (value && typeof value === 'object'){
    for (var k in value) {
      if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
        value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
        delete value[k];
      }
    }
  }
  return value;
}

function parseToCamelCase<T extends object>(constructor: { new (): T}, jsonString: string) : T {
  return Object.assign(
    new constructor(),
    JSON.parse(jsonString, toCamelCase)
  );
}

export function parseToCamelCasePlain<T extends object>(jsonString: string) : T {
  return Object.assign(JSON.parse(jsonString, toCamelCase)) as T;
}

export default parseToCamelCase;