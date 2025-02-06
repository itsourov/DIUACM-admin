export function decodeHTMLEntities(str: string): string {
    if (!str) return '';

    const element = document.createElement('div');
    element.innerHTML = str;
    return element.textContent || '';
}