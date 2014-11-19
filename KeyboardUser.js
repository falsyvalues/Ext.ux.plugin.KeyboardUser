/**
* @class Ext.ux.plugin.field.date.KeyboardUser
* @author Michał Lipiński (https://github.com/falsyvalues)
* @version 0.2.0
*/
Ext.define('Ext.ux.plugin.field.date.KeyboardUser', {
    extend: 'Ext.AbstractPlugin',
    alternateClassName: 'Ext.ux.plugin.KeyboardUser',
    alias: 'plugin.fielddatetypinghelper',
    requires: [
        'Ext.Date',
        'Ext.Array',
        'Ext.EventObject',
        'Ext.String'
    ],
    /**
     * @cfg {String} token
     * Token that represents "now"
     */
    token: "t",
    /**
     * Array of key numbers, see Ext.EventObject
     * @cfg {Array} activationKey
     */
    activationKey: [
        Ext.EventObject.TAB
    ],
    /**
     * Date interval constant
     * @cfg {String} interval
     */
    interval: Ext.Date.DAY,
    /**
     * Plugin constructor
     * @param {Object} config
     */
    constructor: function(config) {
        var me = this;

        Ext.apply(me, config);

        if ( !me.token ) {
            me.token = "t";
        }

        me.splitRe = new RegExp('(' + Ext.String.escapeRegex(me.token) + ')(\\+|\\-)?([0-9]+)?');
    },
    /**
     * @private
     * Plugin initializer
     * @param {Ext.form.field.Date} field
     */
    init: function(field) {
        var me = this;

        Ext.apply(field, {
            enableKeyEvents: true
        });

        field.addListener( 'keydown', me.help, me );

        me.field = field;
    },
    /**
     * @private
     * Test value for pattern matching
     * @param {Ext.form.field.Date} field
     * @returns {Boolean} Value is ok
     */
    testValue: function(field) {
        var me = this,
            value = field.getValue() || "";

        if ( Ext.isDate(value) ) {
            return false;
        }

        return me.splitRe.test(value);
    },
    /**
     * @private
     * Returns value base on pattern
     *
     * @param {String} token
     * @param {String} symbol
     * @param {String} number
     * @returns {Date} Date object value
     */
    getValue: function(token, symbol, number) {
        var me = this,
            value = new Date(),
            symbol = symbol ? (symbol === "-" ? -1 : 1) : null,
            number = parseInt(number, 10) || 0;

        value = new Date();
        
        if ( !symbol || !number && number !== 0 ) {
            return value;
        }

        return Ext.Date.add(value, me.interval, symbol * number);
    },
    /**
     * @private
     * Filling up field under a certain condition
     * 
     * @param {Ext.form.field.Date} field
     * @param {Ext.EventObject} event
     * @param {Object} data
     * @returns {Boolean} Value was saved
     */
    help: function(field, event, data) {
        var me = this;

        if ( Ext.Array.indexOf(me.activationKey, event.getKey()) !== -1 && me.testValue(field) ) {
            field.setValue( me.getValue.apply( me, me.splitRe.exec( field.getValue().toString() ).slice(1) ) );
        }

        return true;
    },
    /**
     * @method
     * AbstractComponent calls destroy on all its plugins at destroy time.
     */
    destroy: function() {
        var me = this;

        me.field.removeListener( 'keydown', me.help, me );
        me.callParent(arguments);
    }
});
