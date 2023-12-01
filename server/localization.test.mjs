import assert from "node:assert";
import { describe, it } from "node:test"
import { createLocalization } from "./localization.mjs";

describe("Localization", () => {

  const localization = createLocalization(
    {
      "path": {
        "list": "seznam",
        "detail": "detail"
      },
      "query": {
        "list": {
          "title": "název",
          "sort": "pořadí"
        },
        "detail": {
          "title": "název-aplikace",
        }
      },
      "arguments": {
        "list": {
          "title": "název",
        },
      },
      "translation": {
        "count": [
          [0, "Zero"],
          [1, "One"],
          [2, "Value {}"],
        ],
        "query": "dotaz",
      }
    },
    "cs");

  it("Language", () => {
    assert.strictEqual(localization.language, "cs");
    assert.strictEqual(localization.view("list").language, "cs");
  });

  it("Path", () => {
    assert.strictEqual(
      localization.view("list").linkFromServer({}),
      "seznam");
    assert.strictEqual(
      localization.view("detail").linkFromServer({}),
      "detail");
  });

  it("Query", () => {

    assert.strictEqual(
      localization.view("list").queryArgumentFromClient(
        { "název": "value" }, "title"), "value");

    assert.strictEqual(
      localization.view("list").queryArgumentFromClient(
        {}, "missing"), null);

    assert.strictEqual(
      localization.view("detail").queryArgumentFromClient(
        { "název-aplikace": "value" }, "title"), "value");

    assert.deepEqual(
      localization.view("list").queryArgumentArrayFromClient(
        { "název": ["first", "second"] }, "title"), ["first", "second"]);

    assert.deepEqual(
      localization.view("list").queryArgumentArrayFromClient(
        { "název": "first" }, "title"), ["first"]);
  });

  it("Argument", () => {
    assert.strictEqual(
      localization.view("list").argumentFromServer("title"),
      "název");
  });

  it("Link from server", () => {
    assert.strictEqual(
      localization.view("list").linkFromServer({ "sort": "title" }),
      "seznam?po%C5%99ad%C3%AD=title");
  });

  it("Simple translation", () => {
    assert.strictEqual(
      localization.view("list").translateFromServer("query"),
      "dotaz");
  });

  it("Translation with a number", () => {
    assert.strictEqual(
      localization.view("list").translateFromServer("count", -1),
      "Zero");

    assert.strictEqual(
      localization.view("list").translateFromServer("count", 0),
      "Zero");

    assert.strictEqual(
      localization.view("list").translateFromServer("count", 1),
      "One");

    assert.strictEqual(
      localization.view("list").translateFromServer("count", 2),
      "Value 2");

    assert.strictEqual(
      localization.view("list").translateFromServer("count", 5),
      "Value 5");
  });

});
