/* eslint-disable import/no-anonymous-default-export */
export default function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  // create your generators here
  plop.setGenerator("add component", {
    description: "Adding a new component...",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name plz...",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{name}}/{{name}}.tsx",
        templateFile: "plop-templates/component.tsx.hbs",
      },
      // {
      //   type: "add",
      //   path: "src/components/{{name}}/{{name}}.stories.ts",
      //   templateFile: "plop-templates/story.ts.hbs",
      // },
    ],
  });
}
