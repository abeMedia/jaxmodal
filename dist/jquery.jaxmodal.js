/*! jaxModal - v0.1.0 - 2014-10-25
* https://github.com/abemedia/jaxmodal
* Copyright (c) 2014 Adam Bouqdib; Licensed GPL-2.0 */
/*global define, jQuery */
/*jslint evil: true */
 
;(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery, window, document, undefined );
	}
}(function($, window, document, undefined ) {
    
    var pluginName = "jaxmodal",
        defaults = {
            id: pluginName,
            title: "Modal Title",
            content: "Modal Content",
            actions: ["cancel", "save"],
            template: 
                '<div class="<%=this._name%> modal fade" id="<%=id%>" tabindex="-1" role="dialog" aria-labelledby="<%=id%>Label" aria-hidden="true">' + 
                '  <div class="modal-dialog">' +
                '    <div class="modal-content">' +
                '      <div class="modal-header">' +
                '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                '        <h4 class="modal-title" id="<%=id%>Label"><%=title%></h4>' +
                '      </div>' +
                '      <div class="modal-body" id="<%=id%>Body"><%=content%></div>' +
                '      <div class="modal-footer" id="<%=id%>Actions">' +
                '        <% for ( var i = 0; i < actions.length; i++ ) { %>' +
                '        <button type="button" class="btn <%=actions[i].class%>"' +
                '        <% for ( attribute in actions.data ) { %> data-<%=attribute%>="<%=actions.data[attribute]%>"<% } %>>' +
                '        <%=actions[i].title%></button>' +
                '        <% } %>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>'
        },
        cache = {};
		
	function Plugin ( element, options ) {
			this.element = element;
			this.options = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
	}
	
	$.extend(Plugin.prototype, {
		init: function () {
            var options = $.extend( {}, this.options, $(this.element).data());
               var modal = $(this.render(options.template, options)),
                actions = options.actions;
                
                $(this.element).on('click',function() {
                    
                for (var i = 0; i < actions.length; i++) {
                    if(typeof(actions[i]) === 'string') {
                        actions[i] = $.fn[ pluginName ].actions[actions[i]];
                    }
                    
                    
                    var cssClass = actions[i]["class"];
                    var button = $('<a href="#" class="btn ' + (cssClass ? cssClass : 'btn-default') + '">' + actions[i].title + '</a>');
                    
                    if(options.actions[i].class) {
                        button.attr('class', actions[i].class);
                    }
                    
                    if(options.actions[i].href) {
                        button.attr('href', actions[i].href);
                    }
                    
                    if(options.actions[i].onclick) {
                        button.on('click', actions[i].onclick);
                    }
                    
                    modal.find('.modal-footer').append(button);
                }
                    
                if ($("#" + options.id).length > 0 && $("#" + options.id)[0] !== modal[0]) {
                    $("#" + options.id).replaceWith(modal);
                } 
                else {
                    $('body').append(modal);
                }
                
                $("#" + options.id).show();
            });
        },
        render: function(str, data){
            var fn = !/\W/.test(str) ?
              cache[str] = cache[str] ||
                this.render(document.getElementById(str).innerHTML) :
             
              // Generate a reusable function that will serve as a template
              // generator (and which will be cached).
              new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
               
                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +
               
                // Convert the template into pure JavaScript
                str
                  .replace(/[\r\t\n]/g, " ")
                  .split("<%").join("\t")
                  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                  .replace(/\t=(.*?)%>/g, "',$1,'")
                  .split("\t").join("');")
                  .split("%>").join("p.push('")
                  .split("\r").join("\\'") + 
                "');}return p.join('');");
           
            // Provide some basic currying to the user
            return data ? fn( data ) : fn;
        }
    });
	
	$.fn[ pluginName ] = function ( options ) {
			this.each(function() {
					if ( !$.data( this, "plugin_" + pluginName ) ) {
							$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
					}
			});
			
			return this;
	};
	
    $.fn[ pluginName ].actions = {
        cancel: {
            title: "Close",
            class: "btn-default",
            onclick: function() {
                $('.' + pluginName).modal('hide');
            },
            data: {dismiss: "modal"}
        },
        save: {
            title: "Save",
            class: "btn-primary",
            onclick: function() {
                $('.' + pluginName).children('form').submit();
            }
        },
        next: {
            title: "Continue",
            class: "btn-primary",
            onclick: function() {
                $('.' + pluginName);
            }
        }
	};
		
}));
