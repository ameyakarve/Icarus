/*global define*/
(function(window) {

    'use strict';

    var localStorage = window.localStorage;

    function init(Laces) {

    // Laces Local Model constructor.
    //
    // A Laces Local Model is a Model that automatically syncs itself to LocalStorage.
    //
    // key - The key to use for storing the LocalStorage data.
        function LacesLocalModel(key, options) {

            var data = localStorage.getItem(key);
            var object = data && JSON.parse(data) || {};
            this.$node = options.$node;
            Laces.Model.call(this, object, options);

            this.bind('change', function() {localStorage.setItem(key, JSON.stringify(this)); });
        }
        LacesLocalModel.prototype = new Laces.Model({}, {$node: LacesLocalModel.$node});
        LacesLocalModel.prototype.constructor = LacesLocalModel;

        Laces.LocalModel = LacesLocalModel;


        // Laces Local Array constructor.
        //
        // A Laces Local Array is a Laces Array that automatically syncs itself to LocalStorage.
        //
        // key - The key to use for storing the LocalStorage data.
        function LacesLocalArray(key, options) {

            var data = localStorage.getItem(key);
            var elements = data && JSON.parse(data) || [];
            this.$node = options.$node;
            var array = Laces.Array.call(this);
            for (var i = 0, length = elements.length; i < length; i++) {
                array.push(elements[i]);
            }
            array.bind('change', function() { console.log("Wrote to Local Storage Array");localStorage.setItem(key, JSON.stringify(this)); });

            return array;
        }

        Laces.LocalArray = LacesLocalArray;

    }

    if (typeof define === 'function' && define.amd) {
        define(function(require) {
            var Laces = require('./model-lib');
            init(Laces);
            return Laces;
        });
    } else {
        var Laces = { Model: window.LacesModel, Map: window.LacesMap, Array: window.LacesArray };
        init(Laces);
        window.LacesLocalModel = Laces.LocalModel;
        window.LacesLocalArray = Laces.LocalArray;
    }

})(this);