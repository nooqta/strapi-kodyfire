export const concept = {
  type: "object",
  properties: {
    name: { type: "string" },
    template: {
      type: "string",
    },
    outputDir: { type: "string" },
  },
};

export const conceptArray = {
  type: "array",
  items: concept,
};

const concepts = [
  { name: "api", template: "api", description: "Generate a basic API " },
  { name: "controller", template: "js/controller.js.template", description: "Generate a controller for an API " },
  { name: "policy", template: "js/policy.js.template", description: "Generate a policy for an API " },
  { name: "middleware", template: "js/middleware.js.template", description: "Generate a middleware for an API " },
  { name: "middleware", template: "js/middleware.js.template", description: "Generate a service for an API " },
];
const generateConceptSchema = (concept: any) => {
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

const generateConceptArray = (concept: any) => {
  return {
    type: "array",
    items: generateConceptSchema(concept),
  };
};
let schema: any = {
  type: "object",
  properties: {
    project: { type: "string" },
    name: { type: "string" },
    rootDir: { type: "string" },
    concept: conceptArray,
  },
  required: ["name"],
};

concepts.forEach((concept) => {
  schema.properties[concept.name] = generateConceptArray(concept);
});

export { concepts, schema };
