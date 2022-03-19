/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return arr.slice().sort((a, b) => {
    let [first, last] = param == 'asc' ? [a, b] : [b, a];
    return first.localeCompare(last, ['ru', 'en'], { 'usage': 'sort', 'caseFirst': 'upper' });
  });
}
