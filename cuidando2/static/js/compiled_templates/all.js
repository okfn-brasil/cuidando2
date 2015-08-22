define(['handlebars.runtime'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['comment-edit'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<form class=\"form-inline\">\n    <div class=\"form-group\">\n        <label class=\"sr-only\" for=\"comment-textarea\">Edit Comment</label>\n        <textarea id=\"comment-edit-textarea-"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"form-control\" rows=\"3\">"
    + alias3(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</textarea>\n    </div>\n<button id=\"comment-edit-send-button-"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-comment-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" type=\"submit\" class=\"btn btn-default\">Enviar</button>\n</form>\n";
},"useData":true});
templates['charts'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <tr>\n                <th>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</th>\n                <td>"
    + alias3(((helper = (helper = helpers.mapped || (depth0 != null ? depth0.mapped : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"mapped","hash":{},"data":data}) : helper)))
    + "</td>\n                <td>"
    + alias3(((helper = (helper = helpers.unmapped || (depth0 != null ? depth0.unmapped : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"unmapped","hash":{},"data":data}) : helper)))
    + "</td>\n                <td>"
    + alias3(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"total","hash":{},"data":data}) : helper)))
    + "</td>\n                <td>"
    + alias3(((helper = (helper = helpers.percentage || (depth0 != null ? depth0.percentage : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"percentage","hash":{},"data":data}) : helper)))
    + "</td>\n            </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"col-md-6\">\n    <div id=\"chart-rows-container\"></div>\n    <table id=\"rows-table\" class=\"interface-component table\">\n        <thead>\n            <tr>\n                <th></th>\n                <th>mapeado</th>\n                <th>regionalizado</th>\n                <th>total</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <th>linhas</th>\n                <td>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.rows : depth0)) != null ? stack1.mapped : stack1), depth0))
    + "</td>\n                <td>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.rows : depth0)) != null ? stack1.region : stack1), depth0))
    + "</td>\n                <td>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.rows : depth0)) != null ? stack1.total : stack1), depth0))
    + "</td>\n            </tr>\n            <tr>\n                <th>porcentagem</th>\n                <td>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.rows : depth0)) != null ? stack1['mapped-per'] : stack1), depth0))
    + "</td>\n                <td>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.rows : depth0)) != null ? stack1['mapped-per'] : stack1), depth0))
    + "</td>\n                <td>100</td>\n            </tr>\n        </tbody>\n    </table>\n</div>\n\n\n<div class=\"col-md-6\">\n    <div id=\"chart-values-container\"></div>\n    <table id=\"values-table\" class=\"interface-component table\">\n        <thead>\n            <tr>\n                <th></th>\n                <th>mapeado</th>\n                <th>não mapeado</th>\n                <!-- <th>regionalizado</th> -->\n                <th>total</th>\n                <th>mapped %</th>\n            </tr>\n        </thead>\n        <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.values : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tbody>\n    </table>\n</div>\n";
},"useData":true});
templates['comments-list'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <div class=\"panel panel-default\">\n        <div id=\"comment-body-"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"panel-body\">"
    + alias3(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</div>\n        <div class=\"panel-footer\">\n            <a href=\"/#pessoa/"
    + alias3(((helper = (helper = helpers.author || (depth0 != null ? depth0.author : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"author","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.author || (depth0 != null ? depth0.author : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"author","hash":{},"data":data}) : helper)))
    + "</a>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.userIsAuthor : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.userNotAuthor : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            <span>Gostaram: "
    + alias3(((helper = (helper = helpers.likes || (depth0 != null ? depth0.likes : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"likes","hash":{},"data":data}) : helper)))
    + "</span>\n            <span>Não gostaram: "
    + alias3(((helper = (helper = helpers.dislikes || (depth0 != null ? depth0.dislikes : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"dislikes","hash":{},"data":data}) : helper)))
    + "</span>\n            <span>Criado: "
    + alias3(((helper = (helper = helpers.created || (depth0 != null ? depth0.created : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"created","hash":{},"data":data}) : helper)))
    + "</span>\n            <span>Modificado: "
    + alias3(((helper = (helper = helpers.modified || (depth0 != null ? depth0.modified : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"modified","hash":{},"data":data}) : helper)))
    + "</span>\n        </div>\n    </div>\n";
},"2":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <button data-comment-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-default delete-comment-button\">Deletar</button>\n                <button id=\"comment-edit-button-"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-comment-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-default edit-comment-button\">Editar</button>\n                <button id=\"comment-edit-cancel-button-"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-comment-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-default edit-comment-cancel-button probably-hidden\">Cancelar</button>\n";
},"4":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <button data-comment-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-default like-comment-button\">+1</button>\n                <button data-comment-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-default dislike-comment-button\">-1</button>\n                <button data-comment-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-default report-comment-button\">Denunciar</button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.comments : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"useData":true});
templates['pedido'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<select id=\"orgao-selector\" class=\"center-block text-center interface-component\"></select>\n\n<form class=\"form-inline interface-component\">\n    <div class=\"form-group\">\n        <label class=\"sr-only\" for=\"pedido-textarea\">Pedido</label>\n        <textarea id=\"pedido-textarea\" class=\"form-control\" rows=\"3\" placeholder=\"Pedido!!!\"></textarea>\n    </div>\n<button id=\"pedido-send-button\" type=\"submit\" class=\"btn btn-default\">Pedir</button>\n</form>\n\n";
},"useData":true});
templates['user'] = template({"1":function(depth0,helpers,partials,data) {
    return "    <form class=\"form-inline\">\n    <div class=\"form-group\">\n        <label class=\"sr-only\" for=\"descr-form-update\">Descrição</label>\n        <textarea id=\"user-form-textarea\" placeholder=\"Descrição\" class=\"form-control\" rows=\"3\"></textarea>\n    </div>\n    <button id=\"descr-form-update-button\" type=\"submit\" class=\"btn btn-default\">Update</button>\n    </form>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return " -->\n<!--   <dt> -->\n<!--     "
    + alias3(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + " -->\n<!--   </dt> -->\n<!--   <dd> -->\n<!--     "
    + alias3(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"value","hash":{},"data":data}) : helper)))
    + " -->\n<!--   </dd> -->\n<!-- ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<h2>"
    + alias3(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"username","hash":{},"data":data}) : helper)))
    + "</h2>\n<p>"
    + alias3(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "</p>\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.possibleEdit : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n\n<!-- <dl> -->\n<!-- "
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.fields : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " -->\n<!-- <dl> -->\n";
},"useData":true});
templates['comments'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"comments-list-container\">\n"
    + ((stack1 = this.invokePartial(partials['comments-list'],depth0,{"name":"comments-list","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "</div>\n\n<form class=\"form-inline\">\n    <div class=\"form-group\">\n        <label class=\"sr-only\" for=\"comment-textarea\">Comment</label>\n        <textarea id=\"comment-textarea\" class=\"form-control\" rows=\"3\" placeholder=\"Comentario!!!\"></textarea>\n    </div>\n<button id=\"comment-send-button\" type=\"submit\" class=\"btn btn-default\">Comentar</button>\n</form>\n\n";
},"usePartial":true,"useData":true});
return templates;
});;