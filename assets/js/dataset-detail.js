window.addEventListener("load", () => {
  const modalElement = document.getElementById("modal");

  const openModal = (label) => {
    modalElement.setAttribute("label", label);
    modalElement.setAttribute("open", "true");
  };

  const language = document.documentElement.lang;
  const datasetElement = document.querySelector(".dataset[data-iri]");
  fetchAndRenderDatasetQuality(openModal, language, datasetElement, datasetElement.dataset.iri);

  const distributionElements = document.querySelectorAll(".distribution[data-iri]");
  distributionElements.forEach(element => fetchAndRenderDistributionQuality(openModal, language, element, element.dataset.iri));
});

async function fetchAndRenderDatasetQuality(openModal, language, element, iri) {
  const response = await fetchQuality(language, iri);

  const documentationElement = element.querySelector(".documentation .quality");
  const documentation = response.documentation;
  renderQualityMeasure(openModal, documentationElement, documentation, "link", "link-45deg");

  const specificationElement = element.querySelector(".specification .quality");
  const specification = response.specification;
  renderQualityMeasure(openModal, specificationElement, specification, "link", "link-45deg");
}

function fetchQuality(language, iri) {
  const url = "/api/v2/quality?iri=" + encodeURIComponent(iri) + "&language=" + encodeURIComponent(language);
  return fetch(url).then(response => response.json());
}

function renderQualityMeasure(openModal, element, measure, successIconName, failedIconName) {
  if (element === null || measure === undefined || measure === null) {
    return;
  }
  let icon = measure.value ? createAlrightQualityIcon(successIconName) : createFailedQualityIcon(failedIconName);
  icon.setAttribute("title", measure.message);
  element.appendChild(icon);
  element.addEventListener("click", () => openModal(measure.message));
}

function createAlrightQualityIcon(name) {
  const element = document.createElement("gov-icon");
  element.setAttribute("name", name);
  element.setAttribute("type", "bootstrap")
  element.classList.add("alright");
  return element;
}

function createFailedQualityIcon(name) {
  const element = document.createElement("gov-icon");
  element.setAttribute("name", name);
  element.setAttribute("type", "bootstrap")
  element.classList.add("danger");
  return element;
}

async function fetchAndRenderDistributionQuality(openModal, language, element, iri) {
  const response = await fetchQuality(language, iri);
  renderLegalQuality(openModal, element, response);
  renderShared(openModal, element, response);
  renderDistributionQuality(openModal, element, response);
  renderDataServiceQuality(openModal, element, response);
}

function renderLegalQuality(openModal, element, response) {
  const authorship = response.authorship;
  const authorshipCors = response.authorshipCors;

  const databaseAuthorship = response.databaseAuthorship;
  const databaseAuthorshipCors = response.databaseAuthorshipCors;

  const specialDatabaseAuthorship = response.specialDatabaseAuthorship;
  const specialDatabaseAuthorshipCors = response.specialDatabaseAuthorshipCors;

  console.log("legal", { authorship, authorshipCors, databaseAuthorship, databaseAuthorshipCors, specialDatabaseAuthorship, specialDatabaseAuthorshipCors, })
}

function renderShared(openModal, element, response) {
  const mediaTypeElement = element.querySelector(".mediaType .quality");
  const mediaType = response.mediaType;
  renderQualityMeasure(openModal, mediaTypeElement, mediaType, "award", "bug");
}

function renderDistributionQuality(openModal, element, response) {
  const downloadElement = element.querySelector(".download .quality");
  const download = response.download;
  const downloadCors = response.downloadCors;
  renderQualityMeasure(openModal, downloadElement, download, "award", "bug");
  renderQualityMeasure(openModal, downloadElement, downloadCors, "globe2", "globe2");

  const schemaElement = element.querySelector(".schema .quality");
  const schema = response.schema;
  const schemaCors = response.schemaCors;
  renderQualityMeasure(openModal, schemaElement, schema, "award", "bug");
  renderQualityMeasure(openModal, schemaElement, schemaCors, "globe2", "globe2");
}

function renderDataServiceQuality(openModal, element, response) {
  const endpointDescriptionElement = element.querySelector(".endpointDescription .quality");
  const endpointDescription = response.endpointDescription;
  const endpointDescriptionCors = response.endpointDescriptionCors;
  renderQualityMeasure(openModal, endpointDescriptionElement, endpointDescription, "award", "bug");
  renderQualityMeasure(openModal, endpointDescriptionElement, endpointDescriptionCors, "globe2", "globe2");

  const endpointUrlElement = element.querySelector(".endpointUrl .quality");
  const endpointUrl = response.endpointUrl;
  const endpointUrlCors = response.endpointUrlCors;
  renderQualityMeasure(openModal, endpointUrlElement, endpointUrl, "award", "bug");
  renderQualityMeasure(openModal, endpointUrlElement, endpointUrlCors, "globe2", "globe2");

  const conformsToElement = element.querySelector(".conformsTo .quality");
  const conformsTo = response.conformsTo;
  renderQualityMeasure(openModal, conformsToElement, conformsTo, "award", "bug");
}
