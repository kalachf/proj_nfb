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
    constructor() {
        // Assign parameters as object fields      
        console.log("Create Picklist");
        // Now init
        this.init();
    }


  // Initialise - invoked on load
    init() {
      let selectList = document.getElementById("YearsList");
      let selectOptions = selectList.options;
      let selectIndex = selectList.selectedIndex;
    
      if (!(selectIndex > -1)) {
        selectOptions[0].selected = true;  // Set first selected on load
        selectOptions[0].defaultSelected = true;  // In case of reset/reload
      }
      selectList.focus();  // Set focus on the selectlist
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
    console.log("Enter selIt")
    let pickList = document.getElementById("YearsList");
    let pickOptions = pickList.options;
    let pickOLength = pickOptions.length;
    if (pickOLength < 1) {
      alert("No Selections in the Picklist\nPlease Select using the [->] button");
      return false;
    }
      
    console.log(pickOptions[pickList.selectedIndex].value);

    return true;
  }
}