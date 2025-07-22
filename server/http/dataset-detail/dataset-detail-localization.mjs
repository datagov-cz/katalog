export default {
  cs: {
    path: "datová-sada",
    query: {
      iri: "iri",
      "distribution-page": "stránka-distribucí",
    },
    argument: {},
    translation: {
      "url-edit-dataset": "registrace-datové-sady?datová-sada=",
      "url-copy-dataset": "registrace-datové-sady?kopírovat-z-datové-sady=",
      "url-delete-dataset": "odstranění-datové-sady?dataset=",
      "url-delete-catalog": "odstranění-lokálního-katalogu?catalog=",
      year: [
        [1, "{} rok"],
        [2, "{} roky"],
        [5, "{} let"],
      ],
      month: [
        [1, "{} měsíc"],
        [2, "{} měsíce"],
        [5, "{} měsíců"],
      ],
      day: [
        [1, "{} den"],
        [2, "{} dny"],
        [5, "{} dní"],
      ],
      hour: [
        [1, "{} hodina"],
        [2, "{} hodiny"],
        [5, "{} hodin"],
      ],
      minute: [
        [1, "{} minuta"],
        [2, "{} minuty"],
        [5, "{} minut"],
      ],
      second: [
        [1, "{} vteřina"],
        [2, "{} vteřiny"],
        [5, "{} vteřin"],
      ],
      "with-personal-data-label": "Obsahuje",
      "with-personal-data-comment":
        "Obsahuje osobní údaje. Příjemce této distribuce datové sady se stává správcem osobních údajů.",
      "without-personal-data-label": "Neobsahuje",
      "without-personal-data-comment": "Neobsahuje osobní údaje.",
      "unspecified-personal-data-label":
        "Může obsahovat osobní údaje (nespecifikováno)",
      "unspecified-personal-data-comment":
        "Poskytovatel nespecifikuje, zda distribuce datové sady obsahuje osobní údaje. Pokud ano, tak se příjemce této distribuce stává správcem osobních údajů.",
      "missing-personal-data-information-label":
        "Může obsahovat osobní údaje (nespecifikováno)",
      "missing-personal-data-information-comment":
        "Poskytovatel nespecifikuje, zda distribuce datové sady obsahuje osobní údaje. Pokud ano, tak se příjemce této distribuce stává správcem osobních údajů.",
      "without-authorship": "Neobsahuje",
      "without-authorship-comment": "Neobsahuje autorská díla.",
      "with-multiple-authorship": "Obsahuje více děl",
      "with-authorship-comment":
        "Obsahuje více autorských děl. Licence umožňující jejich užití jsou přiloženy přímo u nich.",
      "ccby-authorship": "CC BY 4.0",
      "ccby-authorship-comment":
        "Autorské dílo licencované CC BY 4.0. Při použití díla je nutno uvést autora.",
      "custom-authorship": "Vlastní licence",
      "custom-authorship-comment":
        "Poskytovatel pro dílo používá vlastní podmínky užití. Před užitím díla je nutné se s nimi seznámit a souhlasit s nimi.",
      "missing-authorship": "Nespecifikovány",
      "missing-authorship-comment":
        "Poskytovatel dat nespecifikoval podmínky užití. Nejedná se tedy o otevřená data a jejich užitím se příjemce vystavuje právním rizikům.",
      "without-database-authorship": "Neobsahuje",
      "without-database-authorship-comment":
        "Není autorskoprávně chráněnou databází.",
      "ccby-database-authorship": "CC BY 4.0",
      "ccby-database-authorship-comment":
        "Autorské dílo licencované CC BY 4.0. Při použití díla je nutno uvést autora.",
      "missing-database-authorship": "Nespecifikovány",
      "missing-database-authorship-comment":
        "Poskytovatel dat nespecifikoval podmínky užití. Nejedná se tedy o otevřená data a jejich užitím se příjemce vystavuje právním rizikům.",
      "custom-database-authorship": "Vlastní licence",
      "custom-database-authorship-comment":
        "Poskytovatel pro databázi používá vlastní podmínky užití. Před užitím databáze je nutné se s nimi seznámit a souhlasit s nimi.",
      "without-protected-database-authorship": "Není chráněna",
      "without-protected-database-authorship-comment":
        "Není chráněna zvláštním právem pořizovatele databáze.",
      "cc0-protected-database-authorship": "CC0",
      "cc0-protected-database-authorship-comment": "Licencováno CC0.",
      "missing-protected-database-authorship": "Nespecifikovány",
      "missing-protected-database-authorship-comment":
        "Poskytovatel dat nespecifikoval podmínky užití. Nejedná se tedy o otevřená data a jejich užitím se příjemce vystavuje právním rizikům.",
      "custom-protected-database": "Vlastní licence",
      "custom-protected-database-comment":
        "Poskytovatel pro ošetření zvláštního práva pořizovatele databáze používá vlastní podmínky užití. Před užitím databáze je nutné se s nimi seznámit a souhlasit s nimi..",
      "show-specification": "Zobrazit specifikaci",
    },
  },
  en: {
    path: "dataset",
    query: {
      iri: "iri",
      "distribution-page": "distribution-page",
    },
    argument: {},
    translation: {
      "url-edit-dataset": "dataset-registration?dataset=",
      "url-copy-dataset": "dataset-registration?copy-from-dataset=",
      "url-delete-dataset": "dataset-withdrawn?dataset=",
      "url-delete-catalog": "local-catalog-withdrawn?catalog=",
      year: [
        [1, "{} year"],
        [2, "{} years"],
      ],
      month: [
        [1, "{} month"],
        [2, "{} months"],
      ],
      day: [
        [1, "{} day"],
        [2, "{} days"],
      ],
      hour: [
        [1, "{} hour"],
        [2, "{} hours"],
      ],
      minute: [
        [1, "{} minute"],
        [2, "{} minutes"],
      ],
      second: [
        [1, "{} second"],
        [2, "{} seconds"],
      ],
      "with-personal-data-label": "Contains personal data",
      "with-personal-data-comment":
        "Contains personal data. With download of this distribution you are becoming personal data controller.",
      "without-personal-data-label": "No personal data",
      "without-personal-data-comment": "Does not contain personal data.",
      "unspecified-personal-data-label":
        "May contain personal data (unspecified)",
      "unspecified-personal-data-comment":
        "The publisher does not specify whether or not this distribution contains personal data. If it does, then with download of this distribution you are becoming personal data controller.",
      "missing-personal-data-information-label": "Unspecified license",
      "missing-personal-data-information-comment":
        "The publisher does not specify the terms of use for this distribution. It is not considered open data and by using it, you expose yourself to legal issues.",
      "without-authorship": "Not copyrighted",
      "without-authorship-comment": "Does not contain copyrighted works.",
      "with-multiple-authorship": "Multiple works",
      "with-authorship-comment":
        "The distribution contains several copyrighted works. Licences that allow further use of these copyrighted works are attached to them.",
      "ccby-authorship": "CC BY 4.0",
      "ccby-authorship-comment":
        "Copyrighted work licensed using CC BY 4.0. You must give appropriate credit, provide a link to the license, and indicate if changes were made.",
      "custom-authorship": "Custom license",
      "custom-authorship-comment":
        "The publisher uses custom terms of use. It is necessary to agree to them before using the data.",
      "missing-authorship": "Unspecified license",
      "missing-authorship-comment":
        "The publisher does not specify the terms of use for this distribution. It is not considered open data and by using it, you expose yourself to legal issues.",
      "without-database-authorship": "Not copyrighted",
      "without-database-authorship-comment":
        "Does not contain copyrighted works.",
      "ccby-database-authorship": "CC BY 4.0",
      "ccby-database-authorship-comment":
        "The database is a copyrighted work licensed using CC BY 4.0. You must give appropriate credit, provide a link to the license, and indicate if changes were made.",
      "missing-database-authorship": "Unspecified license",
      "missing-database-authorship-comment":
        "The publisher does not specify the terms of use for this distribution. It is not considered open data and by using it, you expose yourself to legal issues.",
      "custom-database-authorship": "Custom license",
      "custom-database-authorship-comment":
        "The publisher uses custom terms of use for the database. It is necessary to agree to them before using the database.",
      "without-protected-database-authorship": "Not protected",
      "without-protected-database-authorship-comment":
        "Not protected by sui generis database rights.",
      "cc0-protected-database-authorship": "CC0",
      "cc0-protected-database-authorship-comment": "Licensed using CC0.",
      "missing-protected-database-authorship": "Unspecified license",
      "missing-protected-database-authorship-comment":
        "The publisher does not specify the terms of use for this distribution. It is not considered open data and by using it, you expose yourself to legal issues.",
      "custom-protected-database": "Custom license",
      "custom-protected-database-comment":
        "The publisher uses custom terms of use for the sui generis database rights. It is necessary to agree to them before using the database.",
      "show-specification": "Show specification",
    },
  },
};
