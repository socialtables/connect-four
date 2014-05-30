/**
 * Custom bindings to KnockoutJS to make the Connect Four game better / easier
 * to build.
 */

/**
 * Fade elements in and out of visibility when bound data changes.
 *
 * Improve on the starkness of the `visible` binding. Based on the `slideVisible`
 * example in the Knockout docs.
 */
ko.bindingHandlers.fadeVisible = {
    // if the item becomes visible / invisible, slide it in and out of view
    // using jQuery
    init: function(element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        $(element).toggle(value);
    },
    update: function(element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());

        if (value) {
            $(element).fadeIn("fast");
        } else {
            $(element).fadeOut("fast");
        }
    }
};

/**
 * Provide row and column class labels for individual cells in the Connect
 * Four grid.
 *
 * Potentially useful for things like highlighting a row or column, or animating
 * some aspect of gameplay (like dropping a piece in).
 */
ko.bindingHandlers.rowColumnClasses = {
    init: function (element, valueAccessor) {
        var cell = ko.unwrap(valueAccessor()),
            col = cell.x,
            row = cell.y;
        ko.utils.toggleDomNodeCssClass(element, "row-" + row.toString(), true);
        ko.utils.toggleDomNodeCssClass(element, "col-" + col.toString(), true);
    }
};

ko.bindingHandlers.glow = {
  init: function(element, valueAccessor) {
    return false;
  },
  update: function(element, valueAccessor) {
    var value = ko.unwrap(valueAccessor()),
        $element = $(element);

    if (value) {
      $element.addClass('hint');
    }
    else $element.removeClass('hint');
  }
};
