/*
A Javascript based Pie Menu implementation by Can Duruk. 

Backed by JQuery for cross-browser compatability and general ease of use.

Allows easy creation of pie menus in HTML. All the user has to do is assign
classes to item elements; the list from which the menu will be generated and 
the link that will toggle the menu itself.

Also allows creating pie menus out of pie menus.

The plugin works with almost no configuration but it is extremely extensible.
The user can extend anything from the HTML markup or just using other
parameters for every single option.-

*/

//Start closure
(function($) {

  $(document).ready(function(options) {

    //Default tags and DOM element IDs with which plugin can be used. These
    //can be manipulated from HTML markup via metadata plugin
    var defaults = {
      menuClass: ".PieMenu",
      menuStarterClass: ".MenuStarter",
      menuItemTag: "li",
      menuSubClass: "Sub",
      itemWidth: 70
    };

    //extend the defaults by user entered values
    var opts = $.extend(defaults, options);
    
    //Support the MetaData plugin
    var opts_final = $.meta ? $.extend({}, opts, $this.data()) : opts;

    //hide the menu first
    toggleMenus(opts_final);
    
    //Catch the user click
    $(opts_final.menuStarterClass).click(function(e){
      
      //hide the sub-menu if it is visible
      $(opts_final.menuClass+opts_final.menuSubClass).css({display:"none"});
      
      //Get the mouse coordinates
      var options = {
        xPos: e.pageX,
        yPos: e.pageY,
        
        //pass this along for good measure but really needs to die
        menuClass: opts.menuClass
      };

      $(opts_final.menuClass+">"+opts_final.menuItemTag).piemenu(options);
    });//end user click option
    
    //catch the click for the sub menu
    $(opts_final.menuStarterClass+opts_final.menuSubClass).click(function(e){
      toggleMenus(opts_final);
      var sub_options = {
        xPos: e.pageX,
        yPos: e.pageY,
        
        //pass this along for good measure but really needs to die
        menuClass: "opts_final.menuClass+opts_final.menuSubClass"
      };
      
      $(  opts_final.menuClass+opts_final.menuSubClass
        + ">"
        + opts_final.menuItemTag).piemenu(sub_options);
    });
  
    //Generic method for creating Pie Menus
    $.fn.piemenu = function(options){

      //default values for the Pie Menu
      var defaults = {
        size: $(this).size(),
        step: 0,
        rotation: 0,
        radius: 0,
        itemWidth: 30
      };

      //extend the defaults by user entered values
      var opts = $.extend(defaults, options);

      $(opts.menuClass).toggle();

      //get the x and y positions of the mouse from the passed parameters
      var _xPos = options.xPos;
      var _yPos = options.yPos; 

      //Calculations for the menu itself
      var _size = opts.size;
      var _step = (2.0 * Math.PI) / (1.0 * (_size));
      var _rotation = (0.5) * Math.PI;
      var _radius = Math.sqrt(opts.itemWidth) * Math.sqrt(_size) * 2.5;

      $(this).each(function(_i){
        var parameters = {
          xPos: _xPos,
          yPos: _yPos,
          i: _i,
          size: _size,
          step: _step,
          rotation: _rotation,
          radius: _radius,
          itemWidth: opts.itemWidth
        };
        var styles = $.fn.piemenu.leaf(parameters);
        
        $(this).css(styles);
        
        //Only Firefox shows borders around linked images. This is
        //an area of contoversy; to see the discussion around this, visit
        //<https://bugzilla.mozilla.org/show_bug.cgi?id=452915>
        hideImageBorders($(this));
        
      });
    };
    
    //private function for hiding img borders for links
    function hideImageBorders($obj){
      $obj.find("img").each(function(){
        $(this).css({
          border:"none"
        });
      });
    };
    
    //private function for toggling the menu and the sub menu
    function toggleMenus(options){
      $(options.menuClass).toggle();
      $(options.menuClass+options.menuSubClass).toggle();
    };
    
    //Generic method for creating Pie Menu elements.
    $.fn.piemenu.leaf = function(options){
      
      //default values for the pie menu leafs
      var defaults = {
        i:0,
        textDecoration: "none"
      };

      //extend the defaults if necessary
      var opts = $.extend(defaults, options);

      //calculation for the location of leaf items
      var angle = opts.i*opts.step - opts.rotation;
      var x = Math.cos(angle) * opts.radius - (opts.itemWidth / 2);
      var y = Math.sin(angle) * opts.radius - (opts.itemWidth / 2);
      var xCor = opts.xPos + Math.round(x) + "px";
      var yCor = opts.yPos + Math.round(y) + "px";

      //return a CSS object
      return {
        position: "absolute",
        display:  "block",
        
        //maybe user wants text decoration?
        textDecoration: opts.textDecoration,
        left: xCor,
        top: yCor
      };
    };
  }); 
  
  //end closure
})(jQuery);
