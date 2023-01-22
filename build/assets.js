"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const generateConceptAsset = (concept) => {
    return {
        "name": concept.name,
        "outputDir": "",
        "template": {
            "path": "templates/",
            "options": [],
            "placeholders": []
        }
    };
};
const generateConceptArray = () => {
    return schema_1.concepts.map(c => generateConceptAsset(c));
};
exports.default = {
    "name": "basic",
    "version": "0.1",
    "rootDir": "out",
    "concepts": [
        {
            "name": "concept",
            "outputDir": "",
            "template": {
                "path": "templates/",
                "options": [],
                "placeholders": []
            }
        },
        ...generateConceptArray()
    ]
};
//# sourceMappingURL=assets.js.map