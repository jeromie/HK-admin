var global_discounts
var listDiscounts = function(options){

    /*
     * Variables accessible
     * in the class
     */
    var list_vars = {
        url : "",
        tablename : "",
        type: "",
        monthrangelimit: 3,
        discountTypeId:1,
        filters:{
        	brandTypes:[],
        	brands:[],
        	variantIds:[],
        	warehouseIds:[]
        }
    };

    var pageLoad=true

    /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
    var root = this;

    /*
     * Constructor
     */
    this.construct = function(options){
        $.extend(list_vars , options);
    };

    /*
     * Public method
     * Can be called outside class
     */
    this.generateIPList = function(){
        console.log(list_vars.type);
        $('#'+list_vars.tablename).DataTable({
		        "pageLength": 2,
		        "bDestroy": true,
		        "ajax": {
		        	"url":list_vars.url,
		        	"type":"POST",
		        	"data": function ( d ) {
		        		d.discountTypeId=list_vars.discountTypeId
		        		// d = $.extend(d, list_vars.filters);
		        		// console.log("fil==")
		        		// console.log(d)
		        		d.brandTypes=$('#'+list_vars.type+'-brand-type').val()
						d.brands=$('#'+list_vars.type+'-brand-name').val()	
						console.log("fil==")
						console.log(d)
						d.variantIds=$('#'+list_vars.type+'-variant-id').val()
						d.warehouseIds=$('#'+list_vars.type+'-store').val()
		            }
		        },
		      
		      "columnDefs": this.generateColumns(),
		     
		      // [
	       //    //   {
		      //    //    'targets': 0,
		      //    //    'checkboxes': {
		      //    //       'selectRow': true
		      //    //    }
		      //    // },
	       //      { 
	       //          "targets": 0,
	       //          render: function(data, type, row, meta){
	       //          	var renderStr='';
	       //          	for(var i=0;i<row['discounts'].length;i++) {
	       //          		var endPeriod
	       //          		if(row['discounts'][i]["end"] == null)
	       //          			endPeriod="Max"
	       //          		else
	       //          			endPeriod=row['discounts'][i]["end"]
	       //          		renderStr +='<p>'+row['discounts'][i]["start"]+' - '+endPeriod+' months | '+row['discounts'][i]["discountPercent"]+'%</p>'
	       //          	}
	       //          	return renderStr
	       //          }
	       //      },
	       //      { 
	       //          "targets": 1,
	       //          render: function(data, type, row, meta){
	                	
	       //          	return row['discountType']
	       //          }
	       //      },
	       //      { 
	       //          targets: 2,
	       //          orderable:  false,
	       //          render: function(data, type, row, meta){
	       //          	var renderStr='<a href="javascript:void(0);" class="modal-toggle" data-row=\''+JSON.stringify(row)+'\' onclick="showRangePopup(this);">View/Edit Range</a>'
	       //          	return renderStr

	       //          }
	       //      }

        	// ]  
		});
       
    };

    this.generateColumns = function(){
    	var columns=[];
    	var index=0
    	if(list_vars.type != "global-discounts"){
    		 columns.push({
					'targets': 0,
					'searchable': false,
					'orderable': false,
					'className': 'dt-body-center',
					'render': function (data, type, full, meta){
					 return '<input type="checkbox" name="'+list_vars.type+'-id[]" value="'+full['brand']+'">';
					}
		      });
    		index++;
    		columns.push({ 
	                "targets": index,
	                render: function(data, type, row, meta){
	                	
	                	return (meta.row+1)
	                }
	            });
    		index++;
    		if(jQuery.inArray( list_vars.type, [ "variant-discounts", "custom-discounts"] ) != -1){

    			columns.push({ 
	                "targets": index,
	                render: function(data, type, row, meta){
	                	
	                	return row['productVariantId']
	                }
	            });
	            index++;
    		}
    		
    		columns.push({ 
	                "targets": index,
	                 render: function(data, type, row, meta){
	                	
	                	return row['brandType']
	                }
	            });
    		index++;
    		columns.push({ 
	                "targets": index,
	                 render: function(data, type, row, meta){
	                	
	                	return row['brand']
	                }
	            });
    		index++;
    		if(jQuery.inArray( list_vars.type, [ "variant-discounts", "custom-discounts"] ) != -1){

    			columns.push({ 
	                "targets": index,
	                render: function(data, type, row, meta){
	                	
	                	return row['productVariantName']
	                }
	            });
	            index++;
    		}
    		if(list_vars.type == "custom-discounts"){
    			columns.push({ 
	                "targets": index,
	                render: function(data, type, row, meta){
	                	
	                	return row['storeName']
	                }
	            });
	            index++;
	            columns.push({ 
	                "targets": index,
	                render: function(data, type, row, meta){
	                	
	                	return row['zone']
	                }
	            });
	            index++;
    		}
    		
    	}
    	
    	

    	columns.push({ 
	                "targets": index,
	                render: function(data, type, row, meta){
	                	var renderStr='';
	                	var fullStr='';
	                	for(var i=0;i<row['discounts'].length;i++) {
	                		var endPeriod
	                		if(row['discounts'][i]["end"] == null)
	                			endPeriod="Max"
	                		else
	                			endPeriod=row['discounts'][i]["end"]
	                		fullStr +='<p>'+row['discounts'][i]["start"]+' - '+endPeriod+' months | '+row['discounts'][i]["discountPercent"]+'%</p>'
	                	}
	                	if(row['discounts'].length>0){
	                		renderStr +='<div rel="tooltip" title="'+fullStr+'">'
	                	}
	                	for(var i=0;i<row['discounts'].length;i++) {
	                		if(i>=list_vars.monthrangelimit){
	                			break;
	                		}
	                		var endPeriod
	                		if(row['discounts'][i]["end"] == null)
	                			endPeriod="Max"
	                		else
	                			endPeriod=row['discounts'][i]["end"]
	                		renderStr +='<p class="exp-month-range-tootltip" >'+row['discounts'][i]["start"]+' - '+endPeriod+' months | '+row['discounts'][i]["discountPercent"]+'%</p>'
	                		
	                	}
	                	if(row['discounts'].length>0){
	                		renderStr +='</div>'
	                	}
	                	return renderStr
	                }
	            });
    	index++;
    	columns.push({ 
	                "targets": index,
	                render: function(data, type, row, meta){
	                	
	                	return row['discountType']
	                }
	            });
    	index++;
    	columns.push({ 
	                targets: index,
	                orderable:  false,
	                render: function(data, type, row, meta){
	                	var renderStr='<a href="javascript:void(0);" class="modal-toggle" data-row=\''+JSON.stringify(row)+'\' onclick="showRangePopup(this,\''+list_vars.type+'\');">View/Edit Range</a>'
	                	return renderStr

	                }
	            });
    	console.log(columns)
    	return columns

    };


    this.setFilterValue=function(field,value) {
            list_vars.filters[field] = value;
            return value;
        }
    /*
     * Pass options when class instantiated
     */
    this.construct(options);

};


function showRangePopup(thisObj,type){
	console.log($(thisObj).data('row'))
	console.log("type==="+type)
	console.log("select all======")
	if(type == "global-discounts" && $('#rangeModalPopup .reset-opt-block').hasClass('hidden') == false){
		$('#rangeModalPopup').find('.reset-opt-block').addClass('hidden')

	}
	else{
		$('#rangeModalPopup .reset-opt-block').removeClass('hidden')
		if(type == "brand-discounts"){
			$('#rangeModalPopup').find('.reset-opt:not(.global-reset-opt):not(.hidden)').addClass('hidden')
			$('#rangeModalPopup').find('.global-discounts-reset-opt').removeClass('hidden')
		}
		else if(type == "variant-discounts"){
			$('#rangeModalPopup').find('.reset-opt:not(.hidden)').addClass('hidden')
			$('#rangeModalPopup').find('.global-discounts-reset-opt').removeClass('hidden')
			$('#rangeModalPopup').find('.brand-discounts-reset-opt').removeClass('hidden')
		}
		else if(type == "custom-discounts"){
			$('#rangeModalPopup').find('.reset-opt:not(.hidden)').addClass('hidden')
			$('#rangeModalPopup').find('.global-discounts-reset-opt').removeClass('hidden')
			$('#rangeModalPopup').find('.brand-discounts-reset-opt').removeClass('hidden')
			$('#rangeModalPopup').find('.variant-discounts-reset-opt').removeClass('hidden')
		}
	}
	//var selectedRows = $('#brand-discounts-table').DataTable().rows({ selected: true }).ids(true);
	var row_arr=[]
	var selectedRows = $( $('#'+type+'-table').DataTable().$('input[type="checkbox"]').map(function () {
	  console.log("val---"+$(this).is(":checked"))
	  if($(this).is(":checked")){
	  	row_arr.push($(this).val())
	  }
	  return row_arr
	} ) );
	console.log(selectedRows);
	console.log(row_arr)
	var data=$(thisObj).data('row')
	var appendRow=''
	for(var i=0;i<data['discounts'].length;i++){
		appendRow +='<tr>'
		var checkedstr='';
		if(data['discounts'][i]['hkOfferApplied'] == true){
			checkedstr='checked'
		}
		var endVal=data['discounts'][i]['end']
		if(endVal == null){
			endVal='Max'
		}
		appendRow +='<td class="text-center">'+data['discounts'][i]['start']+'</td>'+
                  '<td>-</td>'+
                  '<td><input type="text" class="input_field"  value="'+endVal+'"></td>'+
                  '<td><input type="text" class="input_field" value="'+data['discounts'][i]['discountPercent']+'"></td>'+
                  '<td class="text-center"><input type="checkbox" '+checkedstr+'/></td>'+
                  '<td class="text-center"><span style="color: red;" class="fosz14">&#10006;</span></td>'
		appendRow +='</tr>'

	}
	console.log($("#rangeModalPopup").find('.rangeTable tbody'))
	if(row_arr.length>1)
		$('#rangeModalPopup').find('.submitBtn').data('confirm',true)
	else
		$('#rangeModalPopup').find('.submitBtn').data('confirm',false)
	$("#rangeModalPopup").find('.rangeTable tbody').html(appendRow);
	$("#rangeModalPopup").find('.rangeModalVariantId').text(data['productVariantId'])
	$("#rangeModalPopup").find('.rangeModalVariantName').text(data['productVariantName'])
	$("#rangeModalPopup").find('.rangeModalStoreName').text(data['storeName'])
	$('.modal').toggleClass('is-visible');
}



function resetFilters(type,tableName){
	$('#'+type).find('.filter-filelds').val('')
	$('#'+type).find('.ms-clear').trigger('click')
	$('#'+tableName).DataTable().ajax.reload();
}
function applyFilters(tableName){
	$('#'+tableName).DataTable().ajax.reload();
}


function saveRangeOptions(thisObj){
	if($(thisObj).data('confirm') == true){
		var r = confirm("Are you sure you want to apply these settings to all selected records?");
	    if (r == true) {
	        txt = "You pressed OK!";
	    } else {
	        txt = "You pressed Cancel!";

	    }
	    console.log(txt)
	}
	
   

}
function getVariantFilterDetails(tabelem){
	var selectedBrands=tabelem.find('.filter-brand-name').val()
	if(selectedBrands.length>0){
		$.ajax({
		  url: "https://demo8727571.mockable.io/getVariantsFromBrand",
		  method: "POST",
			  data: { brands : selectedBrands },
		})
		  .done(function( data ) {
		  	var options=[]
		    for(var j=0;j<data['variant_ids'].length;j++){
		    	options.push({
		            name   : data['variant_ids'][j],
		            value  : data['variant_ids'][j],
		            checked: false
		        });
		    }
		    console.log(options)
		    tabelem.find('.filter-variant-id').multiselect('loadOptions', options );
		  });
	}
	else
		tabelem.find('.filter-variant-id').multiselect('loadOptions', [] );
}
$(document).ready( function () {
	global_discounts = new listDiscounts({  url : "https://demo8727571.mockable.io/list-global-discounts" , tablename : 'global-discounts-table' , type:'global-discounts' , discountTypeId:1 });
	global_discounts.generateIPList()
	// var brand_discounts = new listDiscounts({  url : "https://demo8727571.mockable.io/list-brand-discounts" , tablename : 'brand-discounts-table' , type:'brand-discounts' , discountTypeId:2 });
	// brand_discounts.generateIPList()
	// var variant_discounts = new listDiscounts({  url : "https://demo8727571.mockable.io/list-variant-discounts" , tablename : 'variant-discounts-table' , type:'variant-discounts' , discountTypeId:3 });
	// variant_discounts.generateIPList()
	// var custom_discounts = new listDiscounts({  url : "https://demo8727571.mockable.io/list-custom-discounts" , tablename : 'custom-discounts-table' , type:'custom-discounts' , discountTypeId:4 });
	// custom_discounts.generateIPList()

	$("body").tooltip({
		selector: '[rel=tooltip]',
		position: {  
			my: "left top",
        	at: "left bottom" 
        },
		content: function () {
              return $(this).attr('title');
          }
	})

	var totalFilterOptions={
		"brand-discounts":[],
		"variant-discounts":[],
		"custom-discounts":[],
	}
	 $('.filter-brand-type').multiselect({
            columns: 1,
            placeholder: 'Select',
            clear:true,
            onOptionClick: function( element, option ){
		        var thisOpt = $(option);
		        var tabelem=$(element).parent().parent().parent().parent()
	        	console.log(tabelem.attr('id'))
		        var options=[]
		        if(thisOpt.prop('checked')){
		        	if(jQuery.inArray( thisOpt.val(), totalFilterOptions[tabelem.attr('id')] ) == -1)
		        		totalFilterOptions[tabelem.attr('id')].push(thisOpt.val())
		        	
		        }
		        else{
		        	totalFilterOptions[tabelem.attr('id')].splice( totalFilterOptions[tabelem.attr('id')].indexOf(thisOpt.val()), 1 );
		        }

		        for(var i=0;i<totalFilterOptions[tabelem.attr('id')].length;i++){
		        		$.each( brands_mapping, function( key, value ) {
						 
						  if(value == totalFilterOptions[tabelem.attr('id')][i]){
						  	options.push({
					            name   : key,
					            value  : key,
					            checked: false
					        });
						  }
						});
		        	}
		        
		        console.log(options)
		        
				tabelem.find('.filter-brand-name').multiselect('loadOptions', options );
		    },
		    onClear: function( element ){
		    	
		    	var tabelem=$(element).parent().parent().parent().parent()
		    	totalFilterOptions[tabelem.attr('id')]=[]
		    	tabelem.find('.filter-brand-name').multiselect('loadOptions', [] );
		    }
        });


	 var totalBrandFilterOptions={
	 	"brand-discounts":[],
		"variant-discounts":[],
		"custom-discounts":[],
	 }
	 $('.filter-brand-name').multiselect({
            columns: 1,
            placeholder: 'Select',
            search: true,
            selectAll: true,
            clear: true,
            onOptionClick: function( element, option ){
		        var thisOpt = $(option);
		        var tabelem=$(element).parent().parent().parent().parent()
	        	console.log($(element).parent().parent().parent().parent())
		       
		        if(thisOpt.prop('checked')){
		        	if(jQuery.inArray( thisOpt.val(), totalBrandFilterOptions[tabelem.attr('id')] ) == -1)
		        		totalBrandFilterOptions[tabelem.attr('id')].push(thisOpt.val())
		        	
		        }
		        else{
		        	totalBrandFilterOptions[tabelem.attr('id')].splice( totalBrandFilterOptions[tabelem.attr('id')].indexOf(thisOpt.val()), 1 );
		        }
		        
		        if(tabelem.attr('id') != "brand-discounts"){
		        	if(totalBrandFilterOptions[tabelem.attr('id')].length>0){
			        	
			        	tabelem.find('.apply-filter').removeClass('disabled')
						tabelem.find('.apply-filter').removeAttr('disabled');
						tabelem.find('.clear-filter').removeClass('disabled');
						tabelem.find('.clear-filter').removeAttr('disabled');
					}
					else{
						if(tabelem.find('.apply-filter').hasClass('disabled') == false)
							tabelem.find('.apply-filter').addClass('disabled');
						if(tabelem.find('.clear-filter').hasClass('disabled') == false)
							tabelem.find('.clear-filter').addClass('disabled');
						tabelem.find('.apply-filter').attr('disabled', 'disabled' );
						tabelem.find('.clear-filter').attr('disabled', 'disabled' );
					}
					console.log(tabelem.find('.filter-brand-name').val())
					getVariantFilterDetails(tabelem)
		        }
		        

		    },
		    onSelectAll   : function( element, selected ){
		    	var tabelem=$(element).parent().parent().parent().parent()
		    	if(tabelem.attr('id') != "brand-discounts"){
			    	if(selected>0){
			    		tabelem.find('.apply-filter').removeClass('disabled')
						tabelem.find('.apply-filter').removeAttr('disabled');
						tabelem.find('.clear-filter').removeClass('disabled');
						tabelem.find('.clear-filter').removeAttr('disabled');
					}
					else{
						totalBrandFilterOptions[tabelem.attr('id')]=[]
						if(tabelem.find('.apply-filter').hasClass('disabled') == false)
							tabelem.find('.apply-filter').addClass('disabled');
						if(tabelem.find('.clear-filter').hasClass('disabled') == false)
							tabelem.find('.clear-filter').addClass('disabled');
						tabelem.find('.apply-filter').attr('disabled', 'disabled' );
						tabelem.find('.clear-filter').attr('disabled', 'disabled' );
					}
					getVariantFilterDetails(tabelem)
					console.log(tabelem.find('.filter-brand-name').val())
				}
		    },
		    onClear: function( element ){
		    	var tabelem=$(element).parent().parent().parent().parent()
		    	totalBrandFilterOptions[tabelem.attr('id')]=[]
		    	if(tabelem.attr('id') != "brand-discounts"){
			    	tabelem.find('.apply-filter').attr('disabled', 'disabled' );
					tabelem.find('.clear-filter').attr('disabled', 'disabled' );
					tabelem.find('.filter-variant-id').multiselect('loadOptions', [] );
				}

		    }

        });

	 $('.filter-variant-id,.filter-zone,.filter-store').multiselect({
            columns: 1,
            placeholder: 'Select',
            search: true,
            selectAll: true,
            clear: true,

        });



	 // Handle click on "Select all" control
	$('#brand-discounts-select-all').on('click', function(){
	   // Get all rows with search applied
	   console.log("checked=="+this.checked)
	   var rows = $('#brand-discounts-table').DataTable().rows({ 'search': 'applied' }).nodes();
	   // Check/uncheck checkboxes for all rows in the table
	   $('input[type="checkbox"]', rows).prop('checked', this.checked);
	});

	$('#variant-discounts-select-all').on('click', function(){
	   // Get all rows with search applied
	   console.log("checked=="+this.checked)
	   var rows = $('#variant-discounts-table').DataTable().rows({ 'search': 'applied' }).nodes();
	   // Check/uncheck checkboxes for all rows in the table
	   $('input[type="checkbox"]', rows).prop('checked', this.checked);
	});

	$('#custom-discounts-select-all').on('click', function(){
	   // Get all rows with search applied
	   console.log("checked=="+this.checked)
	   var rows = $('#custom-discounts-table').DataTable().rows({ 'search': 'applied' }).nodes();
	   // Check/uncheck checkboxes for all rows in the table
	   $('input[type="checkbox"]', rows).prop('checked', this.checked);
	});


		

});