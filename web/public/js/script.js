
var socket = io.connect('http://localhost:3203');

socket.on('connect', function () {
    socket.emit('subscribe', 'all');
    socket.emit('subscribe', 'counters.test');
  /*socket.emit('subscribe', 'timers');
  socket.emit('subscribe', 'gauges.server1.cpu');
  socket.emit('subscribe', 'gauges.*.cpu');*/
});

socket.on('all', function (data) {
    console.log('ALL:', data);
});


var context = cubism.context()
    .serverDelay(0)
    .clientDelay(0)
    .step(1e3)
    .size(960);

d3.select("#example1").call(function(div) {

  div.append("div")
      .attr("class", "axis")
      .call(context.axis().orient("top"));

  div.selectAll(".horizon")
        .data([foo, bar, foo.add(bar), foo.subtract(bar)])
        .enter().append("div")
        .attr("class", "horizon")
        .call(context.horizon().extent([-20, 20]));

  /*div.append("div")
      .attr("class", "rule")
      .call(context.rule());*/

});

// On mousemove, reposition the chart values to match the rule.
context.on("focus", function(i) {
  d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
});
