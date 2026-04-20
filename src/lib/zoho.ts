const ORG_ID = '719219457';

export function zohoBooksSearchUrl(productName: string): string {
  const q = encodeURIComponent(productName);
  return `https://books.zoho.com/app/${ORG_ID}#/inventory/items?per_page=200&filter_by=Status.Active&search_text=${q}`;
}
