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
		        	//processData:false,
		        	dataType: 'json',
            		contentType: 'application/json',
		        	"data": function ( d ) {
		        		d.discountTypeId=list_vars.discountTypeId
		        		// d = $.extend(d, list_vars.filters);
		        		// console.log("fil==")
		        		// console.log(d)
		        		
		        		console.log("val id=="+$('#'+list_vars.type+'-brand-type').val())
		        		d.brandTypes=($('#'+list_vars.type+'-brand-type').val() == undefined || $('#'+list_vars.type+'-brand-type').val() == "")?[]:$('#'+list_vars.type+'-brand-type').val()
						d.brands=($('#'+list_vars.type+'-brand-name').val() == undefined || $('#'+list_vars.type+'-brand-name').val() == "")?[]:$('#'+list_vars.type+'-brand-name').val()	
						console.log("fil==")
						console.log(d)
						d.variantIds=($('#'+list_vars.type+'-variant-id').val() == undefined || $('#'+list_vars.type+'-variant-id').val() == "")?[]:$('#'+list_vars.type+'-variant-id').val()
						d.warehouseIds=($('#'+list_vars.type+'-store').val() == undefined || $('#'+list_vars.type+'-store').val() == "")?[]:$('#'+list_vars.type+'-store').val()
						return JSON.stringify(d)
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
						var jsonObj={"brand":full['brand'],"variantId":full['productVariantId'],"warehouseId":full['warehouseId']}
					 return '<input type="checkbox" onclick="updatedSelectAllCheckbox(\''+list_vars.type+'\',this)" name="'+list_vars.type+'-id[]" data-brand="'+jsonObj["brand"]+'" data-variant-id="'+jsonObj["variantId"]+'" data-warehouse-id="'+jsonObj["warehouseId"]+'"value="'+jsonObj["brand"]+'">';
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


function updatedSelectAllCheckbox(type,thisObj){
	console.log("entered=="+type)
	if($(thisObj).is(':checked') == false){
		$("#"+type+"-select-all").prop( "checked", false );
	}
}

function showRangePopup(thisObj,type){
	console.log($(thisObj).data('row'))
	console.log("type==="+type)
	console.log("select all======")
	$('.submitBtn').removeAttr('disabled')
	$('.submitBtn').removeClass('disabled')
	$('.addExpiryRange').removeAttr('disabled')
	$('.addExpiryRange').removeClass('disabled')
	$("#rangeModalPopup").data("row",$(thisObj).data('row'))
	$("#rangeModalPopup").data("type",type)
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
	  	row_arr.push({
	  		"brand":$(this).data("brand"),
	  		"variantId":$(this).data("variant-id"),
	  		"warehouseId":$(this).data("warehouse-id")
	  	})
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
		var removeStr=''
		if(i != 0 && i != (data['discounts'].length-1))
			removeStr='<span style="color: red;cursor:pointer;" class="fosz14" onclick="adjustExpiryRange(this)">&#10006;</span>'

		// if(i == (data['discounts'].length-2)){
		// 	appendRow +='<td class="text-center">'+data['discounts'][i]['start']+'</td>'+
  //                 '<td>-</td>'+
  //                 '<td><input type="number" min="'+data['discounts'][i]['start']+'" class="input_field expiry-end-limits-inp" oninput="updateNextExpiryLimit(this)" value="'+endVal+'"></td>'+
  //                 '<td><input type="number" min="0" class="input_field" value="'+data['discounts'][i]['discountPercent']+'"></td>'+
  //                 '<td class="text-center"><input type="checkbox" '+checkedstr+'/></td>'+
  //                 '<td class="text-center">'+removeStr+'</td>'
		// }
		// else{
		var classStr='';
		var endClassStr='';
		var disabledStr=''
		if(i == (data['discounts'].length-1)){
			classStr ='expiry-start-limits-inp'
		}
		
		if(i == (data['discounts'].length-2)){
			endClassStr ='expiry-end-limits-inp'
		}
		else{
			disabledStr='disabled="disabled"'
		}

		appendRow +='<td class="text-center"><span class="expiry-start-lbl '+classStr+'">'+data['discounts'][i]['start']+'</span></td>'+
              '<td>-</td>';
        if(i == (data['discounts'].length-1))
        	appendRow +='<td><label class="expiry-end-lbl">'+endVal+'</label></td>'
       	else
        	appendRow +='<td><input type="number" min="'+data['discounts'][i]['start']+'" class="input_field expiry-end-lbl '+endClassStr+'" oninput="updateNextExpiryLimit(this)" value="'+endVal+'" '+disabledStr+'></td>'
        appendRow +='<td><input type="number" min="0" class="input_field discount-percent-lbl" value="'+data['discounts'][i]['discountPercent']+'"></td>'+
              '<td class="text-center"><input class="hk-offer-lbl" type="checkbox" '+checkedstr+'/></td>'+
              '<td class="text-center">'+removeStr+'</td>'
		// }
		
		
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

function adjustExpiryRange(thisObj){
	var parentDiv=$(thisObj).parent().parent().prev()  
	var currDiv=$(thisObj).parent().parent().find('.expiry-end-lbl')
	var endval=currDiv.val()
	if(currDiv.hasClass('expiry-end-limits-inp')){
		parentDiv.find('.expiry-end-lbl').addClass('expiry-end-limits-inp')
		parentDiv.find('.expiry-end-lbl').removeAttr('disabled')
	} 
	console.log("endval=="+endval)
	console.log(parentDiv.find('.expiry-end-lbl'))
	parentDiv.find('.expiry-end-lbl').val(endval)
	$(thisObj).parent().parent().remove()

}

function saveRangeOptions(thisObj){
	var saveData=true
	if($(thisObj).data('confirm') == true){
		saveData=false
		var r = confirm("Are you sure you want to apply these settings to all selected records?");
	    if (r == true) {
	        saveData=true
	    } else {
	        saveData=false

	    }
	    //console.log(txt)
	}
	if(saveData == false)
		return;
	var discounts=[]
	$(".rangeTable tbody tr").each(function() {
		console.log($(this))
		var discountList={}
		if($(this).find('.hk-offer-lbl').is(':checked'))
			discountList['hkOfferApplied']=true
		else
			discountList['hkOfferApplied']=false

		discountList['start']=$(this).find('.expiry-start-lbl').text()
		var endval=""
		if($(this).find('.expiry-end-lbl').val() == "")
			endval=null
		else
			endval=$(this).find('.expiry-end-lbl').val()
		discountList['end']=endval
		discountList['discountPercent']=$(this).find('.discount-percent-lbl').val()
		discounts.push(discountList)
	});
	console.log(discounts)
	console.log($("#rangeModalPopup").data('row'))
	var popupData=$("#rangeModalPopup").data('row')
	var type=$("#rangeModalPopup").data('type')
	var data={}
	data['discounts']=discounts
	data['discountTypeId']=discounts_id_list[type]
	data['rows']=[]
	var row_arr=[]
	var selectedRows = $( $('#'+type+'-table').DataTable().$('input[type="checkbox"]').map(function () {
	  if($(this).is(":checked")){
	  	row_arr.push({
	  		"brand":$(this).data("brand"),
	  		"variantId":$(this).data("variant-id"),
	  		"warehouseId":$(this).data("warehouse-id")
	  	})
	  }
	  return row_arr
	} ) );
	if(row_arr.length>0){
		data['rows']=row_arr
	}
	else{
		data['rows'].push({
			"warehouseId":popupData.warehouseId,
			"variantId":popupData.productVariantId,
			"brand":popupData.brand
		})
	}
	
	$.ajax({
		  url: "https://demo8727571.mockable.io/editDiscounts",
		  method: "POST",
			  data: data,
		})
	  .done(function( data ) {
	  	$('#'+type+'-table').DataTable().ajax.reload();
	  	$('.modal').toggleClass('is-visible');
	  });
	
   

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


function updateNextExpiryLimit(thisObj){
	var val= $(thisObj).val()
	$('.expiry-start-limits-inp').text(parseInt(val)+1)
	

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

	var defaultSlab=6
	$('.addExpiryRange').on('click', function(){
	   var parentObj=$('#rangeModalPopup .expiry-end-limits-inp').parent().parent()
	   var cloneObj=parentObj.clone()
	   parentObj.find('.expiry-end-limits-inp').attr("disabled","disabled")
	   var endval=parentObj.find('.expiry-end-limits-inp').val()
	   parentObj.find('.expiry-end-limits-inp').removeClass('expiry-end-limits-inp')
	   cloneObj.find('.input_field').val('')
	   cloneObj.find('.expiry-end-limits-inp').val(parseInt(endval)+defaultSlab)
	   cloneObj.find('.expiry-end-limits-inp').attr('min',parseInt(endval)+1)
	   cloneObj.find('.expiry-start-lbl').text(parseInt(endval)+1)
	   $('#rangeModalPopup .expiry-start-limits-inp').text(parseInt(endval)+defaultSlab+1)
	   parentObj.after(cloneObj)
	   $('.addExpiryRange').attr('disabled','disabled')
	   if($('.addExpiryRange').hasClass('disabled') == false)
			$('.addExpiryRange').addClass('disabled')
	   if($('.submitBtn').hasClass('disabled') == false)
	   		$('.submitBtn').attr('disabled','disabled')
	   $('.submitBtn').addClass('disabled')

	});	

	$('body').on('input','#rangeModalPopup .input_field',function(e){
		// if($(this).hasClass('expiry-end-lbl')){
		// 	console.log()
			
		// }
		var enableSubmitBtn=true
		var enableSubmitCheck=true
		var startval=parseInt($(this).parent().parent().find('.expiry-start-lbl').text())
		console.log(startval+ "==>"+ parseInt($(this).parent().parent().find('.expiry-end-lbl').val()))
		if(startval > parseInt($(this).parent().parent().find('.expiry-end-lbl').val())){
			console.log("error")
			enableSubmitBtn=false
			if($(this).parent().parent().find('.expiry-end-lbl').hasClass('error') == false ){

				$(this).parent().parent().find('.expiry-end-lbl').addClass('error') 
				// $('.submitBtn').attr('disabled','disabled')
	   //      	if($('.submitBtn').hasClass('disabled') == false)
		  //  			$('.submitBtn').addClass('disabled')
		   		
			}
		}
		else{
			$(this).parent().parent().find('.expiry-end-lbl').removeClass('error') 
				// $('.submitBtn').attr('disabled','disabled')
		  //  		$('.submitBtn').removeClass('disabled')
		}
		var $emptyFields = $('#rangeModalPopup .input_field').filter(function() {
            return $.trim(this.value) === "";
        });
		console.log("len-====="+$emptyFields.length)
        if (!$emptyFields.length) {
      //       $('.addExpiryRange').removeAttr('disabled')
	   		// $('.addExpiryRange').removeClass('disabled')
	   		// $('.submitBtn').removeAttr('disabled')
	   		// $('.submitBtn').removeClass('disabled')
        }
        else{

       //  	$('.addExpiryRange').attr('disabled','disabled')
       //  	if($('.addExpiryRange').hasClass('disabled') == false)
	   			// $('.addExpiryRange').addClass('disabled')
	   		enableSubmitCheck=false
	   		// $('.submitBtn').attr('disabled','disabled')
      //   	if($('.submitBtn').hasClass('disabled') == false)
	   		// 	$('.submitBtn').addClass('disabled')
        }
        console.log("enableSubmitBtn="+enableSubmitBtn+"==="+enableSubmitCheck)
        if(enableSubmitBtn== true && enableSubmitCheck==true){
        	$('.submitBtn').removeAttr('disabled')
	   		$('.submitBtn').removeClass('disabled')
	   		$('.addExpiryRange').removeAttr('disabled')
	   		$('.addExpiryRange').removeClass('disabled')
        }
        else{
        	$('.submitBtn').attr('disabled','disabled')
        	if($('.submitBtn').hasClass('disabled') == false)
	   			$('.submitBtn').addClass('disabled')
	   		$('.addExpiryRange').attr('disabled','disabled')
        	if($('.addExpiryRange').hasClass('disabled') == false)
	   			$('.addExpiryRange').addClass('disabled')
        }
	   
	});

});