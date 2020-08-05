/**
 * @class Scatter2
 */
class LineChart {
    // Vars
    org_data = null;

    // Elements
    svg = null;
    g = null;
    xAxisG = null;
    yAxisG = null;

    // Configs
    svgW = 1000;
    svgH = 400;
    gMargin = {top: 50, right: 25, bottom: 75, left: 75};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);
    
    // Tools
    scX = d3.scaleLinear();
    scY = d3.scaleLinear();
    scR = 10.0;
    xAxis = d3.axisBottom();
    yAxis = d3.axisLeft();
        // Line
    myline = d3.line();

    //  Tooltip Object
    tooltip = null;

    /*
    Constructor
     */
    constructor(_data, _xlabel, _ylabel,  _target) {
//    constructor(_xdata, _ydata, _xlabel, _ylabel,  _target) {
        // Assign parameters as object fields
        this.data = _data
        this.xlabel = _xlabel;
        this.ylabel = _ylabel;
        this.target = _target;

        console.log("year_values: ", this.data);
        // “[The spread] ... operator causes the values in the array to be expanded, 
        // or ‘spread,’ into the function’s arguments.”
//        console.log("max year: ", Math.max(...Object.keys(this.year_values)));
//        console.log("min year: ", Math.min(...Object.keys(this.year_values)));

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

        // init the line path
        vis.mylinepath = vis.g
                            .append("path")
                            .attr("fill", "none")
                            .attr("stroke", "blue");

        vis.tooltip = d3.select(`#${vis.target}`)
            .append("div").attr("id", "tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text("tooltip for fun...");

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

        // Update scales
        vis.scX
            .domain(d3.extent(vis.data, d => d.key)) // Returns min max array
            .range([20, vis.gW - 20]);
        vis.scY
            .domain([0, d3.max(vis.data, d => d.value)])
            .range([vis.gH, 0]);
        vis.xAxis
            .scale(vis.scX)
            .ticks(vis.data.length) //.ticks(vis.data.length);
            .tickFormat(d3.format("0")); // year w/o comma nor decimals
        vis.yAxis
            .scale(vis.scY)
            // .ticks(5, "%")
//        vis.scR.domain([d3.min(ageMap), d3.max(ageMap)]);
//        vis.scR.domain([2, 2]);

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

        // console.log("<< data >> ", vis.data);
        // track paths so you can draw lines
        const coords = [];

        vis.g.selectAll('.dot')
//            .data(vis.ydata)
            .data(vis.data)
            .join(
                enter => enter
                    .append("g")
                    .attr("class", "dot")
                    .each(function(d, i) {
                        const g = d3.select(this) // this is referring to scope of the function
                        const x = Math.round( vis.scX(d.key) );
                        const y = Math.round( vis.scY(d.value) );

                        coords.push([x, y]);

                        // console.log( `translate(${x}px, ${y}px)`)

                        g.style("transform", `translate(${x}px, ${y}px)`) // move the group on the page
                        g.append("circle")
                            .attr("r", vis.scR)
                            .attr("fill", "red")
                    })
                    .on('mouseover', d => {
                        vis.tooltip.style("visibility", "visible");
                        const dtext = d.value.toFixed(2) + " tonnes";
                        vis.tooltip.transition()        
                                    .duration(200)      
                                    .style("opacity", .9);      
                        vis.tooltip.html(dtext)  
                                    .style("left", (d3.event.pageX) + 30 + "px")     
                                    .style("top", (d3.event.pageY) + "px");
                    })
                    .on("mouseout", d => {
                        vis.tooltip.transition()        
                                .duration(500)      
                                .style("opacity", 0); 
                        const $tooltip = $("#tooltip");
                        $tooltip.empty();
                    })    

                )

        vis.mylinepath        
            .datum(coords)
            .attr("d", vis.myline);


       // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }

    addForcast(numofyears) {
        const vis = this;

        console.log("Forcast Years...", numofyears)
        console.log("forcast: ", this.data)
        var curr_max = d3.max(vis.data, d => d.key);
        console.log("Curr max: ", curr_max)
        for (var i = 1; i < numofyears+1; i++) {
            var prepred = d3.max(vis.data, d => d.value);
            // console.log("forcast: ", d3.max(vis.data, d => d.key) + i);
            // console.log("forcast: ", prepred + (prepred * 0.05) * i);
            // console.log("Gen Percentage: ", Math.floor(Math.random() * (8 - 2 + 1) + 2) / 100);
            var perc = Math.floor(Math.random() * (8 - 2 + 1) + 2) / 100;
            var curr_max = curr_max + 1;
            var pred = prepred + (prepred * perc) * i;
            console.log("next max: ", curr_max)
            vis.data.push({key:curr_max, value:pred});

        }
        console.log("Forecast: ", vis.data);
        vis.init();
    }
}