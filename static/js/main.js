'use strict';

// Init variables
let data = [];
let tot_export = 0;
let tot_import = 0;
let tot_dsq = 0;
let tot_production = 0;
let tot_Processing = 0;
let tot_seed = 0;

let stacked_data = [];

let tb_export, tb_import, tb_dsq, tb_production, tb_processing, tb_seed = null;
let bar_elements, bar_items, donut, scatter = null;
let linechart = null;
let stacked_bar, item_stacked_bar = null;

let elements = [];
let element_codes = [];
let items = [];
let values = [];
let year_values = [];
let years = [];

let element_picklist = null;
let item_keys =[];
let item_dict = [];

d3.json('/load_data').then(d => {

    // Redefine
    data = d.nfbs;
    // console.log("type:::::", data);

    const nest = d3.nest()
                    .key(d => d.year)
                    .rollup(v => {
                        const map = v.map(d => d.value)
                        const reducer = (accumulator, currentValue) => accumulator + currentValue;
                        const sum = map.reduce(reducer);
                        // console.log("Map", map);
                        return sum;
                    })
                    .entries(data);
    // re-formate string year to digits
    nest.forEach(d => {
        d.key = +d.key
    })
    console.log("type:::::", nest);

    for(var i = 0; i < data.length; i++) {
        var obj = data[i];


        switch (obj.element) {
            case 'Export Quantity':
                tot_export = tot_export + obj.value;
                break;
            case 'Import Quantity':
                tot_import = tot_import + obj.value;
                break;
            case 'Domestic supply quantity':
                tot_dsq = tot_dsq + obj.value;
                break;
            case 'Production':
                tot_production = tot_production + obj.value;
                break;
            case 'Processing':
                tot_Processing = tot_Processing + obj.value;
                break;
            case 'Seed':
                tot_seed = tot_seed + obj.value;
                break;
            default:
                break;
        }
        element_codes.push(obj.element_code);
        elements.push(obj.element);
        items.push(obj.item_code);
        values.push(obj.value);
        years.push(obj.year);

        //sum total numbers for each item type
        var current_item_sums = d3.nest().key(function(d){
            return d.item; })       // *** By Item
        .rollup(function(leaves){
            return d3.sum(leaves, function(d){
                return d.value;
            });
        }).entries(data)
        .map(function(d){
            return { key:d.key, value:d.value};
        });

        var current_domain_sums = d3.nest().key(function(d){
            return d.element; })        // *** By Element
        .rollup(function(leaves){
            return d3.sum(leaves, function(d){
                return d.value;
            });
        }).entries(data)
        .map(function(d){
            return { key:d.key, value:d.value};
        });

        //var item_data = Array.from(d3.group(data, d => d.item));
        //var item_sums = d3.rollup(function(v) {v.value})
    }
    console.log(current_item_sums);
    console.log(current_domain_sums);

    stacked_data['Seed']=tot_seed;
    stacked_data['Processing']=tot_Processing;
    stacked_data['Production']=tot_production;
    stacked_data['Domestic supply quantity']=tot_dsq;
    stacked_data['Import Quantity']=tot_import;
    stacked_data['Export Quantity']=tot_export;
    console.log("creating dictionary")
    console.log(stacked_data);

    stacked_bar = new StackBar(current_domain_sums,'vis_tb1');
    item_stacked_bar =new StackBarItem(current_item_sums,'vis_tb2');
//    linechart = new LineChart(Object.keys(year_values), Object.values(year_values), 'Year', 'Value', 'vis1');
//    linechart = new LineChart(year_values, 'Year', 'Value', 'vis1');
    linechart = new LineChart(nest, 'Year', 'New Food Balance', 'vis1');

}).catch(err => console.log(err));