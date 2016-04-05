function drawCharts(data){
    var components = data.Components;
    var connections = data.Connections;
    var level_arr = [];
    var y_level = [];
    var i;
    var max_level = parseInt(components[0].Level);

    var chart = d3.select("#chart");

    for (i = 0; i < components.length; i++){
        var level = parseInt(components[i].Level);
        if(max_level < level){
            max_level = level;
        }
    }

    for (i = 0; i < max_level; i++){
        level_arr.push(0);
    }

    var max_y = 0;

    for (i = 0; i < components.length; i++){
        var level = parseInt(components[i].Level) - 1;
        y_level[i] = level_arr[level];
        level_arr[level]++;
        if(max_y < y_level[i]) max_y = y_level[i];
    }

    max_y++;

    for (i = 0; i < max_level-1; i++){
        var x = i * (rect_width + margin_left) + rect_width + margin_left/2;
        chart.append("line")
            .style("stroke", "black")
            .attr("x1", x)
            .attr("y1", -margin_top)
            .attr("x2", x)
            .attr("y2", (rect_height+margin_top)*max_y+margin_top);
        level_arr.push(0);
    }

    for (i = 0; i < connections.length; i++){
        var from = parseInt(connections[i].From);
        var to = parseInt(connections[i].To);
        var x = (components[from-1].Level - 1) * (rect_width + margin_left);
        var y = y_level[from-1] * (rect_height + margin_top);
        var x1 = x+rect_width;
        var y1 = y + margin_top/2 + r*2;
        var x = (components[to-1].Level - 1) * (rect_width + margin_left);
        var y = y_level[to-1] * (rect_height + margin_top);
        var x2 = x;
        var y2 = y + margin_top/2 + r*2;

        chart.append("line")
            .style("stroke", "#698775")
            .style("stroke-width", "2px")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2);
    }

    for (i = 0; i < components.length; i++){
        var level = parseInt(components[i].Level) - 1;
        var x = level * (rect_width + margin_left);
        var y = y_level[i] * (rect_height + margin_top);

        chart.append("circle")
            .style("fill", "#698775")
            .attr("r", r)
            .attr("cx", x)
            .attr("cy", y + margin_top/2 + r*2);

        chart.append("circle")
            .style("fill", "#698775")
            .attr("r", r)
            .attr("cx", x+rect_width)
            .attr("cy", y + margin_top/2 + r*2);

        chart.append("rect")
            .attr("x",x)
            .attr("y",y)
            .attr("rx",rect_width/15)
            .attr("ry",rect_width/15)
            .attr("width",rect_width)
            .attr("height",rect_height)
            .attr("fill","#fff")
            .attr("stroke","#648ba5");
        chart.append("text")
            .attr("x",x + rect_width/2)
            .attr("y",y + rect_height/2)
            .attr("dx",0)
            .attr("dy",0)
            .attr("font-size",12)
            .style("text-anchor", "middle")
            .text(components[i].Name)
            .call(wrap,15);
    }
}



function wrap(text, length) {
  text.each(function() {

    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        transform = text.attr("transform"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.html().length > length) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
                  .attr("x", x)
                  .attr("y", y)
                  .attr("dy", lineHeight + dy + "em")
                  .text(word);
      }
    }
  });
}