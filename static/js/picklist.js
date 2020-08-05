/**
 * @class PickList
 */
class PickList {

    // PickList script- By Sean Geraty (http://www.freewebs.com/sean_geraty/)
    // Visit JavaScript Kit (http://www.javascriptkit.com) for this JavaScript and 100s more
    // Please keep this notice intact

    // Control flags for list selection and sort sequence
    // Sequence is on option value (first 2 chars - can be stripped off in form processing)
    // It is assumed that the select list is in sort sequence initially
    singleSelect = true;  // Allows an item to be selected once only
    sortSelect = true;  // Only effective if above flag set to true
    sortPick = true;  // Will order the picklist in sort sequence

    /*
    Constructor
     */
    constructor(_list, _id,  _parent) {
        // Assign parameters as object fields      
        console.log("Create Picklist");
        this.pl = _list;
        this.pl_id = _id;
        // this.target = _target;
        this.parent = _parent;
        // Now init
        this.init();
    }


  // Initialise - invoked on load
    init() {
      const vis = this;
      vis.selectList = document.createElement("select");
      vis.selectList.id = vis.pl_id;
      vis.parent_id = document.getElementById(vis.parent);
      // console.log("Parent", vis.parent);
      this.parent_id.appendChild(vis.selectList);
      // let selectList = document.getElementById(vis.pl_id);
      let selectOptions = vis.selectList.options;
      let selectIndex = vis.selectList.selectedIndex;

      for(let i = 0 ; i < vis.pl.length ; i++) {
      //Create and append the options
          var option = document.createElement("option");
          option.value = i;
          option.text = vis.pl[i];
          vis.selectList.appendChild(option);
          // console.log("pl id: ", i);
      }
      vis.selectList.focus();  // Set focus on the selectlist

//      vis.selectlist.createAttribute("onchange", forecastIt(vis));
      vis.selectList.onchange = e =>  {
        // console.log("Selected:", vis.selectList.value);
        vis.forecastIt();
      };

    }

  // Adds a selected item into the picklist
  addIt() {
    selectList = document.getElementById("SelectList");
    selectIndex = selectList.selectedIndex;
    selectOptions = selectList.options;
    pickList = document.getElementById("PickList");
    pickOptions = pickList.options;
    pickOLength = pickOptions.length;
    // An item must be selected
    while (selectIndex > -1) {
      pickOptions[pickOLength] = new Option(selectList[selectIndex].text);
      pickOptions[pickOLength].value = selectList[selectIndex].value;
      // If single selection, remove the item from the select list
      if (singleSelect) {
        selectOptions[selectIndex] = null;
      }
      if (sortPick) {
        var tempText;
        var tempValue;
        // Sort the pick list
        while (pickOLength > 0 && pickOptions[pickOLength].value < pickOptions[pickOLength-1].value) {
          tempText = pickOptions[pickOLength-1].text;
          tempValue = pickOptions[pickOLength-1].value;
          pickOptions[pickOLength-1].text = pickOptions[pickOLength].text;
          pickOptions[pickOLength-1].value = pickOptions[pickOLength].value;
          pickOptions[pickOLength].text = tempText;
          pickOptions[pickOLength].value = tempValue;
          pickOLength = pickOLength - 1;
        }
      }
      selectIndex = selectList.selectedIndex;
      pickOLength = pickOptions.length;
    }
    selectOptions[0].selected = true;
  }

  // Deletes an item from the picklist
  delIt() {
    selectList = document.getElementById("SelectList");
    selectOptions = selectList.options;
    selectOLength = selectOptions.length;
    pickList = document.getElementById("PickList");
    pickIndex = pickList.selectedIndex;
    pickOptions = pickList.options;
    while (pickIndex > -1) {
      // If single selection, replace the item in the select list
      if (singleSelect) {
        selectOptions[selectOLength] = new Option(pickList[pickIndex].text);
        selectOptions[selectOLength].value = pickList[pickIndex].value;
      }
      pickOptions[pickIndex] = null;
      if (singleSelect && sortSelect) {
        var tempText;
        var tempValue;
        // Re-sort the select list
        while (selectOLength > 0 && selectOptions[selectOLength].value < selectOptions[selectOLength-1].value) {
          tempText = selectOptions[selectOLength-1].text;
          tempValue = selectOptions[selectOLength-1].value;
          selectOptions[selectOLength-1].text = selectOptions[selectOLength].text;
          selectOptions[selectOLength-1].value = selectOptions[selectOLength].value;
          selectOptions[selectOLength].text = tempText;
          selectOptions[selectOLength].value = tempValue;
          selectOLength = selectOLength - 1;
        }
      }
      pickIndex = pickList.selectedIndex;
      selectOLength = selectOptions.length;
    }
  }

  // Selection - invoked on Forcast
  forecastIt(btn) {
    const vis = this;
    // console.log("Enter select It")
    let pickList = document.getElementById(vis.pl_id);
    let pickOptions = pickList.options;
    let pickOLength = pickOptions.length;
    if (pickOLength < 1) {
      alert("No Selections in the Picklist\nPlease Select using the [->] button");
      return false;
    }
      
    console.log("Picked: ", pickOptions[pickList.selectedIndex].text);
    console.log("Picked i: ", pickOptions[pickList.selectedIndex].value);

    // Forcast passing no of years (add one cause index starts w/0)
    linechart.addForcast(parseInt(pickOptions[pickList.selectedIndex].value) + 1);

    return true;
  }
}