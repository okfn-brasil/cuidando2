define(["jquery"], function ($) {

  'use strict';

  // ****************************************************
  //                 SUPER STYLED SELECT
  // ****************************************************
  /* Usage:

      var superSelect = new SuperSelect(element);
  */

  // Keys values
  var ENTER = 13;
  var SPACE = 32;
  var ESC = 27;
  var DOWN = 40;
  var UP = 38;

  var SuperSelect = function() { this.init && this.init.apply(this, arguments); };

  SuperSelect.prototype = {
    init: function(el) {
      this.eventDispatcher = $({});
      this.$el = $(el);
      this.createElements();
      this.handleEvents();
      return this;
    },

    destroy: function() {
      this.eventDispatcher.unbind();
    },

    createElements: function() {
      // Cache the number of options
      this.numberOfOptions = this.$el.children('option').length;

      // Hides the select element
      this.$el.addClass('s-hidden');

      // Wrap the select element in a div
      this.$el.wrap('<div class="super-select"></div>');

      // Insert a styled div to sit over the top of the hidden select element
      this.$el.after('<div class="super-styled-select" role="listbox" tabindex="0"></div>');

      // Cache the styled div
      this.$styledSelect = this.$el.next('div.super-styled-select');

      // Insert an unordered list after the styled div and also cache the list
      this.$list = $('<ul />', {
        'class': 'super-options'
      }).insertAfter(this.$styledSelect).hide();

      // Insert a list item into the unordered list for each select option
      for (var i = 0; i < this.numberOfOptions; i++) {
        $('<li />', {
          'text': this.$el.children('option').eq(i).text(),
          'rel':  this.$el.children('option').eq(i).val(),
          'role': 'option',
          'tabindex': '-1'
        }).appendTo(this.$list);
      }

      // Cache the list items
      this.$listItems = this.$list.children('li');
      this.setValue(this.$el.val());

      return this;
    },

    handleEvents: function() {
      var _this = this;

      // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
      this.$styledSelect.click(function(e) {
        e.stopPropagation();
        _this.open();
      });

      // Hides the unordered list when clicking outside of it
      $(document).click(function(e) {
        _this.close();
      });

      // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
      // Updates the select element to have the value of the equivalent option
      this.$listItems.click(function(e) {
        e.stopPropagation();
        _this.setValue($(this).attr('rel'));
        _this.close();
        _this.triggerChange();
      });

      // Toggle the unordered list when the styled div is focused and user presses ENTER or SPACE
      // or change the selected item when user presses UP or DOWN
      this.$styledSelect.keydown(function(e) {
        e.stopPropagation();

        switch (e.which) {
          case ENTER:
          case SPACE:
            // Toggle the items list
            e.preventDefault();
            _this.toggle();
            break;
          case UP:
          case DOWN:
            // Navigate
            e.preventDefault();
            var index = _this.$listItems.index(_this.$selectedListItem);
            if (e.which == DOWN && index < _this.$listItems.length - 1) index++;
            if (e.which == UP && index > 0) index--;

            _this.$selectedListItem = _this.$listItems.eq(index);
            _this.update();

            _this.triggerChange();
            break;
        };
      });

      // Navigate through the list items
      this.$listItems.keydown(function(e) {
        e.stopPropagation();

        switch (e.which) {
          case ENTER:
          case SPACE:
            _this.triggerChange();
          case ESC:
            e.preventDefault();
            _this.close();
            _this.$styledSelect.focus();
            break;
          case UP:
          case DOWN:
            e.preventDefault();
            var index = _this.$listItems.index(_this.$selectedListItem);
            if (e.which == DOWN && index < _this.$listItems.length - 1) index++;
            if (e.which == UP && index > 0) index--;

            _this.$selectedListItem = _this.$listItems.eq(index);
            _this.update();
            _this.$selectedListItem.focus();

            break;
        };
      });

      return this;
    },

    on: function() {
      this.eventDispatcher.on.apply(this.eventDispatcher, arguments);
      return this;
    },

    off: function() {
      this.eventDispatcher.off.apply(this.eventDispatcher, arguments);
      return this;
    },

    trigger: function() {
      this.eventDispatcher.trigger.apply(this.eventDispatcher, arguments);
      return this;
    },

    open: function() {
      this.$styledSelect.toggleClass('active').next('ul.super-options').show();
      this.$styledSelect.attr('aria-expanded', true);
      this.$selectedListItem.focus();
      return this;
    },

    close: function() {
      this.$styledSelect.removeClass('active');
      this.$styledSelect.attr('aria-expanded', false);
      this.$list.hide();
      return this;
    },

    toggle: function() {
      if (this.$styledSelect.hasClass('active')) {
        this.close.apply(this, arguments);
      } else {
        this.open.apply(this, arguments)
      }
      return this;
    },

    triggerChange: function() {
      this.trigger('change', this.getValue());
      return this;
    },

    update: function() {
      this.$listItems.removeClass('selected').removeAttr('aria-selected');
      this.$selectedListItem.addClass('selected').attr('aria-selected', true);
      this.$styledSelect.text(this.$selectedListItem.text());
      this.$el.val(this.getValue());
      return this;
    },

    setValue: function(value) {
      this.$selectedListItem = this.$listItems.filter(function() {
        return $(this).attr('rel') == value;
      });
      this.update();
      return this;
    },

    getValue: function() {
      return this.$selectedListItem.attr('rel');
    }
  };

  return SuperSelect;
});
