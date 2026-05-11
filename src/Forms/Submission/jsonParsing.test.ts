import parseToCamelCase from "./jsonParsing";

interface ObjectInBackendFormat {
  ValueA: string;
  ValueB: number;
}

class ObjectInFrontendFormat {
  valueA: string = '';
  valueB: number = 0;
}

test('Expect JSON object that has capital letters at beginning of property names to have lowercase letters at beginning of property names.', () => {
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

test('Expect deserialized JSON object to retain lowercase letters at beginning of property names.', () => {
  const jsonString = JSON.stringify({
    valueA: 'some string',
    valueB: 128
  } as ObjectInFrontendFormat);

  //Act
  const parsedObject = parseToCamelCase(ObjectInFrontendFormat, jsonString);

  //Assert
  expect(parsedObject).toEqual({
    valueA: 'some string',
    valueB: 128
  });
});