export const fuzzyMatch = (str: string, query: string): boolean => {
  if (!query) return true;

  const lowercaseQuery = query.toLowerCase();

  const lowercaseStr = str.toLowerCase();

  // 如果查询包含空格，按空格分割并检查每个部分是否都能匹配
  if (lowercaseQuery.includes(' ')) {
    const queryParts = lowercaseQuery.split(' ').filter((part) => part.length > 0);
    return queryParts.every((part) => lowercaseStr.includes(part));
  }

  // 简单匹配
  return lowercaseStr.includes(lowercaseQuery);
};

export const fuzzySearch = (items: string[], query: string): string[] => {
  if (!query) return items;

  return items.filter((item) => {
    // 简单匹配
    return fuzzyMatch(item, query);
  });
};
