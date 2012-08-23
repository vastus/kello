// Generated by CoffeeScript 1.3.3
(function() {
  var Kello, Logic, kello, logic,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Kello = (function() {

    function Kello() {
      this.date = new Date();
      this.start = this.date.getTime();
      this.hours = 0;
      this.mins = 0;
      this.secs = 0;
      this.times = ['hours', 'mins', 'secs'];
      this.kaynnista();
    }

    Kello.prototype.toString = function() {
      return "" + (this.getHours()) + ":" + (this.getMins()) + ":" + (this.getSecs());
    };

    Kello.prototype.kaynnista = function() {
      return console.log("Kello käynnistetty");
    };

    Kello.prototype.getHours = function() {
      return this.padWithZeros(this.getDate().getUTCHours());
    };

    Kello.prototype.getMins = function() {
      return this.padWithZeros(this.getDate().getUTCMinutes());
    };

    Kello.prototype.getSecs = function() {
      return this.padWithZeros(this.getDate().getUTCSeconds());
    };

    Kello.prototype.get = function(time) {
      switch (time) {
        case 'hours':
          return this.getHours();
        case 'mins':
          return this.getMins();
        case 'secs':
          return this.getSecs();
        default:
          throw new TypeError("Time must be one of [" + this.times + "], not " + time);
      }
    };

    Kello.prototype.padWithZeros = function(num) {
      if (num < 10) {
        num = "0" + num;
      }
      return num;
    };

    Kello.prototype.getDate = function() {
      var erotus;
      erotus = new Date().getTime() - this.start;
      return new Date(erotus);
    };

    return Kello;

  })();

  Logic = (function() {

    function Logic() {
      this.states = ["normal", "adjust"];
      this.modes = ["clock", "counter", "timer"];
      this.adjustables = ["clock", "timer"];
      this.init();
    }

    Logic.prototype.init = function() {
      this.state = "normal";
      return console.log(this.toString());
    };

    Logic.prototype.curState = function(state) {
      if (state != null) {
        return state === this.state;
      }
      return this.state;
    };

    Logic.prototype.changeState = function(state) {
      if (__indexOf.call(this.states, state) < 0) {
        throw new TypeError("State must be one of: [" + this.states + "], not " + state);
      }
      return this.state = state;
    };

    Logic.prototype.curMode = function() {
      return this.modes[0];
    };

    Logic.prototype.changeMode = function() {
      var mode;
      mode = this.modes.shift();
      this.modes.push(mode);
      console.log(this.toString());
      return mode;
    };

    Logic.prototype.adjust = function() {
      var _ref;
      if ((_ref = this.curMode(), __indexOf.call(this.adjustables, _ref) >= 0)) {
        this.changeState('adjust');
        return console.log("Adjusting: " + (this.curMode()));
      } else {
        return console.log("Mode [" + (this.curMode()) + "] is not adjustable");
      }
    };

    Logic.prototype.toString = function() {
      return "In mode: [" + (this.curMode()) + "]";
    };

    return Logic;

  })();

  kello = new Kello();

  logic = new Logic();

  jQuery(function() {
    var adjust, adjustTimeout, changeMode, changeState, clock, enterBtn, mode, modeBtn, runClock, setStatus, start, updateClockProperty, updateHours, updateMins, updateSecs;
    mode = $('#mode');
    modeBtn = $('#modeBtn');
    enterBtn = $('#enterBtn');
    start = 0;
    adjustTimeout = setTimeout;
    clock = {
      running: false,
      hours: {
        interval: setInterval,
        updateValue: 60 * 60 * 1000,
        prev: 0,
        elem: $('#hours')
      },
      mins: {
        interval: setInterval,
        updateValue: 60 * 1000,
        prev: 0,
        elem: $('#mins')
      },
      secs: {
        interval: setInterval,
        updateValue: 1000,
        prev: 0,
        elem: $('#secs')
      },
      freeze: function() {
        var interval, intervals, _i, _len, _results;
        intervals = [this.secs.interval, this.mins.interval, this.hours.interval];
        _results = [];
        for (_i = 0, _len = intervals.length; _i < _len; _i++) {
          interval = intervals[_i];
          _results.push(clearInterval(interval));
        }
        return _results;
      },
      resume: function() {}
    };
    setStatus = function(opt) {
      if (opt) {
        return mode.html(logic.curMode().toUpperCase() + " - " + logic.curState());
      } else {
        return mode.html(logic.curMode().toUpperCase());
      }
    };
    changeMode = function() {
      logic.changeMode();
      return setStatus();
    };
    adjust = function() {
      logic.adjust();
      return setStatus(1);
    };
    changeState = function() {
      logic.changeState('normal');
      return setStatus();
    };
    modeBtn.mousedown(function() {
      start = new Date().getTime();
      return adjustTimeout = setTimeout((function() {
        return adjust();
      }), 2000);
    });
    modeBtn.mouseup(function() {
      var erotus;
      clearTimeout(adjustTimeout);
      erotus = new Date().getTime() - start;
      if (erotus < 2000) {
        if (logic.curState('normal')) {
          return changeMode();
        }
      }
    });
    enterBtn.click(function() {
      if (logic.curState('adjust')) {
        return changeState('normal');
      }
    });
    updateClockProperty = function(property, elem) {
      return clock[property].interval = setInterval((function() {
        var num;
        num = kello.get(property);
        clock[property].elem.html(num);
        return clock[property].prev = num;
      }), clock[property].updateValue);
    };
    updateHours = function() {
      return updateClockProperty('hours');
    };
    updateMins = function() {
      return updateClockProperty('mins');
    };
    updateSecs = function() {
      return updateClockProperty('secs');
    };
    runClock = function() {
      updateSecs();
      updateMins();
      return updateHours();
    };
    setStatus();
    runClock();
    setTimeout((function() {
      return clock.freeze();
    }), 6000);
    return setTimeout((function() {
      return clock.resume();
    }), 12000);
  });

}).call(this);
