# Komponenta národního katalogu otevřených dat pro registrované aplikace 

## Konfigurace
Konfiguraci je možné provést skrze proměnné prostředí, nebo soubor `.env` umístěný v `/opt/application-catalog/`;

K dispozici jsou následující proměnné:
- `NODE_ENV` - `production` nebo `development`. Výchozí hodnota je `production`.
- `PORT` - Port na kterém poslouchá HTTP server, není nutné nastavit pro Docker.
- `HOST` - Adresa na kterém poslouchá HTTP server, není nutné nastavit pro Docker.
- `SOLR_URL` - URL na Solr bez '/' na konci.
- `COUCHDB_URL` - URL na CouchDB bez '/' na konci.
- `DATASET_CATALOG_URL` - URL na katalog datových sad bez '/' na konci.
- `HTTP_SERVE_STATIC` - Obslouží požadavky na statické zdroje z adresáře `assets`.
- `CLIENT_APPLICATION_FORM_URL` - URL pro registrační formulář aplikací.
- `CLIENT_SUGGESTION_FORM_URL` - URL pro registrační formulář návrhů ke zveřejnění dat.

## Sestavení a spuštění
Po naklonování repozitáře je nejprve zapotřebí nainstalovat knihovny pomocí následujícího příkazu.
```bash
npm ci
```

Dalším krokem je nastavení proměnných prostředí nebo vytvoření `.env` souboru, ten může mít třeba následující podobu.
```
NODE_ENV = "production"
PORT = "3000"
HOST = "127.0.0.1"
SOLR_URL = "http://localhost:8983/solr/applications"
COUCHDB_URL = "http://localhost:5984"
DATASET_CATALOG_URL = "http://localhost:8030"
HTTP_SERVE_STATIC = "1"
CLIENT_APPLICATION_URL = ""
```

Pak je již možné provést samotné spuštění.
```bash
npm run start
```

## Sestavení a spuštění pomocí Dockeru
Sestavení je možné provést pomocí Dockeru v kořeni repozitáře následujícím příkazem:
```bash
docker build -t ghcr.io/datagov-cz/nkod-application-catalog .
```

Sestavený Docker image je možné pustit pomocí:
```bash
docker run -p 3000:3000 -e "SOLR_URL={solr-url}" -e "COUCHDB_URL={couchdb-url}" -e "HTTP_SERVE_STATIC=1" -e "DATASET_CATALOG_URL={catalog-url}" ghcr.io/datagov-cz/nkod-application-catalog
```
