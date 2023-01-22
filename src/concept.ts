import { IConcept, ITechnology } from 'kodyfire-core';
import { join, relative } from 'path';

import { Concept as BaseConcept } from 'basic-kodyfire';
import { Engine } from './engine';
import { strings } from '@angular-devkit/core';
import * as parsers from './parsers';
const { promises: fs } = require('fs');
const pluralize = require('pluralize');

export class Concept extends BaseConcept {
  extension = '.js';
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
    this.engine = new Engine();

    // Register functions you want to use in your templates with the engine builder registerHelper method.
    this.engine.builder.registerHelper('uppercase', (value: any) => {
      return value.toUpperCase();
    });
    this.engine.builder.registerHelper('pluralize', (value: any) => {
      return pluralize(value);
    });
    this.engine.builder.registerHelper('lowercase', (value: any) => {
      return value?.toLowerCase();
    });
    this.engine.builder.registerHelper(
      'ifEquals',
      function (
        arg1: any,
        arg2: any,
        options: { fn: (arg0: any) => any; inverse: (arg0: any) => any }
      ) {
        /* @ts-ignore */
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      }
    );

    this.engine.builder.registerHelper('includes', function (arg1: string,
      arg2: string[],
      options: { fn: (arg0: any) => any; inverse: (arg0: any) => any }
      ) {
        /* @ts-ignore */
        arg2 = arg2.split(',').map(value => value.trim());
        /* @ts-ignore */
      return arg2.includes(arg1)? options.fn(this) : options.inverse(this);;
    });
    this.engine.builder.registerHelper('equals', function (arg1: any, arg2: any) {
      /* @ts-ignore */
      return arg1 == arg2;
    });

    for (const key in strings) {
      this.engine.builder.registerHelper(key, (value: any) => {
        /* @ts-ignore */
        return strings[key](value);
      });
    }
  }

  initEngine() {
    this.engine = new Engine();
  }

  async generate(_data: any) {
    this.initEngine();
    if(_data.outputDir) {
      this.outputDir = _data.outputDir;
    }
    const {templateFolder = ''} = _data;
    if(_data.import) {
      _data = this.prepareData(_data);
    }
    _data.templateFolder = templateFolder;
    const filePath = join(this.getTemplatesPath(), this.template.path, _data.template, templateFolder);
    let stat = await fs.lstat(filePath);
    if (stat.isDirectory()) {
      const folderContent = await this.readFolder(filePath);
      for (const file of folderContent) {
      stat = await fs.lstat(join(filePath, file));
      if (stat.isFile()) {
        const template = await this.engine.read(
          filePath,
          file
        );

        const compiled = await this.engine.compile(template, _data);
        await this.engine.createOrOverwrite(
          this.technology.rootDir,
          this.outputDir,
          this.getFilename({
            path: _data.templateFolder || '',
            name: file
          }),
          compiled
        );
      } else if (stat.isDirectory()) {
        await this.generate({
          ..._data,
          templateFolder: join(_data.templateFolder, file),
        });
      }
    }
  } else {
    const template = await this.engine.read(
      join(this.getTemplatesPath(), this.template.path),
      _data.template
    );
    
    _data.class = strings.classify(_data.name);
    const compiled = this.engine.compile(template, _data);
    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data),
      compiled
    );
  }
  }

  async readFolder(folder: string): Promise<any[]> {
    // Read directory
    let names;
    try {
      names = await fs.readdir(folder);
    } catch (e) {
      console.log('e', e);
      throw e;
    }
    return names;
  }

  getFilename(data: any) {
    if (data.filename) return data.filename;
    return join(
      data.path,
      `${data.name.toLowerCase().replace('.template','')}${this.extension}`
    );
  }
  getTemplatesPath(): string {
    return this.technology.params.templatesPath
      ? this.technology.params.templatesPath
      : relative(process.cwd(), __dirname);
  }

  getExtension(templateName: string) {
    return templateName.replace('.template', '').split('.').pop();
  }

  prepareData(_data: any): any {
    const { parser } = _data;
    // @ts-ignore
    // We dynamically instantiate the parser class
    const currentParser = new (<any>parsers)[strings.capitalize(`${parser}Parser`)]();
    return currentParser.parse(_data);
  }


  // resolve template name if it does not have template extension
  resolveTemplateName(templateName: string, name: string) {
    if (templateName.includes('.template')) return templateName;
    // The format of a template : {conceptName}.{templateName}.{extension}.template
    // example : concept.api.php.template
    templateName = templateName ? `.${templateName}` : '';
    return `${name.toLowerCase()}${templateName}${this.extension}.template`;
  }
}
