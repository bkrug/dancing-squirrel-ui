import { screen } from '@testing-library/dom';

// Given a bit of text that exists in one element in the document,
// return the element's sibling that comes directly after the element.
export function getSiblingByText(selfContents: RegExp | string) {
  const selfElement = screen.getByText(selfContents);
  const siblings = selfElement.parentElement && selfElement.parentElement.childNodes
    ? Array.from(selfElement.parentElement.childNodes)
    : [];
  const selfIndex = siblings.indexOf(selfElement);
  const siblingIndex = selfIndex >= 0 ? selfIndex + 1 : -1;
  return siblingIndex >= 0 && siblingIndex < siblings.length
    ? siblings[selfIndex + 1]
    : null;
}

export function getInputOrTextArea(labelText: RegExp | string) {
  const labelElement = screen.getByText(labelText);
  const inputElement = labelElement.parentElement?.querySelector('input');
  const textAreaElement = labelElement.parentElement?.querySelector('textarea');
  const coalescedElement = inputElement || textAreaElement;
  return coalescedElement ? coalescedElement : null;
}