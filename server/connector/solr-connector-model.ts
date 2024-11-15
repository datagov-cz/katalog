export interface SolrResponse {
  responseHeader: {
    status: number;
  };
}

function isSolrResponse(what: any): what is SolrResponse {
  const status = what?.responseHeader?.status;
  if (status === 0) {
    return true;
  }
  return false;
}

export interface SuccessSolrResponse<T> extends SolrResponse {
  response: {
    numFound: number;

    start: number;

    docs: T[];
  };
}

export function isSuccessSolrResponse<T>(
  what: SolrResponse,
): what is SuccessSolrResponse<T> {
  return what.responseHeader.status === 0;
}

export interface FacetedSolrResponse<T> extends SuccessSolrResponse<T> {
  facet_counts: {
    facet_fields: Record<string, []>;
  };
}

export function isFacetedSolrResponse<T>(
  what: any,
): what is FacetedSolrResponse<T> {
  if (!isSolrResponse(what)) {
    return false;
  }
  return (what as any)?.facet_counts?.facet_fields !== undefined;
}

export interface ErrorSolrResponse extends SolrResponse {
  error: {
    msg: string;
  };
}

export function isErrorSolrResponse(
  what: SolrResponse,
): what is ErrorSolrResponse {
  return what.responseHeader.status !== 0;
}
