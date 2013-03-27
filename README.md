# Icarus

Icarus is a JavaScript framework, that will enable you to write highly decoupled, yet structured web apps. Icarus is built on top of [Twitter Flight](https://github.com/twitter/flight/). Icarus retains all the base functionalities of Flight. Icarus also uses a modified version of [Laces.js](https://github.com/arendjr/laces.js) for it's Model implementation. Some of the documentation has been borrowed from these two.

## Why I wrote Icarus

Is Icarus an event-driven framework? Is Icarus a MV* framework? It is a little bit of both. The philosophy behind writing Icarus was to combine the best of both worlds. Icarus components are completely independent, and can communicate with one another, and with themselves using events. Icarus components also provide Models, which are similar to Models used in typical MV* frameworks. When Model data is added, removed, changed etc, events are fired to the component DOM with the data encapsulated in them. Custom functions may also be bound to these Model data events. Lastly, Icarus provides an option to sync the Model data with localStorage, so that it may be reinitialized when the page is reloaded. 


## Usage

The usage at the component level is exactly the same as Flight. Please refer to the Flight documentation for the same. To use the Icarus model, you will have to call the initModel method of the Icarus component. It is advisable to call this at the beginning of the `after('initialize')` function. A sample Icarus Component definition looks like this: 

```javascript
/*global define*/
define([
	'../../../lib/component'
], function (defineComponent) {
	function myComponent()
	{
		this.after('initialize', function () {
			this.initModel({});
		});
	}
	return defineComponent(myComponent);
});
```

## Model methods


### initModel

This method initializes the Model object. It takes one argument called options, which is a JS Object. The different options that can be set here are:

**store**: false by default. If set to true, the Model will sync with LocalStorage

**localkey**: A string value; It is the key used for LocalStorage

```javascript
this.after('initialize', function () {
	this.initModel({store: true, localKey: 'icarusModel'});
});
```

### removeModel

This method removes the Model object. Call this method before tearing down the Component. Though it is not mandatory, it is advisable to call this method to prevent memory leaks. 

### set

This method is used to add or change a property of the Model. It takes two arguments, the `key` and the `value` of the new data. 

```javascript
/*global define*/
define([
	'../../../lib/component'
], function (defineComponent) {
	function myComponent()
	{
		this.setCash = function(cash)
		{
			this.set('moneyz', 3000000);
		};
		this.after('initialize', function () {
			this.initModel({});
			this.on('paymentz', this.setCash);
		});
	}
	return defineComponent(myComponent);
});

```
The data that is set may be a single variable, an array, a Javascript object or a function that returns any of these. The function is recomputed whenever any of the Model values change. For example, 

```javascript
/*global define*/
define([
	'../../../lib/component'
], function (defineComponent) {
	function myComponent()
	{
		this.after('initialize', function () {
			this.initModel({});
			this.set('assets', 1000);
			this.set('liabilities', 500);
			this.set('totalCash', function() {return this.assets - this.liabilities;});
			this.set('assets', 2000);
			//totalCash is recalculated
		});
	}
	return defineComponent(myComponent);
});

```

Please see the [Object](#objects) and [Array](#array) references for more details on these. 

### get

This method takes the property `key` as the argument, and returns the corresponding value. 

```javascript
/*global define*/
define([
	'../../../lib/component'
], function (defineComponent) {
	function myComponent()
	{
		this.setCash = function(cash)
		{
			var cash = this.get('moneyz');
			this.set('moneyz', cash*2);
		};
		this.after('initialize', function () {
			this.initModel({});
			this.on('paymentz', this.setCash);
		});
	}
	return defineComponent(myComponent);
});

```

### remove

This method takes the `key` of the object to be removed as the argument, and removes the property from the Model. 

### bind

This method takes two arguments, the first is the `type` of change in the data, and the second is `function` to bind to this change. The function is executed every time the event is called. For different types of bindings, Please look at the [Binding Types](#bindings) section. 

```javascript
/*global define*/
define([
	'../../../lib/component'
], function (defineComponent) {
	function myComponent()
	{
		this.after('initialize', function () {
			this.initModel({});
			this.set('totalCash', 50);
			this.bind('change:totalCash', function(data){ alert('I can haz attached!');});
		});
	}
	return defineComponent(myComponent);
});

```

<a id="bindings"></a>
## Binding Types

The different types of bindings are: 
1. **'add'**: called when a new entry is added. 
1. **'remove'**: called when an entry is removed. 
1. **'update'**: called when an existing property is changed. 
1. **'change:(key)'**: called when an entry with the key is changed

The object passed has the following properties
1. **'name'**: name of the Binding type passed
1. **'key'**: key of the Object that generated this event
1. **'value'**: updated value

Functions can be bound to multiple events by separating the Binding types by a space. For example, 

```javascript
this.set('totalCash', 500);
this.bind('change:totalCash remove:totalCash', function (data){alert('Bound fn called');});
```

## Events

Events with the same name and data as those in the Binding Types section are triggered to the component DOM node. Additional Events for `add:(key)`, `remove:(key)` and `update:(key)` are also triggered. These can be handled by the component. 

```javascript
/*global define*/
define([
	'../../../lib/component'
], function (defineComponent) {
	function myComponent()
	{
		this.after('initialize', function () {
			this.initModel({});
			this.set('totalCash', 50);
			this.on('change:totalCash', function(event){ alert('I can haz attached!');});
		});
	}
	return defineComponent(myComponent);
});

```

The Event data can be found in `Event.originalEvent.detail`

<a id="objects"></a>
## Objects

When an Object with key-value properties is passed to the Model, each property is stored as a sub-model. Each of these sub-models will implement the methods get, set, remove and bind. Furthermore, Events will be triggered to the Component DOM node when data from these sub-models is added, removed or updated. These sub-models can be accessed by using get functions, and set using set functions in chains. Attributes could be accesed directly too, but use the set function to ensure proper binding and events. For example, 

```javascript
/*global define*/
define([
	'../../../lib/component'
], function (defineComponent) {
	function myComponent()
	{
		this.after('initialize', function () {
			this.initModel({});
			this.set('profile', {
				name: 'Ameya',
				keys: {
					a: 1,
					b: 2
				}
			});
			this.get('name'); //Returns Ameya
			this.get('keys'); //Returns sub-model
			this.get('keys').get('a'); //Returns keys->a
			//I could also write this.get('keys').a for the above line
			this.get('keys').set('b', 5); //Sets keys->b to 5
			//If I say this.get('keys').b=5, the bindings and events will not be triggered
		});
	}
	return defineComponent(myComponent);
});

```

<a id="array"></a>
## Arrays

Arrays can be set as Model properties as well. You can modify array values directly, but it is adviced to use the `set` method to set values; If done directly, the bindings and events will not be executed. 

**Note**: For arrays and objects, defining sub-attributes using functions that return a value will not work. Static values will have to be assigned. 

## Some Thoughts

1. Though data binding is possible through both function-binding and events, one should try to use the function-bindings just to change data around, and the events for DOM manipulation, Ajax calls, external libraries etc. 
1. Do not include constantly changing objects such as DOM nodes into a Model. This will lead to a lot of events getting triggered, and data flying all over the place, and could freeze up the app. 
1. The data binding I have opted for is rather loose, and gives one the flexibility to choose how his/her app workflow is going to be. 

## What is next?

1. Syncing the model data with a server through web-sockets with a polling fallback. 
1. Dynamic data for sub-models
1. Lots more I guess! Still thinking :)

Do send in your feedback to ameya(dot)karve(at)gmail(dot)com. Special thanks to Nitin Madasu, Tanmai Gopal and Tom Hamshere for their help :)