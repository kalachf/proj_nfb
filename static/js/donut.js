/**
 * @class Donut
 */
class Donut {

    // Vars

    // Elements
    svg = null;
    g = null;
    redialG = null;
    resultG = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 50, right: 50, bottom: 50, left: 50};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);
    innerRadius = Math.round(this.gH / 2 * 0.5)
    outerRadius = Math.round(this.gH / 2 * 0.8)

    // Tools
    colorScale = d3.scaleLinear()
                    .range(['rgba(255, 0, 0, 1)', 'rgb(64,0,128)']);
    arc = d3.arc()
                .innerRadius(this.innerRadius)
                .outerRadius(this.outerRadius);
    pie = d3.pie()
                .value(d => d.value);

    tooltip = null;

    /*
    Constructor
     */
    constructor(_data, _donut_label, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.donut_label = _donut_label
        this.target = _target;

        // console.log("elements: ", this.data)

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

        // Add radialG in middle
        vis.radialG = vis.g.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gW / 2}px, ${vis.gH / 2}px)`);
        vis.radialG.append('text')
            .attr('class', 'label labelDonut')
            .style('transform', `translateY(-${vis.outerRadius + 15}px)`)
            .text(this.donut_label);
        vis.resultsG = vis.radialG.append('g')
            .attr('class', 'resultsG');
        vis.resultsG.append('text')
            .attr('class', 'result resultS')
            .style('transform', `translateY(-10px)`);
        vis.resultsG.append('text')
            .attr('class', 'result resultL')
            .style('transform', `translateY(20px)`);

        // create a tooltip
         vis.tooltip = d3.select(`#${vis.target}`)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

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
        // console.log("elements: ", this.data)

        // Update data structure using donut data
        // vis.prog_langs_data = d3.nest()
        vis.donut_data = d3.nest()
            // .key(d => d.prog_lang)
            .key(d => this.data)
            .rollup(v => v.length)
            .entries(this.data);

        // Update scales
        // vis.colorScale.domain([0, vis.prog_langs_data.length - 1]);
        vis.colorScale.domain([0, vis.donut_data.length - 1]);

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

        // Build donut
        vis.radialG.selectAll('.donutG')
            // .data(vis.pie(vis.prog_langs_data))
            .data(vis.pie(vis.donut_data))
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'donutG')
                    .each(function(d, i) {
                        // Define this
                        const g = d3.select(this);

                        // Append path
                        g.append('path')
                        .attr('d', vis.arc)
                        .attr('fill', vis.colorScale(i))
                    })
                    .on('mouseover', e => {
                        vis.resultsG.select('.resultS')
                            .text(e.data.key);
                        vis.resultsG.select('.resultL')
                            .text(e.data.value);
                    })
                    .on('mouseout', e => {
                        vis.resultsG.select('.resultS')
                            .text('');
                        vis.resultsG.select('.resultL')
                            .text('');
                    })
            )

    }

}