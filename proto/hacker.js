// hacker 'class'
var Hacker = function(room, hackers, options) {
  var self = this;
  this.id = hackers.length;
  this.room = room;
  // options
  if(!options) options = {};
  this.x = safe_x(options.x || 50);
  this.y = safe_y(options.y || 50);
  
  // attrs
  this.avatar = false;
  this.idling = false; // used for global animation
  
  draw_avatar();
  wire_events();
  
  // internal functions
  //
  function safe_x(x) {
    var r = Hacker.radius + 5;
    var rm = room;
    var newx = x;
    if (x + r > rm.width){ newx = x - r }
    if (x - r <= 0){ newx = x + r }
    return newx;
  };
  
  function safe_y(y) {
    var r = Hacker.radius + 5;
    var rm = room;
    var newy = y;
    if (y + r > rm.height){ newy = y - r }
    if (y - r <= 0){ newy = y + r }
    return newy;
  };
  
  function draw_avatar() {
    var av = self.avatar = room.circle(self.x, self.y, Hacker.radius);
    av.attr({fill: "#eee", "fill-opacity": 0, stroke: "#fff", "stroke-width": 2, "stroke-opacity": 0});
    return self.avatar;
  };
  
  function wire_events() {
    self.avatar.click(function(e){
      self.poke();
    });
  };
}

Hacker.radius = 10;
Hacker.opacity = 0.5;

Hacker.prototype.is_point_inside = function(x, y) {
  cx = this.x;
  cy = this.y;
  return ((x - cx) * (x - cx) + (y - cy) * (y - cy)) < Hacker.radius * Hacker.radius;
};

Hacker.prototype.arrive = function() {
  console.log('> new hacker arriving! (' + this.id + ')');
  var self = this;
  var av = self.avatar;
  av.animate({"fill-opacity": Hacker.opacity, "stroke-opacity": Hacker.opacity}, 1500);
  return self.avatar;
};

Hacker.prototype.poke = function() {
  console.log('> poked hacker ' + this.id + ' ...');
  var self = this;
  var av = self.avatar;
  av.toFront();
  self.living = false;
  av.animate({r: 30, "fill-opacity": 1}, 300, function(){ av.animate({r: Hacker.radius, "fill-opacity": Hacker.opacity}, 1500, "backOut"); self.living = true;});
};

Hacker.prototype.update = function() {
  var self = this;
  var av = self.avatar;
  var xshift = Math.floor(Math.random() * 41)-21
  var yshift = Math.floor(Math.random() * 41)-21
  
  // idling is the little movement all the hackers do ... quivering with anticipation!
  if (!self.idling) {
    randx = Math.random()*4;
    randy = Math.random()*4;
    randa = 2000 - Math.random()*500; // randomize the animation time
    self.idling = true;
    av.animate({cy: randy + self.y, cx: randx + self.x, easing: '<>'}, randa, function(){self.idling = false;});

    for (i = 0; i < hackers.length; i++) {
      h = hackers[i];
      if (self.is_point_inside(h.x, h.y) && h.id != self.id) {
        console.log('>> the center of ' + self.id + ' is inside ' + h.id + ' - shifting ' + xshift + ' ' + yshift);
        self.x = self.x + xshift;
        self.y = self.y + yshift;
      }
    }
  }
  
  
};
