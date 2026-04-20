const ORG_ID = '719219457';

export const zohoBooksItemsUrl = `https://books.zoho.com/app/${ORG_ID}#/inventory/items?per_page=200&filter_by=Status.Active`;

const ZOHO_BOOKS_APP_SCHEME = 'zohobooks://';

function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export async function openZohoBooksWithName(productName: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(productName);
  } catch {}

  if (isMobile()) {
    window.location.href = ZOHO_BOOKS_APP_SCHEME;
    return;
  }

  window.open(zohoBooksItemsUrl, '_blank', 'noopener,noreferrer');
}
