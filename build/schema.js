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
    {
        name: "content-type",
        template: "js/content-type.schema.json.template",
        description: "Generate a content type for an API ",
        fields: [
            "kind|Please choose the model type|enum:collectionType,singleType",
            "displayName|Content type display name|string",
            "useDraftAndPublish|Use draft and publish?|boolean",
        ],
    },
    {
        name: "plugin",
        template: "js/plugin-package.json.template",
        description: "Generate a basic plugin ",
    },
    {
        name: "controller",
        template: "js/controller.js.template",
        description: "Generate a controller for an API ",
    },
    {
        name: "policy",
        template: "js/policy.js.template",
        description: "Generate a policy for an API ",
    },
    {
        name: "middleware",
        template: "js/middleware.js.template",
        description: "Generate a middleware for an API ",
    },
    {
        name: "sevice",
        template: "js/service.js.template",
        description: "Generate a service for an API ",
    },
];
exports.concepts = concepts;
const generateConceptSchema = (concept) => {
    let conceptSchema = {
        type: "object",
        properties: {
            name: { type: "string" },
            extension: {
                type: "string",
                default: concept.template.replace(".template", "").split(".").pop() || ".js",
            },
            template: {
                type: "string",
                default: `${concept.template}`,
            },
            outputDir: { type: "string" },
        },
        required: ["name"],
    };
    if (concept.fields) {
        // each field is string where content is seprated with a |
        // and has the following format name|description|type[:option1,options2]
        concept.fields.forEach((field) => {
            const [name, description, typePart] = field.split("|");
            // if type contains : that means the type is enumeration
            if (typePart.includes(":")) {
                const [type, enumValues] = typePart.split(":");
                conceptSchema.properties[name] = {
                    type: "string",
                    description,
                    [type]: enumValues.split(","),
                };
            }
            else {
                conceptSchema.properties[name] = {
                    type: typePart,
                    description
                };
            }
        });
    }
    return conceptSchema;
};
const generateConceptArray = (concept) => {
    return {
        type: "array",
        description: concept.description,
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