/*global define*/
define(
[
    './model-lib',
    './model-local-lib'
],
  function (Laces, LacesLocal) {
    'use strict';
    function Model()
    {
        this.defaultAttrs({Model: {}});
        this.initModel = function(options)
        {
            var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            var uniqid = randLetter + Date.now();
            if(!this.$node.context.id)
            {
                this.$node.context.id = uniqid;
            }
            var store = options&&(options.store||false);
            var key = 'noLocalKeySet';
            if(options&&options.localKey)
            {
                key = options.localKey;
            }
            if(store && key !== 'noLocalKeySet')
            {
                this.attr.Model = new LacesLocal.LocalModel(key, {$node: this.$node.context.id});
            }
            else
            {
                this.attr.Model = new Laces.Model({}, {$node: this.$node.context.id});
            }
        };
        this.removeModel = function()
        {
            if(this.attr.Model)
            {
                delete this.attr.Model;
            }
        };
        this.get = function(key)
        {
            var value = this.attr.Model.get(key);
            return value;
        };
        this.set = function(key, value)
        {
            this.attr.Model.set(key, value);
        };
        this.bind = function(event, boundFn)
        {
            this.attr.Model.bind(event, boundFn);
        };
        this.remove = function(key)
        {
            this.attr.Model.remove(key);
        };

    }
    return Model;
});