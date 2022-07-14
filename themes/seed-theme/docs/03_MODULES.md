# Modules

## Guidelines

- Always include a `data-module` attribute containing the module slug on the top-level element.

## File structure

## Liquid symlinks

## Custom elements with JavaScript

If a module requires JavaScript functionality, it should be implemented as a custom element. Extend the `HTMLElement` class in your module's JavaScript file to define the functionality, and use the global `customElements.define` method to apply this functionality to a custom HTML tag which can be used in the module markup.

## CSS classes

## When to use a CSS file

In general, a CSS file should only be necessary when applying styles to elements which were added to the DOM by a third-party JS library. See the [CSS doc](./05_CSS.md) for more details on theme styling.
