# LabelClosing

This is a small extension for JavaScript files. 
It labels the closing bracket with the opening bracket line. 

```js
function helloWorld () {
  console.log("Hello World");
} // function helloWorld () {

//This function prints Hello World
function helloWorld () {
  console.log("Hello World");
} // This function prints Hello World - function helloWorld () {
```

With the extension:
<img source="docs/with.png" width="128px"/>

Without
<img source="/docs/without.png" width="128px"/>

When hovering over the comment it will show you the max 4 next lines of the opening line.
