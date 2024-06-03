
export class ConnectorError extends Error {

  constructor(connector) {
    super("Can't fetch data.");
    this.connector = connector;
  }

}
