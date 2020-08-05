/**
 * @class TextBox
 */
class TextBox {

    // Vars
    total = null;

    // Elements
    svg = null;
    g = null;


    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 50, right: 25, bottom: 75, left: 75};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

    //  Tooltip Object
    tooltip = null;

    /*
    Constructor
     */
    constructor(_label, _value, _target) {
        // Assign parameters as object fields
        this.label = _label;
        this.value = _value;
        this.target = _target;
        
        // console.log("label: ", this.label);
        // console.log("value: ", this.value);
        
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

        console.log("vis.label: ", vis.label)
        // Set up the svg/g work space
        vis.color = d3.scaleOrdinal(d3.schemeCategory10);
        vis.textbox = [{
          x: 20,
          y: 30,
          text: vis.label 
        }, {
          x: 100,
          y: 130,
          text: vis.value
        }];

        vis.svg = d3.select(`#${vis.target}`)
          .append("svg")
          .attr("width", vis.gW)
          .attr("height", vis.gH);

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

        vis.g = vis.svg.selectAll('.textbox')
          .data(vis.textbox)
          .enter()
          .append("g")
          .attr("class","someClass")
          .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
          });

        vis.g.append("rect")
          .attr("width", vis.gW)
          .attr("height", vis.gH)
          .style("fill", "lightskyblue") // aqua, lime
          .on('mouseover', d => {
                vis.tooltip.style("visibility", "visible");
                const dtext = "New Balance Food <br>" + vis.label + "<br>" + vis.value + " tonnes";

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

        vis.g.append("text")
//          .style("fill", "red")
          .attr("font-size", "30px")
          .style("stroke", "red")
          .style("stroke-width", 2)
          .text(function(d) {
            return d.text;
          })
    }
}