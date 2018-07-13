var global_discounts
var defaultSlab=6
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
        var enableOpt=true
        if(list_vars.type == "global-discounts")
        	enableOpt=false
        $('#'+list_vars.tablename).DataTable({
		         processing: true,
			    "language": {
			        "processing": '<i class="fa fa-spinner fa-spin"></i> Loading...' //add a loading image,simply putting <img src="loader.gif" /> tag.
			    },
		        "pageLength": 50,
		        "bDestroy": true,
		        "bLengthChange": enableOpt,
				"bPaginate": enableOpt,
		        "ordering": enableOpt,
		        "searching": enableOpt,
		        "bInfo" : enableOpt,
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
    		// index++;
    		// columns.push({ 
	     //            "targets": index,
	     //            render: function(data, type, row, meta){
	                	
	     //            	return (meta.row+1)
	     //            }
	     //        });
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
	                orderable:  false,
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
	                	else{
	                		renderStr +='<span style="padding-left: 1.5em">--</span>'
	                	}
	                	if(list_vars.type == "global-discounts"){
	                		renderStr=fullStr
	                	}
	                	return renderStr
	                }
	            });
    	index++;
    	var orderDiscountType=true
    	if(list_vars.type == "global-discounts")
    		orderDiscountType=false
    	columns.push({ 
	                "targets": index,
	                orderable:  orderDiscountType,
	                render: function(data, type, row, meta){
	                	
	                	return row['discountType']
	                }
	            });
    	index++;
    	columns.push({ 
	                targets: index,
	                orderable:  false,
	                render: function(data, type, row, meta){
	                	var renderStr='<a href="javascript:void(0);" class="modal-toggle" data-discount-type-id="'+list_vars.discountTypeId+'" data-brand="'+row['brand']+'" data-variant-id="'+row['productVariantId']+'" data-row=\''+JSON.stringify(row)+'\' onclick="showRangePopup(this,\''+list_vars.type+'\');">View/Edit Range</a>'
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
	//console.log($(thisObj).data('row'))
	$('#rangeModalPopup').find('.table-cover').removeClass('disabled')
	$('.reset-select-radio').removeAttr('checked')
	$('#resetDiscountsForm')[0].reset()
	var data=$(thisObj).data('row')
	if(data['discounts'].length>0){
		$('.submitBtn').removeAttr('disabled')
		$('.submitBtn').removeClass('disabled')
		$('.addExpiryRange').removeAttr('disabled')
		$('.addExpiryRange').removeClass('disabled')
	}
	else{
		$('.addExpiryRange').attr('disabled','disabled')
		if($('.addExpiryRange').hasClass('disabled') == false)
			$('.addExpiryRange').addClass('disabled')
		if($('.submitBtn').hasClass('disabled') == false)
			$('.submitBtn').addClass('disabled')
		$('.submitBtn').attr('disabled','disabled')
	}
	
	$("#rangeModalPopup").data("row",$(thisObj).data('row'))
	$("#rangeModalPopup").data("type",type)
	console.log("hasclass hidden=="+$('#rangeModalPopup').find('').hasClass('hidden'))
	if(type == "global-discounts"){
		if($('#rangeModalPopup .reset-opt-block').hasClass('hidden') == false)
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
	
	var appendRow=''
	var dicountsArr=data['discounts']
	if(dicountsArr.length == 0){
		dicountsArr.push({"start":1,"end":defaultSlab,"discountPercent":"","hkOfferApplied":false})
		dicountsArr.push({"start":(defaultSlab+1),"end":null,"discountPercent":"","hkOfferApplied":false})
	}
	for(var i=0;i<dicountsArr.length;i++){
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
		var extraStyle=''
		if(i == 0 && dicountsArr.length != 2)
			extraStyle='display:none;'
		// if(i != 0 && i != (data['discounts'].length-1))
		if(i == (data['discounts'].length-1))
			extraStyle='display:none;'
		removeStr='<span style="color: red;cursor:pointer;'+extraStyle+'" class="fosz14 remove-exp-cls" onclick="adjustExpiryRange(this)">&#10006;</span>'


		var classStr='';
		var endClassStr='';
		var disabledStr=''

		if(i == 0)
			endClassStr +="expiry-first-record "
		if(i == (dicountsArr.length-1)){
			classStr ='expiry-start-limits-inp'
		}
		
		if(i == (dicountsArr.length-2)){
			endClassStr +='expiry-end-limits-inp'
		}
		else{
			disabledStr='disabled="disabled"'
		}

		appendRow +='<td class="text-center"><span class="expiry-start-lbl '+classStr+'">'+dicountsArr[i]['start']+'</span></td>'+
              '<td>-</td>';
        if(i == (dicountsArr.length-1))
        	appendRow +='<td><label class="expiry-end-lbl">'+endVal+'</label></td>'
       	else
        	appendRow +='<td><input type="number" min="'+dicountsArr[i]['start']+'" class="input_field expiry-end-lbl '+endClassStr+'" oninput="updateNextExpiryLimit(this)" value="'+endVal+'" '+disabledStr+'></td>'
        appendRow +='<td><input type="number" min="0" max="100" class="input_field discount-percent-lbl" value="'+dicountsArr[i]['discountPercent']+'"></td>'+
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
	if(data['brand'] == null){
		$("#rangeModalPopup").find('.rangeModalBrandName').parent().hide()
	}
	else{
		$("#rangeModalPopup").find('.rangeModalBrandName').text(data['brand']+" ("+data['brandType']+")")
		$("#rangeModalPopup").find('.rangeModalBrandName').parent().show()
	}
	if(data['productVariantId'] == null){
		$("#rangeModalPopup").find('.rangeModalVariantId').parent().hide()
		$("#rangeModalPopup").find('.rangeModalVariantName').parent().hide()
	}
	else{
		$("#rangeModalPopup").find('.rangeModalVariantId').text(data['productVariantId'])
		$("#rangeModalPopup").find('.rangeModalVariantName').text(data['productVariantName'])
		$("#rangeModalPopup").find('.rangeModalVariantId').parent().show()
		$("#rangeModalPopup").find('.rangeModalVariantName').parent().show()
	}
	if(data['storeName'] == null){
		$("#rangeModalPopup").find('.rangeModalStoreName').parent().hide()
	}
	else{
		$("#rangeModalPopup").find('.rangeModalStoreName').text(data['storeName']+" ("+data['zone']+")")
		$("#rangeModalPopup").find('.rangeModalStoreName').parent().show()
	}
	
	
	
	$('.modal').toggleClass('is-visible');
	generateResetBlocks(type)

	
}

function generateResetBlocks(type){
	var discounts_arr=[]
	if(type == "brand-discounts")
		discounts_arr=["global-discounts"]
	else if(type == "variant-discounts")
		discounts_arr=["global-discounts","brand-discounts"]
	else if(type == "custom-discounts")
		discounts_arr=["global-discounts","brand-discounts","variant-discounts"]
	console.log(discounts_arr)
	for(item in discounts_arr){
		//console.log("item=="+item)
		generateResetBlockContent(discounts_arr[item])
	}

}


function generateResetBlockContent(type){
	var rowdata={}
	var discounts=[]
	var data={}
	if(type == "global-discounts"){
		rowdata=$('#'+type).find('.modal-toggle[data-discount-type-id="1"]').data('row')
		console.log(rowdata["discounts"])
	}
	else if(type == "brand-discounts"){
		console.log("brand disc===")
		console.log($("#rangeModalPopup").data("row"))
		data=$("#rangeModalPopup").data("row")
		rowdata=$('#'+type).find('.modal-toggle[data-brand="'+data['brand']+'"]').data('row')
	}
	else if(type == "variant-discounts"){
		data=$("#rangeModalPopup").data("row")
		rowdata=$('#'+type).find('.modal-toggle[data-variant-id="'+data['productVariantId']+'"]').data('row')
	}
	discounts=rowdata["discounts"]
	var html=''
	for(var k=0;k<discounts.length;k++){
		var endval=discounts[k].end
		if(endval ==null)
			endval='Max'
		html +='<p class="pl-0"> '+discounts[k].start+'- '+endval+' months | '+discounts[k].discountPercent+'%</p>'
	}
	
	$('#'+type+'-reset-block').html(html)

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
	var nextParentDiv=$(thisObj).parent().parent().next() 
	var currDiv=$(thisObj).parent().parent().find('.expiry-end-lbl')
	var endval=currDiv.val()
	if(currDiv.hasClass('expiry-end-limits-inp')){
		parentDiv.find('.expiry-end-lbl').addClass('expiry-end-limits-inp')
		parentDiv.find('.expiry-end-lbl').removeAttr('disabled')
	} 
	if(currDiv.hasClass('expiry-first-record')){
		$(thisObj).parent().parent().next().find('.expiry-start-lbl').text(1)
	}
	if($('.expiry-end-lbl').length == 3){
		console.log("remove-exp-cls")
		$('.expiry-first-record').parent().parent().find('.remove-exp-cls').show()
	}
	console.log("endval=="+endval)
	console.log(parentDiv.find('.expiry-end-lbl'))
	parentDiv.find('.expiry-end-lbl').val(endval)
	$(thisObj).parent().parent().remove()
	//inputValidate(nextParentDiv.find('.expiry-end-lbl'))
	inputValidate($('.expiry-start-limits-inp'))

}

function saveRangeOptions(thisObj){
	var saveData=true
	var confirmFlag =false
	console.log("set==="+$('input[name="reset_discount_radio"]:checked').val())
	if($(thisObj).data('confirm') == true){
		saveData=false
		confirmFlag=true
		var r = confirm("Do you want to apply this discount setting to other selected records as well?");
	    if (r == true) {
	        saveData=true
	    } else {
	        saveData=false

	    }
	    //console.log(txt)
	}
	
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
	data['resetTo']={}
	var row_arr=[]
	var resetDiscount=$('input[name="reset_discount_radio"]:checked').val()
	if(resetDiscount != undefined){
		data['resetTo']={ "discountTypeId":resetDiscount,"brand":popupData.brand,"variantId":popupData.productVariantId }
	}
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
	var singleRow=true
	if(row_arr.length>0){
		if(saveData == false && confirmFlag == true){
			singleRow=true
		}
		else{
			data['rows']=row_arr
			singleRow=false
		}
		
	}
	if(singleRow == true){
		data['rows'].push({
			"warehouseId":popupData.warehouseId,
			"variantId":popupData.productVariantId,
			"brand":popupData.brand
		})
	}
	console.log(data)
	$.ajax({
		  url: "https://demo8727571.mockable.io/editDiscounts",
		  dataType: 'json',
          contentType: 'application/json',
		  method: "POST",
		  data: JSON.stringify(data),
		})
	  .done(function( data ) {
	  	$('#'+type+'-table').DataTable().ajax.reload();
	  	console.log("fild==="+'#'+type+'-select-all')
	  	console.log("v==="+$('#'+type+'-select-all').is(':checked')) 
	  	$('#'+type+'-select-all').prop('checked',false)
	  	$('.modal').removeClass('is-visible');
        $('.reset-block').hide()
	  	//$('.modal-toggle').trigger('click')
	  });
	
   

}
function getVariantFilterDetails(tabelem){
	var selectedBrands=tabelem.find('.filter-brand-name').val()
	if(selectedBrands.length>0){
		$.ajax({
		  url: "https://demo8727571.mockable.io/getVariantsFromBrand",
		   dataType: 'json',
          contentType: 'application/json',
		  method: "POST",
			data: JSON.stringify({ brands : selectedBrands }),
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

function loadZonesFilter(){
	var options=[]
	for(var j=0;j<zones.length;j++){
	    	options.push({
	            name   : zones[j],
	            value  : zones[j],
	            checked: false
	        });
	    }
	console.log(options)
	$('#custom-discounts-zone').multiselect('loadOptions', options );
}


function updateNextExpiryLimit(thisObj){
	var val= $(thisObj).val()
	$('.expiry-start-limits-inp').text(parseInt(val)+1)
	

}

function CustomFilterValidate(tabelem){
	var selectedBrands=tabelem.find('.filter-brand-name').val()
	var selectedStores=tabelem.find('.filter-store').val()
	console.log(selectedBrands.length+"===="+selectedStores.length)
	if(selectedBrands.length>0 && selectedStores.length>0){
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
	
}


function inputValidate(thisObj){
		// if($(this).hasClass('expiry-end-lbl')){
		// 	console.log()
			
		// }
		console.log("in inputValidate")
		var enableSubmitBtn=true
		var enableSubmitCheck=true
		var startval=parseInt($(thisObj).parent().parent().find('.expiry-start-lbl').text())
		console.log(startval+ "==>"+ parseInt($(thisObj).parent().parent().find('.expiry-end-lbl').val()))
		if(startval > parseInt($(thisObj).parent().parent().find('.expiry-end-lbl').val())){
			console.log("error")
			enableSubmitBtn=false
			if($(thisObj).parent().parent().find('.expiry-end-lbl').hasClass('error') == false ){

				$(thisObj).parent().parent().find('.expiry-end-lbl').addClass('error') 
		   		
			}
		}
		else{
			$(thisObj).parent().parent().find('.expiry-end-lbl').removeClass('error') 
			
		}
		
        $dErrorFields=[]
        var prevDiscVal=0
        $('#rangeModalPopup .discount-percent-lbl').each(function ( index, element ){
		  console.log("val=="+$(this).val())
		  var hasErr=false
		  if((parseInt($(this).val()) >100) || (parseInt($(this).val()) <0)){
		  	$dErrorFields.push($(this).val())
		  	hasErr=true
		  	if($(this).hasClass('error') == false )
		  		$(this).addClass('error')
		  }
		 else if(index!=0){
		 	if(parseInt($(this).val())>=parseInt(prevDiscVal)){
		 		$dErrorFields.push($(this).val())
		 		hasErr=true
		 		if($(this).hasClass('error') == false )
		  			$(this).addClass('error')
		 	}
		 }
		 if(hasErr==false){
		 	$(this).removeClass('error')
		 }
		  prevDiscVal=$(this).val()
		});
		if($dErrorFields.length){
			enableSubmitBtn=false
		}
        console.log("dlem="+$dErrorFields.length)
        $emptyFields=[]
		//var $emptyFields = $('#rangeModalPopup .input_field').filter(function() {
		$('#rangeModalPopup .input_field').each(function ( index, element ){
            //return $.trim(thisObj.value) === "";
            if($(this).val().trim() == "")
            	$emptyFields.push($(this).val())
        });
		console.log("len-====="+$emptyFields.length)
        if ($emptyFields.length) {
	   		enableSubmitCheck=false
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

}

$(document).ready( function () {
	$.fn.dataTable.ext.errMode = 'none';
	for(ditem in discounts_id_list){
		console.log("item=="+ditem)
		global_discounts = new listDiscounts({  url : "https://demo8727571.mockable.io/list-"+ditem , tablename : ditem+'-table' , type:ditem , discountTypeId:discounts_id_list[ditem] });
		global_discounts.generateIPList()
	}
	
	

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
		        
		        if(tabelem.attr('id') == "variant-discounts"){
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
					
		        }
		        if (tabelem.attr('id') != "brand-discounts"){
		        	getVariantFilterDetails(tabelem)
		        }
		        if(tabelem.attr('id') == "custom-discounts"){
		        	CustomFilterValidate(tabelem)
		        }
		        

		    },
		    onSelectAll   : function( element, selected ){
		    	var tabelem=$(element).parent().parent().parent().parent()
		    	if(tabelem.attr('id') == "variant-discounts"){
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
					
					console.log(tabelem.find('.filter-brand-name').val())
				}
				if (tabelem.attr('id') != "brand-discounts"){
		        	getVariantFilterDetails(tabelem)
		        }
		        if(tabelem.attr('id') == "custom-discounts"){
		        	CustomFilterValidate(tabelem)
		        }
		    },
		    onClear: function( element ){
		    	var tabelem=$(element).parent().parent().parent().parent()
		    	totalBrandFilterOptions[tabelem.attr('id')]=[]
		    	if(tabelem.attr('id') == "variant-discounts"){
		    		if(tabelem.find('.apply-filter').hasClass('disabled') == false)
						tabelem.find('.apply-filter').addClass('disabled');
					if(tabelem.find('.clear-filter').hasClass('disabled') == false)
						tabelem.find('.clear-filter').addClass('disabled');
			    	tabelem.find('.apply-filter').attr('disabled', 'disabled' );
					tabelem.find('.clear-filter').attr('disabled', 'disabled' );
					
				}
				if (tabelem.attr('id') != "brand-discounts"){
		        	tabelem.find('.filter-variant-id').multiselect('loadOptions', [] );
		        }
		        if(tabelem.attr('id') == "custom-discounts"){
		        	CustomFilterValidate(tabelem)
		        }

		    }

        });

	 $('.filter-variant-id').multiselect({
            columns: 1,
            placeholder: 'Select',
            search: true,
            selectAll: true,
            clear: true,

        });

	  $('.filter-store').multiselect({
            columns: 1,
            placeholder: 'Select',
            search: true,
            selectAll: true,
            clear: true,
             onOptionClick: function( element, option ){
		        var thisOpt = $(option);
		        var options=[]
		        var tabelem=$(element).parent().parent().parent().parent()
	        	CustomFilterValidate(tabelem)	        

		    },
		    onSelectAll   : function( element, selected ){
		    	var tabelem=$(element).parent().parent().parent().parent()
		    	CustomFilterValidate(tabelem)

		    },
		    onClear: function( element ){
		    	var tabelem=$(element).parent().parent().parent().parent()
				CustomFilterValidate(tabelem)		

		    }
        });

	 var totalStoreFilterOptions=[]
	 $('.filter-zone').multiselect({
            columns: 1,
            placeholder: 'Select',
            search: true,
            selectAll: true,
            clear: true,
            onOptionClick: function( element, option ){
		        var thisOpt = $(option);
		        var options=[]
		        var tabelem=$(element).parent().parent().parent().parent()
	        	console.log($(element).parent().parent().parent().parent())
		       
		        if(thisOpt.prop('checked')){
		        	if(jQuery.inArray( thisOpt.val(), totalStoreFilterOptions ) == -1)
		        		totalStoreFilterOptions.push(thisOpt.val())
		        	
		        }
		        else{
		        	totalStoreFilterOptions.splice( totalStoreFilterOptions.indexOf(thisOpt.val()), 1 );
		        }
		        
		        for(var i=0;i<totalStoreFilterOptions.length;i++){
		        		for(store_item in store_mapping){
		        			console.log(store_mapping[store_item])
		        			console.log(store_mapping[store_item].zone +'=='+ totalStoreFilterOptions[i])
		        			if(store_mapping[store_item].zone == totalStoreFilterOptions[i]){
							  	options.push({
						            name   : store_mapping[store_item].name,
						            value  : store_mapping[store_item].id,
						            checked: false
						        });
							  }
		        		}
		        		
		        	}
		        console.log(options)
		        tabelem.find('.filter-store').multiselect('loadOptions', options  );
		        CustomFilterValidate(tabelem)	        

		    },
		    onSelectAll   : function( element, selected ){
		    	var tabelem=$(element).parent().parent().parent().parent()
		    	var options=[]

		    	if(selected>0){
			    	for(store_item in store_mapping){
	    			  	options.push({
				            name   : store_mapping[store_item].name,
				            value  : store_mapping[store_item].id,
				            checked: false
				        });
				        totalStoreFilterOptions.push(store_mapping[store_item].id)
	        		}
        		}
        		tabelem.find('.filter-store').multiselect('loadOptions', options  );
        		CustomFilterValidate(tabelem)

		    },
		    onClear: function( element ){
		    	var tabelem=$(element).parent().parent().parent().parent()
		    	totalStoreFilterOptions=[]		    	
		    	tabelem.find('.apply-filter').attr('disabled', 'disabled' );
				tabelem.find('.clear-filter').attr('disabled', 'disabled' );
				tabelem.find('.filter-store').multiselect('loadOptions', [] );	
				CustomFilterValidate(tabelem)		

		    }

        });

	 loadZonesFilter()

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

	
	$('.addExpiryRange').on('click', function(){
		if($('.expiry-end-lbl').length == 2){
			$('.expiry-first-record').parent().parent().find('.remove-exp-cls').hide()
		}
		
	   
	   var rowHtml='<tr><td class="text-center">'+
	   '<span class="expiry-start-lbl "></span></td>'+
	   ' <td>-</td><td><input type="number" min="0" class="input_field expiry-end-lbl expiry-first-record expiry-end-limits-inp" oninput="updateNextExpiryLimit(this)" ></td>'+
	   ' <td><input type="number" min="0" max="100" class="input_field discount-percent-lbl" ></td>'+
	   '<td class="text-center"><input class="hk-offer-lbl" type="checkbox"></td>'+
	   '<td class="text-center"><span style="color: red;cursor:pointer;" class="fosz14 remove-exp-cls" onclick="adjustExpiryRange(this)">✖</span></td></tr>'


	   var parentObj=$('#rangeModalPopup .expiry-end-limits-inp').parent().parent()
	   // var parentObj=$('#rangeModalPopup .expiry-start-limits-inp').parent().parent()
	   
	   // var cloneObj=parentObj.clone()
	   var endval=0
	   var cloneObj=$(rowHtml)
	   if(parentObj.length>0){
		   parentObj.find('.expiry-end-limits-inp').attr("disabled","disabled")
		   endval=parentObj.find('.expiry-end-limits-inp').val()
		   parentObj.find('.expiry-end-limits-inp').removeClass('expiry-end-limits-inp')
	   }
	   
	   cloneObj.find('.input_field').val('')
	   cloneObj.find('.expiry-end-limits-inp').val(parseInt(endval)+defaultSlab)
	   cloneObj.find('.expiry-end-limits-inp').attr('min',parseInt(endval)+1)
	   cloneObj.find('.expiry-start-lbl').text(parseInt(endval)+1)
	   cloneObj.find('.remove-exp-cls').show()
	   $('#rangeModalPopup .expiry-start-limits-inp').text(parseInt(endval)+defaultSlab+1)
	   //parentObj.after(cloneObj)
	   var pObj=$('#rangeModalPopup .expiry-start-limits-inp').parent().parent()
	   pObj.before(cloneObj)
	   $('.addExpiryRange').attr('disabled','disabled')
		if($('.addExpiryRange').hasClass('disabled') == false)
			$('.addExpiryRange').addClass('disabled')
		if($('.submitBtn').hasClass('disabled') == false)
			$('.submitBtn').addClass('disabled')
		$('.submitBtn').attr('disabled','disabled')

	});	

	$('body').on('input','#rangeModalPopup .input_field',function(e){
		inputValidate(this)
	   
	});

});