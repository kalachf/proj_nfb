'use strict';

// Init variables
let data = [];
let tot_export = 0;
let tot_import = 0;
let tot_dsq = 0;
let tot_production = 0;
let tot_Processing = 0;
let tot_seed = 0;

let tb_export, tb_import, tb_dsq, tb_production, tb_processing, tb_seed = null;
let bar_elements, bar_items, donut, scatter = null;
let elements = [];
let element_codes = [];
let items = [];
let values = [];
let years = [];

let element_picklist = null;

d3.json('/load_data').then(d => {

    // Redefine
    data = d.nfbs;

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
        // console.log(obj.value);
    }
    
    //
    // KPI and Visual Experience
    //
    // Instantiate
    
    // console.log("Items: ", items);
    tb_export = new TextBox('Export Quantity', tot_export, 'vis_tb1');
    tb_import = new TextBox('Import Quantity', tot_import, 'vis_tb2');
    tb_dsq = new TextBox('Domestic supply quantity', tot_production, 'vis_tb3');
    tb_production = new TextBox('Production', tot_production, 'vis_tb4');
    tb_processing = new TextBox('Processing', tot_Processing, 'vis_tb5');
    tb_seed = new TextBox('Seed', tot_seed, 'vis_tb6');

    bar_elements = new Bars(element_codes, 'Element Codes', 6, 'vis1');
    bar_items = new Bars(items, 'Items', 10, 'vis2');
    donut = new Donut(elements, 'Elements',  'vis3');
    // console.log("elements: ", elements);
    scatter = new Scatter(values, years, 'Values', 'Years', 'vis4');

}).catch(err => console.log(err));