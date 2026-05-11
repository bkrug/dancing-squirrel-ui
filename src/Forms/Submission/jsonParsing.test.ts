import parseToCamelCase from "./jsonParsing";

interface ObjectInBackendFormat {
  ValueA: string;
  ValueB: number;
}

class ObjectInFrontendFormat {
  valueA: string = '';
  valueB: number = 0;
}

test('', () => {
  const jsonString = JSON.stringify({
    ValueA: 'some string',
    ValueB: 128
  } as ObjectInBackendFormat);

  //Act
  const parsedObject = parseToCamelCase(ObjectInFrontendFormat, jsonString);

  //Assert
  expect(parsedObject).toEqual({
    valueA: 'some string',
    valueB: 128
  });
});