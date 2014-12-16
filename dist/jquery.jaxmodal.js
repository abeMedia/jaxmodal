/*! jaxModal - v0.1.0 - 2015-02-24
* https://github.com/abemedia/jaxmodal
* Copyright (c) 2015 Adam Bouqdib; Licensed GPL-2.0 */
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
            action: "",
            title: "Modal Title",
            size: "md",
            content: "Modal Content",
            actions: [
                {
                    title: "Cancel",
                    data: {dismiss: "modal"}
                },
                {
                    title: "OK",
                    class: "btn-primary",
                    onclick: function() {
                        $(this).button("loading");
                        $("#" + pluginName + " form").submit();
                    },
                    data: {
                        loadingText: "Loading..."
                    }
                }
            ],
            template: 
                '<div class="<%=this._name%> modal fade" id="<%=id%>" tabindex="-1" role="dialog" aria-labelledby="<%=id%>Label" aria-hidden="true">' + 
                '  <div class="modal-dialog modal-<%=size%>">' +
                '    <form action="<%=action%>" class="modal-content" role="form" method="post" enctype="multipart/form-data">' +
                '      <div class="modal-header">' +
                '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                '        <h4 class="modal-title" id="<%=id%>Label"><%=title%></h4>' +
                '      </div>' +
                '      <div class="modal-body" id="<%=id%>Body"><%=content%></div>' +
                '      <div class="modal-footer" id="<%=id%>Actions">' +
                '        <% for ( var i = 0; i < actions.length; i++ ) { %>' +
                '        <button type="button" class="btn <%=(actions[i].class ? actions[i].class : "btn-default")%>"' +
                '        <% for ( d in actions[i].data ) { %> data-<%=d%>="<%=actions[i].data[d]%>"<% } %>>' +
                '        <%=actions[i].title%></button>' +
                '        <% } %>' +
                '      </div>' +
                '    </form>' +
                '  </div>' +
                '</div>'
        },
        cache = {};
        
    function Plugin ( element, options, callback ) {
            this.element = element;
            this.options = $.extend( {}, defaults, options );
            if(this.options.action === "") {
                this.options.action = window.location.href;
            }
            this._defaults = defaults;
            this._name = pluginName;
            this.callback = callback;
            this.init();
    }
    $.extend(Plugin.prototype, {
        init: function () {
            var options = $.extend({}, this.options, $(this.element).data()),
                modal = $(this.render(options.template, options)),
                callback = this.callback;
                
            modal.find("#" + options.id + "Actions").children().each(function( i, el ) {
                $(el).on("click", options.actions[i].onclick);
            });
            
            if ($("#" + options.id).length > 0) {
                if($("#" + options.id)[0] !== modal[0]) {
                    $("#" + options.id).replaceWith(modal);
                }
            } 
            else {
                $("body").append(modal);
            }
            
            $("#" + options.id).modal("show");
            
            $("#" + options.id).on("shown.bs.modal", function () {
                $("#" + options.id + " :input:enabled:visible:not([readonly],.close):first").focus();
                if(typeof(callback) === "function") {
                    callback();
                }
            });
        },
        destroy: function() {
            var options = $.extend({}, this.options, $(this.element).data());
            
            $("#" + options.id)
                .modal("hide")
                .on("hidden.bs.modal", function () {
                    $("#" + options.id).remove();
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
    
    $.fn[ pluginName ] = function ( options, callback ) {
        return this.each(function() {
            //if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options, callback ) );
            //}
        });
    };
}));
