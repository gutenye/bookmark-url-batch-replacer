import { regTest, regReplace } from './reg';

function arrayHandler(arr: chrome.bookmarks.BookmarkTreeNode[], pattern: string, flags: string[] | string, replacement: string): DataItem[] {
  const data: DataItem[] = [];
  if (arr) {
    arr.forEach(item => {
      if (item.children && item.children.length > 0) {
        data.push(...arrayHandler(item.children, pattern, flags, replacement));
      } else {
        const { id, title } = item;
        if (title && regTest(pattern, flags, title)) {
          data.push({
            key: id,
            name: title,
            source: title,
            result: regReplace(pattern, flags, title, replacement),
          });
        }
      }
    });
  }

  return data;
}

export async function getTree(pattern: string, flags: string[] | string, replacement: string): Promise<DataItem[]> {
  const arr = await chrome.bookmarks.getTree(); //! chrome 90+
  if (arr.length > 0) {
    const treeData = arr[0].children;
    if (treeData) {
      return arrayHandler(treeData, pattern, flags, replacement);
    }
  }
  return [];
}

export async function updateUrl(id: string, newUrl: string) {
  //! chrome 90+
  return await chrome.bookmarks.update(id, {
    title: newUrl,
  });
}
