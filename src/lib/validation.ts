/**
 * Validates an array of links according to new requirements:
 * - Allows 1 empty string in the array
 * - If the string is not empty or if there are more than 1 strings, then validation is performed using regexp
 * - If there is 1 empty string in the array, then links are not sent to the backend
 */
export function validateLinks(links: string[]): { isValid: boolean; shouldSend: boolean } {
  // If the array is empty or contains only empty strings
  if (!links || links.length === 0) {
    return { isValid: true, shouldSend: false };
  }

  // If there is only one empty string in the array
  if (links.length === 1 && links[0].trim() === '') {
    return { isValid: true, shouldSend: false };
  }

  // Check all non-empty strings for URL validity
  const nonEmptyLinks = links.filter((link) => link.trim() !== '');
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

  const isValid = nonEmptyLinks.every((link) => urlRegex.test(link));

  return {
    isValid,
    shouldSend: nonEmptyLinks.length > 0,
  };
}

/**
 * Filters empty strings from the links array
 */
export function filterEmptyLinks(links: string[]): string[] {
  return links.filter((link) => link.trim() !== '');
}
