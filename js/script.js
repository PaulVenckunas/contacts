'use strict' //remove in production version

var tableHeaders=[
  {"key":"active", "label":"", "display":false, "sortable":false},
  {"key":"id", "label":"Id", "display":false, "sortable":false},
  {"key":"name", "label":"Name", "display":true, "sortable":true},
  {"key":"surname", "label":"Surname", "display":true, "sortable":true},
  {"key":"city", "label":"City", "display":true, "sortable":true},
  {"key":"email", "label":"Email", "display":true, "sortable":false},
  {"key":"phone", "label":"Phone", "display":true, "sortable":false},
  {"key":"buttons", "label":"", "display":true, "sortable":false}
];

var headersLength=tableHeaders.length;

/**
 * Changes clicked button color of navigation menu buttons
 * @param {number} index - index 0-n which represents order index of navigation button
*/
function toggleActive(index){
  $('.page-navigator-button').removeClass('active');
  $('.page-navigator-button').eq(index).addClass('active');
} //end toggleActive()

/**
* Animates drop down menu by setting new container height
*/
function toggleMenu(){
  var getHeight= $('.drop-menu-container').height();
  if(getHeight == 0){
    $('.drop-menu-container').height('178px');
  }else{
    $('.drop-menu-container').height('0px');
  }
} //end of toggleMenu()

$(function(){

  //Adds click event to Sync link and updates the time and date
  $('#sync').on('click', dateCurrent);
  //Adds mousedown event to contact filter button "FILTER"
  $('#filter-button').on('mousedown', filterContacts);

  //sukuria data uzkrovus puslapi
  dateCurrent();

  /**
 * Gets current time and date and changes text
 */
  function dateCurrent(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
      dd = '0'+dd
    }
    if(mm<10) {
      mm = '0'+mm
    }
    var d = new Date(); // for now
    var hours = today.getHours();
    var mins = today.getMinutes();
    var secs = today.getSeconds();
    if(hours<10){
      hours="0"+hours;
    }
    if(mins<10){
      mins="0"+mins;
    }
    if(secs<10){
      secs="0"+secs;
    }
    today = yyyy+"-"+mm+"-"+dd+" "+hours+":"+mins+":"+secs;
    $('#current-time').text(today);
  } //end of dateCurrent()

  //global scope variable
  var filterActive=false;
  //global scope variable
  var matchedWords=[];

  /**
  * Filters contacts by input data and selections, and  redraws the table
  */
  function filterContacts(){
    matchedWords=[];
    filterActive=true;
    var value = $('#city-selector').val();
    var valueChecked = true;
    if( $('#show-active:checked').length == 0 ){
      valueChecked = false;
    };

    var searchWord = $('#name-search').val().trim();
    var pattern = new RegExp(searchWord, 'gi');
    for(var i=0; i<contactsData.length; i++){
      var testword = contactsData[i]['name'];
      if(testword.match(pattern)!= null){
        var filteredData = contactsData[i];
        if(value == 'none' && valueChecked == true){
          if(contactsData[i]['active'] == true){
            matchedWords.push(filteredData);
          }
        }else if( value == filteredData['city'] && (valueChecked == filteredData['active'] || filteredData['active']== undefined) ){
          matchedWords.push(filteredData);
        }else if(value == 'none' && (valueChecked == filteredData['active'] || filteredData['active']== undefined )) {
          matchedWords.push(filteredData);
        }
      }
    }
    //Perpiesiama nauja lentele su isfiltruotais duomenimis
    createTable(matchedWords);
  } //end of filterContacts()

  /**
  * Sorts data alphabetically A-Z and Z-A. Sorts data by Column name and direction and redraws the table.
  * @param {object} tableHeaderName - HTML element object of selected table header
  * @param {string} direction - 'a' for ascending order or 'z' for descending order
  */
  function sortData(tableHeaderName, direction){
    var title = tableHeaderName.innerHTML;
    //ieskoma pagal kuri stulpelio pavadinima norima surusiuoti
    for(var i = 0; i<tableHeaders.length; i++){
      if(tableHeaders[i]['label']===title){
        var categoryToSortBy = tableHeaders[i]['key'];
        // surasti kelintas pavadinimas eileje
        break;
      }
    }
    //Perrusiuojami isfiltruoti VISI duomenys pagal rusiavimo krypti
    if(direction == 'a'){
      var sortedAll = contactsData.sort(function(a, b){
        return a[categoryToSortBy] > b[categoryToSortBy]
      });
    }else if(direction == 'z'){
      var sortedAll = contactsData.sort(function(a, b){
        return a[categoryToSortBy] < b[categoryToSortBy]
      });
    }
    if(direction == 'a'){
      var sortedMatched = matchedWords.sort(function(a, b){
        return a[categoryToSortBy] > b[categoryToSortBy]
      });
    }else if(direction == 'z'){
      var sortedMatched = matchedWords.sort(function(a, b){
        return a[categoryToSortBy] < b[categoryToSortBy]
      });
    }

    matchedWords=sortedMatched;
    contactsData=sortedAll;

    if(filterActive == true){
      var sorted = matchedWords;
    }else{
      var sorted = contactsData;
    }
    createTable(sorted);
  } //end of sortData()

  /**
  * Changes selected row color by changing class of selected row. Updates and changes corresponding fields in contact card. For phone number and email adress fields gives special href attributes with information. Trims data if it's length is longer than 15 characters and replaces trimmed characters with "..."
  * @param {number} index - Index of selected row in a current table
  */
  function selectRow(index){
    $('tr.active').removeClass('active');
    $('tr.data').eq(index).addClass('active');
    var selectionNames=["name", "surname", "city", "email", "phone"];

    for(var i = 0; i<selectionNames.length; i++){
      var name = selectionNames[i]
      var selector='#selected-'+ name;
      //Pakeiciamas vidinis text su pazymetos eilutes lenteleje duomenimis
      $(selector).text(function(){
        if(name == 'email'){
          var href='mailto:'+contactsData[index][name];
          $(selector).attr('href', href);
        }else if(name == 'phone'){
          var href='tel:'+contactsData[index][name].replace(/ /g, '');
          $(selector).attr('href', href);
        }
        if( contactsData[index][name].length<15 ){
          return contactsData[index][name];
        }else{
          return contactsData[index][name].toString().slice(0, 14).concat('...');
        }
      });
    }
  } //end of selectRow()

  /**
  * Deletes object in in both data arrays and redraws table
  * @param {object} el - Delete button element object
  */
  function deleteElement(el){
    var removeId = parseInt(el.getAttribute("value"));
    //Pasalina eilutes duomenu objekta is viso masyvo
    for(var i = 0; i<contactsData.length;i++){
      if(removeId === contactsData[i]['id']){
        contactsData.splice(i,1);
        break;
      }
    }
    //Pasalina eilutes duomenu objekta is isfiltruoto masyvo
    for(var ii = 0; ii<matchedWords.length;ii++){
      if(removeId === matchedWords[ii]['id']){
        matchedWords.splice(ii,1);
        break;
      }
    }
    if(filterActive == true){
      createTable(matchedWords);
      // setTimeout( function(){createTable(matchedWords);} , 1 );
    }else{
      createTable(contactsData);
      // setTimeout(function(){createTable(contactsData);} , 1 );
    }
    //Is naujo sukuria pasirenkamus miestus(jei tokiu miestu nera - pasirinkima istrina)
    createCityList(contactsData);
  }//end of selectRow()

  //sukuria lenteliu stulpeliu pavadinimus uzkrovus puslapi
  createTableHead(contactsData);
  //atvaizduoja kontaktu duomenis uzkrovus puslapi
  createTable(contactsData);

  /**
  * Creates headers for table columns and adds click events
  * @param {array} data - Contacts' Data array
  */
  function createTableHead(data){
    //sukuriama naujas lenteles elementas
    var table = $('<table id="contact-table"></table>');
    //Sukuriama stulpeliu pavadinimu eilute
    var tableHead=$('<tr class="table-headers"></tr>');
    var classNumber=0;
    for(var a=0; a<tableHeaders.length; a++){
      if(tableHeaders[a]['display']==true){ //jei reikia atvaizduoti
        var tableHeadTitle = $('<th class="'+tableHeaders[a].key+' th'+ ++classNumber +'"></th>');
        if(tableHeaders[a]['sortable']==true){
          tableHeadTitle.on('mousedown', function(event){
            var target = event.target || event.srcElement;
            var direction="";
            if(target.classList.contains('sorted-a')){
              $('.sorted-a').removeClass("sorted-a");
              $('.sorted-z').removeClass("sorted-z");
              target.classList.remove('sorted-a');
              target.classList.add('sorted-z');
              direction = 'z';
            }else if(target.classList.contains('sorted-z')){
              $('.sorted-a').removeClass("sorted-a");
              $('.sorted-z').removeClass("sorted-z");
              target.classList.remove('sorted-z');
              target.classList.add('sorted-a');
              direction = 'a';
            }else if(!target.classList.contains('sorted-a')) {
              $('.sorted-a').removeClass("sorted-a");
              $('.sorted-z').removeClass("sorted-z");
              target.classList.add('sorted-a');
              direction = 'a';
            }
            sortData(this, direction);
          });
        }

        if(tableHeaders[a]['label']!=''){
          tableHeadTitle.text(tableHeaders[a]['label']);
        }
        tableHead.append(tableHeadTitle);
      }
    }
    table.append(tableHead);
    $('#contact-table-container').append(table);
  } //end of createTableHead(data){

  /**
  * Deletes object in in both data arrays and redraws table
  * @param {array} data - Contacts' data array
  */
  function createTable(data){
    console.log('Hello');
    var table = $('#contact-table');
    $('tr.data').remove();
    // atvaizduojami kontaktu duomenys
    for(var i=0;i<data.length;i++){
      var tableRow= $('<tr class="data inactive"></tr>');
      for(var ii=0; ii<tableHeaders.length;ii++){
        // nustatoma ar rodyti stulpeli, jei ne - praleidziama
        if(tableHeaders[ii]['display']==true){
          var tableData=$('<td></td>');
          tableData.addClass(tableHeaders[ii].key);
          var innerText=data[i][tableHeaders[ii]['key']];
          //tikrinamas kiekviena irasas, tikrinama ar tarp duomenu yra toks property
          // tikrinama ar atvaizduoti is duomenu json, ar ideti kita turini (mygtukai, ikona...)
          if(data[i][tableHeaders[ii]['key']]!==undefined ){
            if( [tableHeaders[ii]['key']] =='active'){
              if( data[i][tableHeaders[ii]['key']] == true ){
                var innerText = '<i class="fa fa-eye" aria-hidden="true"></i>';
              }else{
                var innerText = '<i class="fa fa-eye-slash" aria-hidden="true"></i>';
              }
            }else{
              var innerText ='';
              //sukuriamas turinys visiems duomenu <td></td> elementams
              if(tableHeaders[ii]['key']=='name'){
                if( data[i]['active']== true){
                  innerText+='<i class="fa fa-eye akis" aria-hidden="true"></i>'
                }else{
                  innerText+='<i class="fa fa-eye-slash akis" aria-hidden="true"></i>';
                }
              }
              innerText+=data[i][tableHeaders[ii]['key']];
            }
          }else if([tableHeaders[ii]['key']]=="buttons"){
            var editButton=$('<button class="btn btn-edit"><i class="fa fa-pencil" aria-hidden="true"></i></button>');
            var deleteButton=$('<button class="btn btn-delete"><i class="fa fa-trash" aria-hidden="true"></i></button>');
            deleteButton.attr("value",data[i]['id']);
            tableData.append(editButton);
            tableData.append(deleteButton);
            (function(i){
              deleteButton.on('mousedown', function(){
                deleteElement(this);
              })
            }(i));
          }else{
            //jei duomenu nera
            var innerText="N/A";
          }
          // idedamas tabledata turinys
          tableData.html(innerText);
          tableRow.append(tableData);
        }//end if
      }//end for
      (function(i){
          tableRow.on('mousedown', function(){
            selectRow(i);
          })
        }(i));

      table.append(tableRow);
    }
  } //end of createTable()

  //sukuria miestu sarasa uzkrovus puslapi
  createCityList(contactsData);

  /**
  * Filters out and creates city list as select options.
  * @param {array} contactsData - Contacts' data array
  */
  function createCityList(data){
    $('option.city-name').remove();
    var cityList =[];
    for(var i =0; i<data.length; i++){
      if(cityList.length==0){
        cityList.push(data[i]['city']);
        var cityOption = $('<option class="city-name"></option>');
        var cityName=data[i]['city'].trim();
        cityOption.attr("value", cityName)
        cityOption.text( cityName );
        $('#city-selector').append(cityOption);
      }else{
        for(var ii=0; ii<cityList.length; ii++){
          if(cityList[ii] == data[i]['city']){
            break;
          }else if(cityList[ii] != data[i]['city'] && ii+1>=cityList.length){
            cityList.push(data[i]['city']);
            var cityOption = $('<option class="city-name"></option>');
            var cityName=data[i]['city'].trim();
            cityOption.attr("value", cityName)
            cityOption.text( cityName );
            $('#city-selector').append(cityOption);
          }
        }
      }
    }
  } //end of createCityList()

}); // end of Jquery document.ready function
