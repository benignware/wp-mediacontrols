export function getCommonAncestor(...elements) {
  const reducer = (prev, current) => current.parentElement.contains(prev) ? current.parentElement : prev;
  return elements.reduce(reducer, elements[0]);
}