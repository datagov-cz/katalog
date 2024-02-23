
export default function createHandlers(templates) {
  return {
    "handlerError": (reply) =>
      handler(reply),
    "handlePathNotFound": (reply) =>
      pathNotFound(reply),
    "handleNotFound": (viewServices, reply) =>
      notFoundHandler(viewServices, reply),
  };
}

function handler(reply) {
  reply.status(500).send();
}

function pathNotFound(reply) {
  reply.status(404).send();
}

function notFoundHandler(viewServices, reply) {
  // TODO We can use services from a view here (navigation and templates).
  reply.status(404).send();
}
