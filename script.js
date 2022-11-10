const circle = document.getElementById('circle');
const sleeve = document.getElementById('sleeve');
const toggle = document.querySelector('.toggle');
let isShowSleeve = true

toggle.addEventListener('click', () => {
  const isShow = window.getComputedStyle(sleeve, null).display === 'block'
  if (isShow) {
    sleeve.style.display = "none"
    isShowSleeve = false
  } else {
    sleeve.style.display = "block"
    isShowSleeve = true
  }
})

function getCurrentAngle() {
  const circleStyle = window.getComputedStyle(circle);
  const tm = circleStyle.getPropertyValue('transform');
  let values = tm.split('(')[1].split(')')[0].split(',');

  let radians = Math.atan2(values[1], values[0]);
  if (radians < 0) {
    radians += 2 * Math.PI;
  }
  return Math.round(radians * (180 / Math.PI));
}

function getBreakpoint(angle) {
  const remainder = angle % 30
  let angleToAdd = remainder
  if (remainder === 0) return angle

  if (remainder >= 15) {
    angleToAdd = 30 - remainder
    return angle + angleToAdd
  }

  if (remainder < 15) {
    return angle - remainder
  }
}

(function () {
  var init, rotate, start, stop,
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
    rot = circle

  init = function () {
    sleeve.addEventListener("mousedown", start, false);
    circle.addEventListener("mousedown", start, false);
    document.addEventListener('mousemove', function (event) {
      if (active === true) {
        event.preventDefault();
        rotate(event);
      }
    });
    document.addEventListener('mouseup', function (event) {
      event.preventDefault();
      if (active) {
        stop(event)
      } else {
        clickedNoteEvent && clickedNoteEvent.target.className === 'circle-item' && hadndleClick(clickedNoteEvent)
      }

      clickedNoteEvent = undefined
      active = false
      clearTimeout(timer)

    });
  };

  start = function (e) {
    e.preventDefault();
    rot.style.transition = null

    if (e.target.id === 'sleeve') {
      var bb = this.getBoundingClientRect(),
        t = bb.top,
        l = bb.left,
        h = bb.height,
        w = bb.width,
        x, y;
      center = {
        x: l + (w / 2),
        y: t + (h / 2)
      };
      x = e.clientX - center.x;
      y = e.clientY - center.y;
      startAngle = R2D * Math.atan2(y, x);
      active = true
      return
    }

    timer = setTimeout(() => {
      var bb = this.getBoundingClientRect(),
        t = bb.top,
        l = bb.left,
        h = bb.height,
        w = bb.width,
        x, y;
      center = {
        x: l + (w / 2),
        y: t + (h / 2)
      };
      x = e.clientX - center.x;
      y = e.clientY - center.y;
      startAngle = R2D * Math.atan2(y, x);
      active = true
    }, 150)

    if (e.target.className === 'circle-item') clickedNoteEvent = e
  };

  rotate = function (e) {
    e.preventDefault();
    var x = e.clientX - center.x,
      y = e.clientY - center.y,
      d = R2D * Math.atan2(y, x);
    rotation = d - startAngle;
    return rot.style.webkitTransform = "rotate(" + (angle + rotation) + "deg)";
  };

  hadndleClick = function (e) {
    const coefficient = Number(e.target.dataset.number)
    const result = 90 - coefficient * 30

    setTimeout(() => {
      rot.style.transform = "rotate(" + (result) + "deg)";
      rot.style.transition = '.3s ease'
    }, [100])

  };

  stop = function () {
    let result = angle + rotation
    const added_angle = getBreakpoint(result)

    angle = result;
    setTimeout(() => {
      rot.style.webkitTransform = "rotate(" + added_angle + "deg)";
      rot.style.transition = '.3s ease'
    }, [500])

    rotation = 0;
    startAngle = 0;
    center = {
      x: 0,
      y: 0
    };

    return active = false;
  };

  init();

}).call(this);

//qq