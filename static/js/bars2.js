/**
 * @class Bars
 */
class Bars2 {

    // Vars
    data_bins = [];

    // Elements
    svg = null;
    g = null;
    xAxisG = null;
    yAxisG = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 50, right: 25, bottom: 75, left: 75};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

    // Tools
    scX = d3.scaleLinear()
            .range([0, this.gW]);
    scY = d3.scaleLinear()
            .range([this.gH, 0]);
    
    histogram = d3.histogram();
    yAxis = d3.axisLeft().ticks(5);
    xAxis = d3.axisBottom();

    /*
    Constructor
     */
    constructor(_data, _xlabel, _ticks, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.xlabel = _xlabel;
        this.target = _target;
        this.ticks = _ticks;

        // Now init
        this.init();
    }

    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init() {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)

            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Append axes
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 10}px)`);
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .text(this.xlabel);
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', 'translateX(-10px)');
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .text('Total');


        // Now wrangle
        vis.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        // Define this vis
        const vis = this;

        // Map element
        const elementMap = vis.data; //  .map(d => d.element_code);

        // Use histogram() to place in bins
        vis.data_bins = vis.histogram(elementMap);

        // Update scales
        vis.scX.domain(d3.extent(elementMap,d => d));
        vis.scY.domain([0, d3.max(vis.data_bins,d => d.length)]);
        vis.xAxis.scale(vis.scX).ticks(this.ticks);
        vis.yAxis.scale(vis.scY);

        // Now render
        vis.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;

        // Build bars
        vis.g.selectAll('.barG')
            .data(vis.data)
            .enter()
            .append("g")
            .attr("class", "g rect")
            .append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.label); })
                .attr("y", vis.gH)
                .on("mouseover", onMouseOver) //Add listener for the mouseover event
                .transition()
                .ease(d3.easeLinear)
                .duration(2000)
                .delay(function (d, i) {
                    return i * 50;
                })
            .attr("y", function(d) { return y(d.percentage.slice(0, -1)); })
            .attr("width", x.bandwidth() - 15) // v4’s console.log(bands.bandwidth()) replaced v3’s console.log(bands.rangeband()).
            .attr("height", function(d) { return h - y(d.percentage.slice(0, -1)); }) // use .slice to remove percentage sign at the end of number
            .attr("fill", function(d) { return d.color; });
        vis.legend = vis.svg.append("g");
        vis.svg.selectAll(".g.rect").append("text")
            .text(function(d) { return d.value })
            .attr("x", function(d) { return x(d.label) + x.bandwidth() / 2 - 15; })
            .attr("y", vis.gH)
            .transition()
            .ease(d3.easeLinear)
            .duration(2000)
            .attr("y", function(d) { return y(d.percentage.slice(0, -1) / 2);}) // use slice to remove percentage sign from the end of number
            .attr("dy", ".35em")
            .style("stroke", "papayawhip")
            .style("fill", "papayawhip");
        vis.svg.selectAll(".g.rect").append("text")
            .text(function(d) { return d.percentage; })
            .attr("x", function(d) { return x(d.label) + x.bandwidth() / 2 - 20; })
            .attr("y", vis.gH)
            .transition()
            .ease(d3.easeLinear)
            .duration(2000)
            .attr("y", function(d) { return y(d.percentage.slice(0, -1)) - 10; }) // use slice to remove percentage sign from the end of number
            .attr("dy", ".35em")
            .attr("fill", function(d) { return d.color; });
        // Now I want to apply text transition. Like instead of just printing say 90%(d.percentage). 
        // I want that it starts from 0 and goes to d.percentage gradually. 
        // How can I apply text transition in this case. I tried the following but it didn't work
        vis.numberFormat = d3.format("d");
        vis.svg.selectAll(".g.rect").append("text")
            .attr("x", function(d) { return x(d.label) + x.bandwidth() / 2 - 20; })
            .attr("y", h)
            .transition()
            .ease(d3.easeLinear)
            .duration(2000)
            .tween("text", function(d) {
                    vis.element = d3.select(this);
                    vis.i = d3.interpolate(0, d.percentage.slice(0, -1));
                    return function(t) {
                            var percent = numberFormat(i(t));
                            element.text(percent + "%");
                    };
            //return t => element.text(format(i(t)));
            })
            .attr("y", function(d) { return y(d.percentage.slice(0, -1)) - 10; }) // use slice to remove percentage sign from the end of number
            .attr("dy", ".35em")
            .attr("fill", function(d) { return d.color; });

        // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
}