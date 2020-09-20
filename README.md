# recreated-jquery

This is my first typescript project. I've recreated the main functionalities of jquery just to get comfortable with the language.
I've tried to implement it using OOP principles(did't find a case where to use inheritance, just composition).

## Functionalities implemented

### Selecting elements

You can use a variety of selectors

```typescript
type JQueryElementAccepted = Element | Window | Document;

type Selector =
	| string
	| JQueryElementAccepted
	| NodeList
	| (JQueryElementAccepted | null)[]
	| null
	| undefined
	| EventHandler;
```

### DOM Manipulations

-   text
-   html
-   val
-   attr
-   clone
-   append
-   prepend
-   before
-   after
-   remove
-   empty
-   width
-   height
-   innerWidth
-   innerHeight
-   outerWidth
-   outerHeight

### DOM Traversing

-   parent
-   parents
-   parentsUntil
-   children
-   find
-   first
-   last
-   eq
-   filter
-   not
-   siblings
-   next
-   prev
-   nextAll
-   prevAll
-   nextUntil
-   prevUntil

### Css

-   addClass
-   removeClass
-   toggleClass
-   css

### Event handling

-   on
-   click
-   dblclick
-   mouseenter
-   mouseleave
-   mousedown
-   mouseup
-   focus
-   blur
-   hover

### Effects

-   animate
-   play
-   pause
-   reverse
-   finish
-   cancel

### Static methods

-   ready
-   on
-   create
-   http
-   get
-   post
