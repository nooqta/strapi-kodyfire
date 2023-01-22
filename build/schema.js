"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.concepts = exports.conceptArray = exports.concept = void 0;
exports.concept = {
    type: "object",
    properties: {
        name: { type: "string" },
        template: {
            type: "string",
        },
        outputDir: { type: "string" },
    },
};
exports.conceptArray = {
    type: "array",
    items: exports.concept,
};
const concepts = [
    { name: "api", template: "api", description: "Generate a basic API " },
    { name: "controller", template: "js/controller.js.template", description: "Generate a controller for an API " },
    { name: "policy", template: "js/policy.js.template", description: "Generate a policy for an API " },
    { name: "middleware", template: "js/middleware.js.template", description: "Generate a middleware for an API " },
    { name: "middleware", template: "js/middleware.js.template", description: "Generate a service for an API " },
];
exports.concepts = concepts;
const generateConceptSchema = (concept) => {
    return {
        type: "object",
        properties: {
            name: { type: "string" },
            extension: { type: "string", default: "js" },
            template: {
                type: "string",
                default: `${concept.template}`,
            },
            outputDir: { type: "string" },
        },
        required: ["name"],
    };
};
const generateConceptArray = (concept) => {
    return {
        type: "array",
        items: generateConceptSchema(concept),
    };
};
let schema = {
    type: "object",
    properties: {
        project: { type: "string" },
        name: { type: "string" },
        rootDir: { type: "string" },
        concept: exports.conceptArray,
    },
    required: ["name"],
};
exports.schema = schema;
concepts.forEach((concept) => {
    schema.properties[concept.name] = generateConceptArray(concept);
});
//# sourceMappingURL=schema.js.map