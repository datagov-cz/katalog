
export function registerPagination(templateService, language) {
  templateService.syncAddComponent(
    "pagination", "pagination.html");
}

export function createPaginationData(navigation, query, documentsCount) {
  if (documentsCount < query.pageSize) {
    return { "visible": false };
  }
  const currentPage = query.page + 1;
  const beforePages = [];
  for (let index = 1; index < currentPage; ++index) {
    beforePages.push({
      "label": index,
      "url": navigation.linkFromServer({ ...query, "page": index }),
    });
  }
  const afterPages = [];
  const pageCount = Math.ceil(documentsCount / query.pageSize) + 1;
  for (let index = currentPage + 1; index < pageCount; ++index) {
    afterPages.push({
      "label": index,
      "url": navigation.linkFromServer({ ...query, "page": index }),
    });
  }
  return {
    "visible": true,
    "before": beforePages,
    "active": query.page + 1,
    "after": afterPages,
  }
}
