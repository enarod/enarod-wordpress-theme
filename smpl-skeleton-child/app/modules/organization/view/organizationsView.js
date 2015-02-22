define(function(require){
  'use strict';
  var $	= require('jquery'),
      _		= require('underscore'),
      Backbone= require('backbone'),
      OrganizationView	= require ('module/organization/view/organizationView');
  return Backbone.View.extend({
    className: 'organization-item',
    initialize: function( options ){
      this.organizations = options.organizations;
      this.organizationsViewList = [];
      this.listenTo(this.organizations, 'sync', this.render);
    },
    render: function(){
      if ( this.organizations.length == 0 ){
        alert('Організацій-партнерів не знайдено.');
      }else{
        var parentView = this.parentView;
        this.organizations.each(function(organization){
          var item = new OrganizationView ({ tmpl: 'item', model: organization });
          item.parentView = parentView;
          item.render();
          this.organizationsViewList.push(item);
        }, this);
      }
    },
    remove: function(){
      _.each( this.organizationsViewList, function (organization){
        organization.remove();
      });
    },
    unbind: function(){
      _.each( this.organizationsViewList, function (organization){
        organization.unbind();
      });
      this.organizationsViewList = [];
    }
  });
});

