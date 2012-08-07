(function($){
  if(!window.Redu)
    Redu = {};

  Redu.Canvas = function(options){
    var canvas = this;
    this.config = this.utils.extend({
      width : 720,
      height : 1000,
      logger : function(msg){ }
    }, options);
    this.logger = this.config.logger;
    if(this.canvasEnabled()){
      this.socket = new easyXDM.Socket({
        onReady : function(){
          var message = canvas.prepareMessage("resize", {
            width : canvas.config.width,
              height: canvas.config.height
          });
          canvas.logger(message);
          canvas.socket.postMessage(message);
        }
      });
    }
  }

  Redu.Canvas.prototype.version = "0.1";
  Redu.Canvas.prototype.utils = {};
  Redu.Canvas.prototype.utils.extend = function(target, extensions){
    for (var property in extensions) {
      if (extensions[property] && extensions[property].constructor &&
        extensions[property].constructor === Object) {
          target[property] = extend(target[property] || {}, extensions[property]);
        } else {
          target[property] = extensions[property];
        }
    }
    return target;
  }
  Redu.Canvas.prototype.prepareMessage = function(e, payload) {
    var canvas = this;
    var message = {
      "event" : "resize"
      , "payload" : {
        width : payload.width,
        height : payload.height
      }
      , "version" : canvas.version
    }

    return JSON.stringify(message);
  }
  Redu.Canvas.prototype.canvasEnabled = function(){
    var uri = this.parseUri(document.URL);
    uri['queryKey']['xdm_e'] !== undefined;
  }

  Redu.Canvas.prototype.parseUri = function(str) {
    var options = {
      strictMode: false,
      key: ["source","protocol","authority","userInfo","user","password",
      "host","port","relative","path","directory","file","query","anchor"],
      q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };

    var	o   = options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
  }



})(jQuery);
