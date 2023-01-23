"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentType = void 0;
const path_1 = require("path");
const basic_kodyfire_1 = require("basic-kodyfire");
const engine_1 = require("./engine");
const core_1 = require("@angular-devkit/core");
const parsers = __importStar(require("./parsers"));
const { promises: fs } = require('fs');
const pluralize = require('pluralize');
class ContentType extends basic_kodyfire_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
        this.extension = '.json';
        this.engine = new engine_1.Engine();
        // Register functions you want to use in your templates with the engine builder registerHelper method.
        this.engine.builder.registerHelper('uppercase', (value) => {
            return value.toUpperCase();
        });
        this.engine.builder.registerHelper('pluralize', (value) => {
            return pluralize(value);
        });
        this.engine.builder.registerHelper('lowercase', (value) => {
            return value === null || value === void 0 ? void 0 : value.toLowerCase();
        });
        this.engine.builder.registerHelper('ifEquals', function (arg1, arg2, options) {
            /* @ts-ignore */
            return arg1 == arg2 ? options.fn(this) : options.inverse(this);
        });
        this.engine.builder.registerHelper('includes', function (arg1, arg2, options) {
            /* @ts-ignore */
            arg2 = arg2.split(',').map(value => value.trim());
            /* @ts-ignore */
            return arg2.includes(arg1) ? options.fn(this) : options.inverse(this);
            ;
        });
        this.engine.builder.registerHelper('equals', function (arg1, arg2) {
            /* @ts-ignore */
            return arg1 == arg2;
        });
        for (const key in core_1.strings) {
            this.engine.builder.registerHelper(key, (value) => {
                /* @ts-ignore */
                return core_1.strings[key](value);
            });
        }
    }
    initEngine() {
        this.engine = new engine_1.Engine();
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_data.extension) {
                this.extension = `.${_data.extension.replace('.', '')}`;
            }
            this.initEngine();
            if (_data.outputDir) {
                this.outputDir = _data.outputDir;
            }
            const { templateFolder = '' } = _data;
            _data.singularName = core_1.strings.dasherize(_data.name);
            _data.pluralName = pluralize(_data.singularName);
            _data.collectionName = core_1.strings.underscore(_data.singularName);
            if (_data.import) {
                _data = this.prepareData(_data);
            }
            _data.templateFolder = templateFolder;
            const filePath = (0, path_1.join)(this.getTemplatesPath(), this.template.path, _data.template, templateFolder);
            let stat = yield fs.lstat(filePath);
            if (stat.isDirectory()) {
                const folderContent = yield this.readFolder(filePath);
                for (const file of folderContent) {
                    stat = yield fs.lstat((0, path_1.join)(filePath, file));
                    if (stat.isFile()) {
                        const template = yield this.engine.read(filePath, file);
                        const compiled = yield this.engine.compile(template, _data);
                        yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename({
                            path: _data.templateFolder || '',
                            name: file
                        }), compiled);
                    }
                    else if (stat.isDirectory()) {
                        yield this.generate(Object.assign(Object.assign({}, _data), { templateFolder: (0, path_1.join)(_data.templateFolder, file) }));
                    }
                }
            }
            else {
                const template = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path), _data.template);
                _data.class = core_1.strings.classify(_data.name);
                const compiled = this.engine.compile(template, _data);
                yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename({
                    path: (0, path_1.join)(pluralize(core_1.strings.dasherize(this.name)), _data.name.toLowerCase()),
                    name: 'schema'
                }), compiled);
            }
        });
    }
    readFolder(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            // Read directory
            let names;
            try {
                names = yield fs.readdir(folder);
            }
            catch (e) {
                console.log('e', e);
                throw e;
            }
            return names;
        });
    }
    getFilename(data) {
        if (data.filename)
            return data.filename;
        return (0, path_1.join)(data.path, `${data.name.toLowerCase()}${this.extension}`);
    }
    getTemplatesPath() {
        return this.technology.params.templatesPath
            ? this.technology.params.templatesPath
            : (0, path_1.relative)(process.cwd(), __dirname);
    }
    getExtension(templateName) {
        return templateName.replace('.template', '').split('.').pop();
    }
    prepareData(_data) {
        const { parser } = _data;
        // @ts-ignore
        // We dynamically instantiate the parser class
        const currentParser = new parsers[core_1.strings.capitalize(`${parser}Parser`)]();
        return currentParser.parse(_data);
    }
    // resolve template name if it does not have template extension
    resolveTemplateName(templateName, name) {
        if (templateName.includes('.template'))
            return templateName;
        // The format of a template : {conceptName}.{templateName}.{extension}.template
        // example : concept.api.php.template
        templateName = templateName ? `.${templateName}` : '';
        return `${name.toLowerCase()}${templateName}${this.extension}.template`;
    }
}
exports.ContentType = ContentType;
//# sourceMappingURL=conent-type.js.map