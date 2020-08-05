/**
 * @class StackBar
 */
class StackBar {

    // Elements
    svg = null;
    g = null;

    // Configs
    svgW = 1200;
    svgH = 50   ;
    gMargin = {top: 0, right: 0, bottom: 0, left: 0};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);
    
    xAxisG = null;
    yAxisG = null;


    default_values =[];


    // Tools
    scX = d3.scaleLinear()
            .range([0, this.gW]);
    scY = d3.scaleLinear()
            .range([this.gH, 0]);
    histogram = d3.histogram();
    yAxis = d3.axisLeft().ticks(5);
    xAxis = d3.axisBottom();

    maxXVal=0;
    //colors = ['#073b3a','#0b6e4f','#08a045','#6bbf59','#ddb771','#f28f3b'];
    colors = new Array(100).fill(['#073b3a','#0b6e4f','#08a045','#6bbf59','#ddb771','#f28f3b']).flat();
    div='';

    current_domain_data = [];
    current_item_data = [];


//in (0, maxXVal) our (0,svgW)
    scale(num) {

        var NewValue = (((num - 0) * (this.svgW - 0)) / (this.maxXVal - 0)) + 0;
        return (NewValue);
    }


    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data; //default object with all values
        this.data_filtered = _data; //object after filtering down
        this.target = _target;
        this.total_sum = 0;
        this.runningTotal = [];
        this.translate = 0;
        this.startPoints = [];
        this.normalizedStartPoints =[];
        this.normalizedWidths =[];
        this.keys=[];
        this.midpoints=[];

       
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
            .attr('height', vis.gH)
            .style('overflow', 'visible');
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);
        //vis.boxG = vis.svg.append("boxG")
          //  .attr('class', 'vert-container')
            //.style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);
        


        vis.div = vis.g.append("g")
            .attr('class', 'container')
            .attr('id', 'vis_wrapper')
            .attr('width', vis.svgW+20)
            .attr('height', vis.gH+20);


        data = vis.data;
        Object.keys(data).forEach(function(key) {
            //console.log('key:'+data[key].key);
            //console.log('val:'+data[key].value);

            vis.current_domain_data[data[key].key]=data[key].value;
            vis.maxXVal += data[key].value;
            vis.default_values.push(data[key].value);
            vis.keys.push(data[key].key);

            vis.startPoints.push(vis.maxXVal);


        });
        for (var i = 0; i < vis.startPoints.length; i++) {
             //record the normalized start points for each bin
             vis.normalizedStartPoints[i]=(vis.scale(vis.startPoints[i]));
             //record the normalized widths for each bin
             vis.normalizedWidths[i]=(vis.scale(vis.default_values[i]));
             //record midpoints of all the bins
             if (i==0){vis.midpoints[i]=vis.normalizedStartPoints[i]/2;}else{
                vis.midpoints[i]= (vis.normalizedStartPoints[i] + vis.normalizedStartPoints[i-1])/2;
             }
        }
        console.log(vis.current_domain_data);


// Add another container boxG vertically centered { Label and Value }
// You'll need an xscale (total of quantities of all alements)

        // Now wrangle
        vis.wrangle("all");
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle(which_filter) {
        // Define this vis
        const vis = this;
        switch (which_filter) {
            case 'Export Quantity':
                tot_export = tot_export + obj.value;
                break;
            default:

                break;
        }
// Link/define the data
// Redefine the domain (axis of all boxes)
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

        var barChart = vis.div.selectAll('rect')
            .data(vis.default_values)
            .enter()
            .append('rect')
            .attr("height", function(d) {
                return vis.svgH;
            })
            .attr("width", function(d, i) {
                //console.log("in width", d, i)
                return vis.normalizedWidths[i];
            })
            .attr("x", function (d, i) {

                return vis.normalizedStartPoints[i-1];

            })
            .attr("fill", function(d, i) {
                return vis.colors[i];
            })
            .attr("text", function(d) {

                return d;
            })

            .on('mouseover', function (d, i) {
                  //console.log(d);
                  d3.select(this).transition()
                       .duration('50')
                       .attr('opacity', '.75');

                  vis.div.append("text")
                    .attr("id","t-"+i)
                    .attr("x", function() {
                        console.log(i);
                        return vis.midpoints[i]-25;
                    })
                    .attr("y", function() { return -15;})

                    .text(function() {
                        return vis.keys[i];  // Value of the text
                    });

                })

            .on('mouseout', function (d, i) {
                  d3.select(this).transition()
                       .duration('50')
                       .attr('opacity', '1');
                  d3.select("#t-"+i).remove();
            })
            .on('click', function (d, i) {
                d3.select("#legend #domain").text("Domain: "  +vis.keys[i]+ ", Value (tonnes):" + vis.default_values[i] );
                d3.select("#legend #select_item").text("ALL");
                console.log(vis.data);
                console.log(d);

                d3.json('/load_data/'+vis.keys[i]).then(temp_data => {
                    console.log(temp_data);
                    //stacked_bar = new StackBar(temp_data,'vis_tb1');
                });


            });

            var chartLines = vis.div.selectAll('line')
                    .data(vis.default_values)
                    .enter()
                    .append('line')
                    .attr("height", function(d) {
                        return vis.svgH + 10;
                    })
                    .attr("width", 1)
                    .attr("x1", function(d,i){
                        return vis.midpoints[i];
                    })
                    .attr("x2", function(d,i){
                        return vis.midpoints[i];

                    })
                    .attr("y1", function(d,i){
                        return -10;
                    })
                    .attr("y2", function(d,i){
                        return vis.svgH+10;

                    })
                    .style("stroke", "black")
                    .style("stroke-width", .3)

            //console.log(vis.startPoints);
            //console.log(vis.normalizedStartPoints);

// implement Enter() Exit() patern inside boxG; set width of boxes moving them from left (translate the x value of group element)
// and build other elements in it (label, value, line)
    }
}
