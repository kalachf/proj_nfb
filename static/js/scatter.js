/**
 * @class Scatter
 */
class Scatter {

    // Vars

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
    scR = d3.scaleLinear()
            .range([0, this.gW]);

    xAxis = d3.axisBottom()
        .ticks(5)
        .tickSize(6, 3, 0);
    yAxis = d3.axisLeft()
        .ticks(5)
        .tickSize(6, 3, 0);
    /*
    Constructor
     */
    constructor(_xdata, _ydata, _xlabel, _ylabel,  _target) {
        // Assign parameters as object fields
        this.xdata = _xdata;
        this.ydata = _ydata;
        this.xlabel = _xlabel;
        this.ylabel = _ylabel;
        this.target = _target;

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

        // Add x Axis and y Axis
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', 'translateX(-15px)');

        // Add X/Y Labels
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .text(this.xlabel);
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -50px)`)
            .text(this.ylabel);

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

        // Map scatter points
//        vis.data = vis.data.filter(d => d.age < 25)
        const xdomain = vis.xdata;
        const ydomain = vis.ydata;

        // Update scales
        vis.scX.domain([d3.min(xdomain), d3.max(xdomain)]);
        vis.scY.domain([d3.min(ydomain), d3.max(ydomain)]);
        vis.xAxis.scale(vis.scX);//.ticks(vis.data.length);
        vis.yAxis.scale(vis.scY);//.ticks(vis.experience_yrMap.length);
        // Scale Radius using Age)
//        vis.scR.domain([d3.min(ageMap), d3.max(ageMap)]);
        vis.scR.domain([2, 2]);

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
        vis.g.selectAll('.scatterG')
            .data(vis.xdata)
            .enter()
            .append("circle")
                .attr("class", "dot")
                .attr("cx", function(d) { return vis.scX(+this.xdata); })
                .attr("cy", function(d) { return vis.scY(+this.ydata); })
                .attr("r", function(d) { return vis.scR(+10) * .05; } )
                .style("fill", "transparent")       
                .style("stroke", "red")     
                .style("stroke-width", 0.50)
                .style("opacity", .7);

        // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }
}