import { Technology as BaseTechnology } from 'basic-kodyfire';
import * as classes from '.';
import assets from './assets';
// import { capitalize } from 'kodyfire-core';
import { join } from 'path';
import { Concept } from './concept';
import { classify } from '@angular-devkit/core/src/utils/strings';
const fs = require('fs');

export class Technology extends BaseTechnology {
  constructor(params: any, _assets = assets) {
    try {
      super(params, _assets);
      this.assets = _assets;
      this.updateTemplatesPath(params);
      this.initConcepts();
    } catch (error) {
      console.log(error);
    }
  }

  public initConcepts() {
    // add dynamic property for technology
    for (const concept of this.assets.concepts) {
      if(typeof (<any>classes)[classify(concept.name)] !== 'undefined') {
      this.concepts.set(
        concept.name,
        new (<any>classes)[classify(concept.name)](concept, this)
      );
    } else {
      this.concepts.set(
        concept.name,
        new Concept(concept, this)
      );
    }
  }
  }

  public updateTemplatesPath(params: any) {
    const templatesPath = join(process.cwd(), '.kody', params.name);
    // we check if the path exists
    if (fs.existsSync(templatesPath)) {
      this.params.templatesPath = templatesPath;
      // We overwrite the assets property if assets.(js|json) exists in the .kody folder
      if (fs.existsSync(join(templatesPath, 'assets.js'))) {
        this.assets = require(join(templatesPath, 'assets.js'));
      }
      else if (fs.existsSync(join(templatesPath, 'assets.json'))) {
        this.assets = require(join(templatesPath, 'assets.json'));
      }
    }
  }
}
