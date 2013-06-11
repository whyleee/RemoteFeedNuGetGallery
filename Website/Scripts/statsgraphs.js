﻿
var displayGraphs = function () {

    //if ($('#downloads-by-nuget-version').length) {
        if (Modernizr.svg) {
            drawNugetClientVersionBarChart();
        }
        else {
            $('#downloads-by-nuget-version table').css('display', 'inline');
        }
    //}

    //if ($('#downloads-per-month').length) {
        if (Modernizr.svg) {
            drawMonthlyDownloadsLineChart();
        }
        else {
            $('#downloads-per-month table').css('display', 'inline');
        }
    //}
}

var drawNugetClientVersionBarChart = function () {

    var margin = { top: 20, right: 30, bottom: 60, left: 80 },
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var yScale = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    var svg = d3.select('#downloads-by-nuget-version').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var data = [];

    d3.selectAll('#downloads-by-nuget-version tbody tr').each(function () {
        var item = {
            nugetVersion: d3.select(this).select(':nth-child(1)').text(),
            downloads: +(d3.select(this).select(':nth-child(2)').text())
        };
        data[data.length] = item;
    });

    xScale.domain(data.map(function (d) { return d.nugetVersion; }));
    yScale.domain([0, d3.max(data, function (d) { return d.downloads; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
            return "rotate(-65)"
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Downloads");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.nugetVersion); })
        .attr("width", xScale.rangeBand())
        .attr("y", function (d) { return yScale(d.downloads); })
        .attr("height", function (d) { return height - yScale(d.downloads); });
}

var drawMonthlyDownloadsLineChart = function () {

    var margin = { top: 20, right: 20, bottom: 80, left: 80 },
        width = 400 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    var xScale = d3.scale.ordinal()
        .rangePoints([0, width]);

    var yScale = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    var data = [];

    d3.selectAll('#downloads-per-month tbody tr').each(function () {
        var item = {
            month: d3.select(this).select(':nth-child(1)').text(),
            downloads: +(d3.select(this).select(':nth-child(2)').text())
        };
        data[data.length] = item;
    });

    var line = d3.svg.line()
        .x(function (d) { return xScale(d.month); })
        .y(function (d) { return yScale(d.downloads); });

    var svg = d3.select("#downloads-per-month").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale.domain(data.map(function (d) { return d.month; }));
    yScale.domain([0, d3.max(data, function (d) { return d.downloads; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
            return "rotate(-65)"
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}
