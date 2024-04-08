
export function createFacetService(labelService) {
  return {
    /**
     * Make sure active are part of result, add labels, and sort.
     * @param {String[]} languages Language preferences.
     * @param {Object[]} items Items.
     * @param {String[]} active IRIs of active facets.
     * @param {Number} limit Number of facets to prepare.
     * @param {} labelCallback
     * @returns {}
     */
    "updateFacetInPlace": (languages, items, active, limit, labelCallback = null) =>
      updateFacetInPlace(labelService, languages, items, active, limit, labelCallback),
  }
}

async function updateFacetInPlace(
  labelService, languages, items, active, limit, labelCallback
) {
  addActivityAndActive(items, active);
  if (labelCallback == null) {
    await labelService.addLabelToResources(languages, items);
  } else {
    items.forEach(labelCallback);
  }
  items.sort(createCompareFacetItems(languages[0]));
  if (limit !== -1 && limit < items.length) {
    items.length = limit;
  }
}

function addActivityAndActive(items, active) {
  const missingActive = new Set(active);
  for (const item of items) {
    const iri = item["iri"];
    // Return true, when removed, i.e. active.
    item["active"] = missingActive.delete(iri);
  }
  for (const iri of missingActive) {
    items.push({
      "iri": iri,
      "count": 0,
      "active": true,
    })
  }
}

function createCompareFacetItems(language) {
  return (left, right) => {
    // If returns < 0 then left comes before right.
    if (left.active && !right.active) {
      return -1;
    }
    if (!left.active && right.active) {
      return 1;
    }
    const count = left.count - right.count;
    if (count === 0) {
      return left.label.localeCompare(right.label, language);
    }
    return count;
  };
}
