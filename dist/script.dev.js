"use strict";

var circle = document.getElementById('circle');
var sleeve = document.getElementById('sleeve');
var toggle = document.querySelector('.toggle');
var isShowSleeve = true;
toggle.addEventListener('click', function () {
  var isShow = window.getComputedStyle(sleeve, null).display === 'block';

  if (isShow) {
    sleeve.style.display = "none";
    isShowSleeve = false;
  } else {
    sleeve.style.display = "block";
    isShowSleeve = true;
  }
});

function getCurrentAngle() {
  var circleStyle = window.getComputedStyle(circle);
  var tm = circleStyle.getPropertyValue('transform');
  var values = tm.split('(')[1].split(')')[0].split(',');
  var radians = Math.atan2(values[1], values[0]);

  if (radians < 0) {
    radians += 2 * Math.PI;
  }

  return Math.round(radians * (180 / Math.PI));
}

function getBreakpoint(angle) {
  var remainder = angle % 30;
  var angleToAdd = remainder;
  if (remainder === 0) return angle;

  if (remainder >= 15) {
    angleToAdd = 30 - remainder;
    return angle + angleToAdd;
  }

  if (remainder < 15) {
    return angle - remainder;
  }
}

(function () {
  var init,
      rotate,
      start,
      stop,
      active = false,
      clickedNoteEvent,
      timer,
      angle = 0,
      rotation = 0,
      startAngle = 0,
      center = {
    x: 0,
    y: 0
  },
      R2D = 180 / Math.PI,
      rot = circle;

  init = function init() {
    sleeve.addEventListener("mousedown", start, false);
    circle.addEventListener("mousedown", start, false);
    sleeve.addEventListener('touchstart', startMobile, false);
    document.addEventListener('mousemove', function (event) {
      if (active === true) {
        event.preventDefault();
        rotate(event);
      }
    });
    document.addEventListener('touchmove', function (event) {
      if (active === true) {
        event.preventDefault();
        rotate(event);
      }
    });
    document.addEventListener('mouseup', function (event) {
      event.preventDefault();

      if (active) {
        stop(event);
      } else {
        clickedNoteEvent && clickedNoteEvent.target.className === 'circle-item' && hadndleClick(clickedNoteEvent);
      }

      clickedNoteEvent = undefined;
      active = false;
      clearTimeout(timer);
    });
    document.addEventListener('touchend', function (event) {
      event.preventDefault();

      if (active) {
        stop(event);
      } else {
        clickedNoteEvent && clickedNoteEvent.target.className === 'circle-item' && hadndleClick(clickedNoteEvent);
      }

      clickedNoteEvent = undefined;
      active = false;
      clearTimeout(timer);
    });
  };

  startMobile = function startMobile(e) {
    var _this = this;

    e.preventDefault();
    rot.style.transition = null;

    if (e.target.id === 'sleeve') {
      var bb = this.getBoundingClientRect(),
          touchLocation = e.targetTouches[0],
          t = bb.top,
          l = bb.left,
          h = bb.height,
          w = bb.width,
          x,
          y;
      center = {
        x: l + w / 2,
        y: t + h / 2
      };
      x = touchLocation.pageX - center.x;
      y = touchLocation.pageY - center.y;
      startAngle = R2D * Math.atan2(y, x);
      active = true;
      return;
    }

    timer = setTimeout(function () {
      var bb = _this.getBoundingClientRect(),
          touchLocation = e.targetTouches[0],
          t = bb.top,
          l = bb.left,
          h = bb.height,
          w = bb.width,
          x,
          y;

      center = {
        x: l + w / 2,
        y: t + h / 2
      };
      x = touchLocation.pageX - center.x;
      y = touchLocation.pageY - center.y;
      startAngle = R2D * Math.atan2(y, x);
      active = true;
    }, 150);
    if (e.target.className === 'circle-item') clickedNoteEvent = e;
  };

  start = function start(e) {
    var _this2 = this;

    e.preventDefault();
    rot.style.transition = null;

    if (e.target.id === 'sleeve') {
      var bb = this.getBoundingClientRect(),
          t = bb.top,
          l = bb.left,
          h = bb.height,
          w = bb.width,
          x,
          y;
      center = {
        x: l + w / 2,
        y: t + h / 2
      };
      x = e.clientX - center.x;
      y = e.clientY - center.y;
      startAngle = R2D * Math.atan2(y, x);
      active = true;
      return;
    }

    timer = setTimeout(function () {
      var bb = _this2.getBoundingClientRect(),
          t = bb.top,
          l = bb.left,
          h = bb.height,
          w = bb.width,
          x,
          y;

      center = {
        x: l + w / 2,
        y: t + h / 2
      };
      x = e.clientX - center.x;
      y = e.clientY - center.y;
      startAngle = R2D * Math.atan2(y, x);
      active = true;
    }, 150);
    if (e.target.className === 'circle-item') clickedNoteEvent = e;
  };

  rotate = function rotate(e) {
    e.preventDefault();
    var x = e.clientX - center.x,
        y = e.clientY - center.y,
        d = R2D * Math.atan2(y, x);
    rotation = d - startAngle;
    return rot.style.webkitTransform = "rotate(" + (angle + rotation) + "deg)";
  };

  hadndleClick = function hadndleClick(e) {
    var coefficient = Number(e.target.dataset.number);
    var result = 90 - coefficient * 30;
    setTimeout(function () {
      rot.style.transform = "rotate(" + result + "deg)";
      rot.style.transition = '.3s ease';
    }, [100]);
  };

  stop = function stop() {
    var result = angle + rotation;
    var added_angle = getBreakpoint(result);
    angle = result;
    setTimeout(function () {
      rot.style.webkitTransform = "rotate(" + added_angle + "deg)";
      rot.style.transition = '.3s ease';
    }, [500]);
    rotation = 0;
    startAngle = 0;
    center = {
      x: 0,
      y: 0
    };
    return active = false;
  };

  init();
}).call(void 0); //qq