
export function registerPagination(templateService, language) {
  templateService.syncAddComponent("pagination", "pagination.html");
}

export function createPaginationData(navigation, query, documentsCount) {
  return {
    "visible": documentsCount > query.pageSize,
    "total": documentsCount,
    "pageSize": query.pageSize,
    "currentPage": query.page + 1,
  }
}
