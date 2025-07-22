import fileSystem from "fs";

import { createHandlebars } from "../handlebars/handlebars";
import configuration from "../configuration";

export function createTemplateService(basePath) {
  if (configuration.server.reloadTemplates) {
    return new ReloadingTemplateService(basePath);
  }
  return new BoundTemplateService(basePath);
}

class BoundTemplateService {
  constructor(basePath) {
    this.view_map = {};
    this.handlebars = createHandlebars();
    this.basePath = basePath;
  }

  view(name) {
    return this.view_map[name];
  }

  /**
   * Load and add partial template under given name.
   */
  syncAddComponent(name, path) {
    const content = fileSystem.readFileSync(
      this.basePath + "/component/" + path,
      "utf8",
    );
    this.handlebars.partials[name] = this.handlebars.compile(content);
  }

  /**
   * Load and return template.
   */
  syncAddView(name, path) {
    const content = fileSystem.readFileSync(
      this.basePath + "/http/" + path,
      "utf8",
    );
    this.view_map[name] = this.handlebars.compile(content);
  }
}

/**
 * Reload content with every request.
 */
class ReloadingTemplateService extends BoundTemplateService {
  constructor(basePath) {
    super(basePath);
    this.partials = {};
  }

  view(name) {
    for (const [name, path] of Object.entries(this.partials)) {
      const content = fileSystem.readFileSync(path, "utf8");
      this.handlebars.partials[name] = this.handlebars.compile(content);
    }
    const content = fileSystem.readFileSync(this.view_map[name], "utf8");
    return this.handlebars.compile(content);
  }

  syncAddComponent(name, path) {
    this.partials[name] = this.basePath + "/component/" + path;
  }

  syncAddView(name, path) {
    this.view_map[name] = this.basePath + "/http/" + path;
  }
}
