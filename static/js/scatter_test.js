/**
 * @class Scatter
 */
class Scatter {

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

    yAxis = d3.axisLeft().ticks(5);
    xAxis = d3.axisBottom();

    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data;
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

        // Append axes
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', 'translateX(-15px)');


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

        // Map ages
        const ageMap = vis.data.map(d => d.age);


        // Update scales
        vis.scX.domain(d3.extent(ageMap, d => d));
        //vis.scY.domain([0, d3.max(vis.data_bins,d => d.length)]);
        vis.scY.domain([0, d3.max(ageMap, d => d.length)]);
        vis.xAxis.scale(vis.scX).ticks(vis.data_bins.length);
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
        const ages = vis.data.map(d => d.age);

        // Build bars
        vis.g.selectAll('.scatterG')
            .data(ages)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'scatterG')
                    .each(function(d, i) {
                        // Define this
                        const g = d3.select(this);

                        // Get dims
                        const w = vis.gW / ages.length;
                        const h = vis.scY(d.length);

                        // Position
                        //g.style('transform', `translate(${i * w}px, ${h}px)`);

                        // Append circle
                        g.append("circle")
                                 .attr("class", "logo")
                                 .attr("cx", ages[i])
                                 .attr("cy", ages[i])
                                 .attr("r", ages[i] * .2)
                                 .style("fill", "transparent")       
                                 .style("stroke", "red")     
                                 .style("stroke-width", 0.25);
                    })
            );

        // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }
}