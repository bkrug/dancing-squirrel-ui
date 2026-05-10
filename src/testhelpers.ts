import { screen } from '@testing-library/dom';

// Given a big of text that exists in one element in the document,
// return the element's sibling that comes directly after the element.
export function getSiblingByText(selfContents: RegExp | string) {
  const linkElement = screen.getByText(selfContents);
  const siblings = linkElement.parentElement && linkElement.parentElement.childNodes
    ? Array.from(linkElement.parentElement.childNodes)
    : [];
  const selfIndex = siblings.indexOf(linkElement);
  const siblingIndex = selfIndex >= 0 ? selfIndex + 1 : -1;
  return siblingIndex >= 0 && siblingIndex < siblings.length
    ? siblings[selfIndex + 1]
    : null;
}
