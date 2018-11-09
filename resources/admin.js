var global_discounts
var defaultSlab = 6
var listDiscounts = function(options) {

    /*
     * Variables accessible
     * in the class
     */
//    var list_vars = {
//        url: "",
//        tablename: "",
//        type: "",
//        monthrangelimit: 3,
//        discountTypeId: 1,
//        filters: {
//            brandTypes: [],
//            brands: [],
//            variantIds: [],
//            warehouseIds: []
//        }
//    };

    var list_vars = {
        url: "",
        tablename: "",
        type: "",
        monthrangelimit: 3,
        configType: 1,
        filters: {
            brand: [],
            productVariantId: [],
            warehouseId: [],
            zoneId: [],
        }
    };

    var pageLoad = true

    /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
    var root = this;

    /*
     * Constructor
     */
    this.construct = function(options) {
        $.extend(list_vars, options);
    };

    /*
     * Public method
     * Can be called outside class
     */
    this.generateIPList = function() {
        console.log(list_vars.type);
        var enableOpt = true
        var orderList = [
            [3, "asc"]
        ]
//        if (list_vars.type == "global-config") {
//            enableOpt = false
//            orderList = []
//        }
        if (list_vars.type == "brand-discounts") {
            orderList = [
                [2, "asc"]
            ]
        }
        $('#' + list_vars.tablename).DataTable({
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
            "order": orderList,
            "bInfo": enableOpt,
            "ajax": {
                "url": list_vars.url,
                "type": "POST",
                //processData:false,
                dataType: 'json',
                contentType: 'application/json',
                "data": function(d) {
                    d.configType = list_vars.configType
                    console.log("[ INFO ] " + list_vars.type);
//                    console.log("val id==" + $('#' + list_vars.type + '-brand-type').val())
//                    d.brandTypes = ($('#' + list_vars.type + '-brand-type').val() == undefined || $('#' + list_vars.type + '-brand-type').val() == "") ? [] : $('#' + list_vars.type + '-brand-type').val()
                    d.brand = ($('#' + list_vars.type + '-brand-name').val() == undefined || $('#' + list_vars.type + '-brand-name').val() == "") ? [] : $('#' + list_vars.type + '-brand-name').val()
                    console.log("fil==")
                    console.log(d)
                    d.productVariantId = ($('#' + list_vars.type + '-variant-id').val() == undefined || $('#' + list_vars.type + '-variant-id').val() == "") ? [] : $('#' + list_vars.type + '-variant-id').val()
                    d.warehouseId = ($('#' + list_vars.type + '-store').val() == undefined || $('#' + list_vars.type + '-store').val() == "") ? [] : $('#' + list_vars.type + '-store').val()
                    d.zoneId = ($('#' + list_vars.type + '-zone').val() == undefined || $('#' + list_vars.type + '-zone').val() == "") ? [] : $('#' + list_vars.type + '-zone').val()
                    return JSON.stringify(d)
                }
            },

            "columnDefs": this.generateColumns(),
            "createdRow": function (row, data, index) {
                /* Disabling has precedence over highlighting */
                if(data['canEdit']) {
                    if(data['highlightRecord']) {
                        $(row).addClass('tr-highlighter');
                    }
                } else {
                    $(row).addClass('tr-disabled');
                }
            }

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

    this.generateColumns = function() {
        var columns = [];
        var index = 0
//        if (list_vars.type != "global-config") {
            columns.push({
                targets: 0,
                searchable: false,
                orderable: false,
                className: 'dt-body-center',
                render: function(data, type, full, meta) {
                    var jsonObj = {
                        "brand": full['brand'],
                        "variantId": full['productVariantId'],
                        "warehouseId": full['warehouseId']
                    }
                    return '<input type="checkbox" class="ind-checkbox" onclick="updatedSelectAllCheckbox(\'' + list_vars.type + '\',this)" name="' + list_vars.type + '-id[]" data-brand="' + jsonObj["brand"] + '" data-variant-id="' + jsonObj["variantId"] + '" data-warehouse-id="' + jsonObj["warehouseId"] + '"value="' + jsonObj["brand"] + '" data-row=\'' + JSON.stringify(full) + '\'>';
                }
            });

            /* NUT ID */
            index++;
            columns.push({
                targets: index,
                render: function(data, type, row, meta) {
                    return row["productVariantId"];
                }
            });

            /* Product Variant Name */
            index++;
            columns.push({
                targets: index,
                render: function(data, type, row, meta) {
                    return row["productVariantName"];
                }
            });

            /* Brand */
            index++;
            columns.push({
                targets: index,
                render: function(data, type, row, meta) {
                    return row["brand"];
                }
            });

            /* Zone */
            if(list_vars.type != "global-config") {
                console.log("[ INFO ] zone selected");
                index++;
                columns.push({
                    targets: index,
                    render: function(data, type, row, meta) {
                        return row["zone"];
                    }
                });
            }

            /* Store */
            if(list_vars.type == "custom-config") {
                console.log("[ INFO ] store selected");
                index++;
                columns.push({
                    targets: index,
                    render: function(data, type, row, meta) {
                        return row["warehouse"];
                    }
                });
            }

            /* Min Inventory Qty */
            index++;
            columns.push({
                targets: index,
                render: function(data, type, row, meta) {
                    return row["minInventory"];
                }
            });

            /* Inventory Qty Type */
            index++;
            columns.push({
                targets: index,
                render: function(data, type, row, meta) {
                    return row["configType"];
                }
            });

//            // index++;
//            // columns.push({
//            //            "targets": index,
//            //            render: function(data, type, row, meta){
//
//            //            	return (meta.row+1)
//            //            }
//            //        });
//            index++;
//            if (jQuery.inArray(list_vars.type, ["zone-config", "custom-config"]) != -1) {
//
//                columns.push({
//                    "targets": index,
//                    render: function(data, type, row, meta) {
//
//                        return row['productVariantId']
//                    }
//                });
//                index++;
//            }
//
//            columns.push({
//                "targets": index,
//                render: function(data, type, row, meta) {
//
//                    return row['brandType']
//                }
//            });
//            index++;
//            columns.push({
//                "targets": index,
//                render: function(data, type, row, meta) {
//
//                    return row['brand']
//                }
//            });
//            index++;
//            if (jQuery.inArray(list_vars.type, ["zone-config", "custom-config"]) != -1) {
//
//                columns.push({
//                    "targets": index,
//                    render: function(data, type, row, meta) {
//
//                        return row['productVariantName']
//                    }
//                });
//                index++;
//            }
//            if (list_vars.type == "custom-config") {
//                columns.push({
//                    "targets": index,
//                    render: function(data, type, row, meta) {
//
//                        return row['storeName']
//                    }
//                });
//                index++;
//                columns.push({
//                    "targets": index,
//                    render: function(data, type, row, meta) {
//
//                        return row['zone']
//                    }
//                });
//                index++;
//            }

//        }



//        columns.push({
//            "targets": index,
//            orderable: false,
//            render: function(data, type, row, meta) {
//                var renderStr = '';
//                var fullStr = '';
//                var addCls = ''
//                if (row['discounts'] == null) {
//                    row['discounts'] = [{
//                        start: 1,
//                        end: null,
//                        discountPercent: "",
//                        hkOfferApplied: false
//                    }]
//                }
//
//                for (var i = 0; i < row['discounts'].length; i++) {
//                    var endPeriod
//                    if (row['discounts'][i]["end"] == null)
//                        endPeriod = "Max"
//                    else
//                        endPeriod = row['discounts'][i]["end"]
//                    var discountPercentStr = ''
//                    if (row['discounts'][i]["discountPercent"] != "")
//                        discountPercentStr = ' | ' + row['discounts'][i]["discountPercent"] + '%'
//                    fullStr += '<p>' + row['discounts'][i]["start"] + ' - ' + endPeriod + ' months' + discountPercentStr + '</p>'
//                }
//
//                if (row['discounts'].length > list_vars.monthrangelimit) {
//                    renderStr += '<div rel="tooltip" title="' + fullStr + '">'
//                    addCls = 'class="exp-month-range-tootltip"'
//                }
//                for (var i = 0; i < row['discounts'].length; i++) {
//
//                    if (i >= list_vars.monthrangelimit) {
//                        break;
//                    }
//                    //console.log(i+"---"+list_vars.monthrangelimit)
//                    var endPeriod
//                    if (row['discounts'][i]["end"] == null)
//                        endPeriod = "Max"
//                    else
//                        endPeriod = row['discounts'][i]["end"]
//                    var discountPercentStr = ''
//                    if (row['discounts'][i]["discountPercent"] != "")
//                        discountPercentStr = ' | ' + row['discounts'][i]["discountPercent"] + '%'
//                    renderStr += '<p ' + addCls + ' >' + row['discounts'][i]["start"] + ' - ' + endPeriod + ' months' + discountPercentStr + '</p>'
//
//
//                }
//                if (row['discounts'].length > list_vars.monthrangelimit) {
//                    renderStr += '</div>'
//                }
//                if (row['discounts'].length <= 0) {
//                    renderStr += '<span style="padding-left: 1.5em">--</span>'
//                }
//                if (list_vars.type == "global-config") {
//                    renderStr = fullStr
//                }
//                return renderStr
//            }
//        });
//        index++;
//        var orderDiscountType = true
//        if (list_vars.type == "global-config")
//            orderDiscountType = false
//        columns.push({
//            "targets": index,
//            orderable: orderDiscountType,
//            render: function(data, type, row, meta) {
//
//                return row['discountType']
//            }
//        });

        index++;
        columns.push({
            targets: index,
            orderable: false,
            render: function(data, type, row, meta) {
                var renderStr = '<a href="javascript:void(0);" class="modal-toggle text-nowrap" data-discount-type-id="' + list_vars.discountTypeId + '" data-brand="' + row['brand'] + '" data-variant-id="' + row['productVariantId'] + '" data-row=\'' + JSON.stringify(row) + '\' onclick="showEditModal(this,\'' + list_vars.type + '\');">View/Edit</a>'
                return renderStr

            }
        });
        console.log("[ INFO ] columns >>>>>>" + columns);
        return columns

    };


    this.setFilterValue = function(field, value) {
        list_vars.filters[field] = value;
        return value;
    }
    /*
     * Pass options when class instantiated
     */
    this.construct(options);

};


function updatedSelectAllCheckbox(type, thisObj) {
    console.log("entered==" + type)
    var rows = $('#' + type + '-table').DataTable().rows({
        'search': 'applied'
    }).nodes();
    console.log("total=" + $('input[type=checkbox]', rows).length)
    console.log("checked=" + $('input[type=checkbox]:checked', rows).length)
    var rows = $('#' + type + '-table').DataTable().rows({
        'search': 'applied'
    }).nodes();
    if ($(thisObj).is(':checked') == false) {
        $("#" + type + "-select-all").prop("checked", false);
    }
    if ($('input[type=checkbox]', rows).length == $('input[type=checkbox]:checked', rows).length)
        $("#" + type + "-select-all").prop("checked", true);
}

function showRangePopup(thisObj, type) {
    //console.log($(thisObj).data('row'))

    $('#rangeModalPopup').find('.table-cover').removeClass('disabled')
    $('.reset-select-radio').removeAttr('checked')
    $('#rangeModalPopup').find('input[data-block="global-config-reset-block"]').removeAttr("disabled")
    $('#rangeModalPopup').find('input[data-block="brand-discounts-reset-block"]').removeAttr("disabled")
    $('#rangeModalPopup').find('input[data-block="zone-config-reset-block"]').removeAttr("disabled")
    $('#resetDiscountsForm')[0].reset()
    var data = $(thisObj).data('row')
    console.log("showRangePopup===")
    console.log(data)
    if (data['discounts'].length > 0) {
        $('.submitBtn').removeAttr('disabled')
        $('.submitBtn').removeClass('disabled')
        $('.addExpiryRange').removeAttr('disabled')
        $('.addExpiryRange').removeClass('disabled')
    } else {
        $('.addExpiryRange').attr('disabled', 'disabled')
        if ($('.addExpiryRange').hasClass('disabled') == false)
            $('.addExpiryRange').addClass('disabled')
        if ($('.submitBtn').hasClass('disabled') == false)
            $('.submitBtn').addClass('disabled')
        $('.submitBtn').attr('disabled', 'disabled')
    }



    $("#rangeModalPopup").data("row", $(thisObj).data('row'))
    $("#rangeModalPopup").data("type", type)
    console.log("hasclass hidden==" + $('#rangeModalPopup').find('').hasClass('hidden'))
    if (type == "global-config") {
        if ($('#rangeModalPopup .reset-opt-block').hasClass('hidden') == false)
            $('#rangeModalPopup').find('.reset-opt-block').addClass('hidden')

    } else {
        $('#rangeModalPopup .reset-opt-block').removeClass('hidden')
        var globaldata = $('#global-config').find('.modal-toggle[data-discount-type-id="1"]').data('row')
        if (type == "brand-discounts") {
            if (globaldata['discounts'].length == 1 && globaldata['discounts'][0]["discountPercent"] == "") {
                if ($('#rangeModalPopup .reset-opt-block').hasClass('hidden') == false)
                    $('#rangeModalPopup').find('.reset-opt-block').addClass('hidden')
            } else {
                $('#rangeModalPopup').find('.reset-opt:not(.global-reset-opt):not(.hidden)').addClass('hidden')
                $('#rangeModalPopup').find('.global-config-reset-opt').removeClass('hidden')
            }

            if (data["globalDiscountAvailable"] == false)
                $('#rangeModalPopup').find('input[data-block="global-config-reset-block"]').attr("disabled", "disabled")


        } else if (type == "zone-config") {
            $('#rangeModalPopup').find('.reset-opt:not(.hidden)').addClass('hidden')
            if (globaldata['discounts'].length == 1 && globaldata['discounts'][0]["discountPercent"] == "") {
                if ($('#rangeModalPopup').find('.global-config-reset-opt').hasClass('hidden') == false)
                    $('#rangeModalPopup').find('.global-config-reset-opt').addClass('hidden')
            } else
                $('#rangeModalPopup').find('.global-config-reset-opt').removeClass('hidden')
            $('#rangeModalPopup').find('.brand-discounts-reset-opt').removeClass('hidden')

            if (data["brandDiscountAvailable"] == false)
                $('#rangeModalPopup').find('input[data-block="brand-discounts-reset-block"]').attr("disabled", "disabled")
            if (data["globalDiscountAvailable"] == false)
                $('#rangeModalPopup').find('input[data-block="global-config-reset-block"]').attr("disabled", "disabled")
        } else if (type == "custom-config") {
            $('#rangeModalPopup').find('.reset-opt:not(.hidden)').addClass('hidden')
            if (globaldata['discounts'].length == 1 && globaldata['discounts'][0]["discountPercent"] == "") {
                if ($('#rangeModalPopup').find('.global-config-reset-opt').hasClass('hidden') == false)
                    $('#rangeModalPopup').find('.global-config-reset-opt').addClass('hidden')
            } else
                $('#rangeModalPopup').find('.global-config-reset-opt').removeClass('hidden')
            $('#rangeModalPopup').find('.brand-discounts-reset-opt').removeClass('hidden')
            $('#rangeModalPopup').find('.zone-config-reset-opt').removeClass('hidden')
            if (data["variantDiscountAvailable"] == false)
                $('#rangeModalPopup').find('input[data-block="zone-config-reset-block"]').attr("disabled", "disabled")
            if (data["brandDiscountAvailable"] == false)
                $('#rangeModalPopup').find('input[data-block="brand-discounts-reset-block"]').attr("disabled", "disabled")
            if (data["globalDiscountAvailable"] == false)
                $('#rangeModalPopup').find('input[data-block="global-config-reset-block"]').attr("disabled", "disabled")
        }
    }
    //var selectedRows = $('#brand-discounts-table').DataTable().rows({ selected: true }).ids(true);
    var row_arr = []
    var selectedRows = $($('#' + type + '-table').DataTable().$('input[type="checkbox"]').map(function() {
        console.log("val---" + $(this).is(":checked"))
        if ($(this).is(":checked")) {
            row_arr.push({
                "brand": $(this).data("brand"),
                "variantId": $(this).data("variant-id"),
                "warehouseId": $(this).data("warehouse-id")
            })
        }
        return row_arr
    }));
    console.log(selectedRows);
    console.log(row_arr)

    var appendRow = ''
    var dicountsArr = data['discounts']
    if (dicountsArr.length == 0) {
        dicountsArr.push({
            "start": 1,
            "end": defaultSlab,
            "discountPercent": "",
            "hkOfferApplied": false
        })
        dicountsArr.push({
            "start": (defaultSlab + 1),
            "end": null,
            "discountPercent": "",
            "hkOfferApplied": false
        })
    }
    for (var i = 0; i < dicountsArr.length; i++) {
        appendRow += '<tr>'
        var checkedstr = '';
        if (data['discounts'][i]['hkOfferApplied'] == true) {
            checkedstr = 'checked'
        }
        var endVal = data['discounts'][i]['end']
        if (endVal == null) {
            endVal = 'Max'
        }
        var removeStr = ''
        var extraStyle = ''
        if (i == 0 && dicountsArr.length != 2)
            extraStyle = 'display:none;'
        // if(i != 0 && i != (data['discounts'].length-1))
        if (i == (data['discounts'].length - 1))
            extraStyle = 'display:none;'
        removeStr = '<span style="color: red;cursor:pointer;' + extraStyle + '" class="fosz14 remove-exp-cls" onclick="adjustExpiryRange(this)">&#10006;</span>'


        var classStr = '';
        var endClassStr = '';
        var disabledStr = ''

        if (i == 0)
            endClassStr += "expiry-first-record "
        if (i == (dicountsArr.length - 1)) {
            classStr = 'expiry-start-limits-inp'
        }

        if (i == (dicountsArr.length - 2)) {
            endClassStr += 'expiry-end-limits-inp'
        } else {
            disabledStr = 'disabled="disabled"'
        }

        appendRow += '<td class="text-center"><span class="expiry-start-lbl ' + classStr + '">' + dicountsArr[i]['start'] + '</span></td>' +
            '<td>-</td>';
        if (i == (dicountsArr.length - 1))
            appendRow += '<td><label class="expiry-end-lbl">' + endVal + '</label></td>'
        else
            appendRow += '<td><input type="number" min="' + dicountsArr[i]['start'] + '" class="input_field expiry-end-lbl ' + endClassStr + '" oninput="updateNextExpiryLimit(this)" value="' + endVal + '" ' + disabledStr + '></td>'
        appendRow += '<td><input type="number" min="0" max="100" class="input_field discount-percent-lbl" value="' + dicountsArr[i]['discountPercent'] + '"></td>' +
            '<td class="text-center"><input class="hk-offer-lbl" type="checkbox" ' + checkedstr + '/></td>' +
            '<td class="text-center">' + removeStr + '</td>'
        // }


        appendRow += '</tr>'

    }
    console.log($("#rangeModalPopup").find('.rangeTable tbody'))
    if (row_arr.length > 1)
        $('#rangeModalPopup').find('.submitBtn').data('confirm', true)
    else
        $('#rangeModalPopup').find('.submitBtn').data('confirm', false)
    $("#rangeModalPopup").find('.rangeTable tbody').html(appendRow);
    if (data['brand'] == null) {
        $("#rangeModalPopup").find('.rangeModalBrandName').parent().hide()
    } else {
        $("#rangeModalPopup").find('.rangeModalBrandName').text(data['brand'] + " (" + data['brandType'] + ")")
        $("#rangeModalPopup").find('.rangeModalBrandName').parent().show()
    }
    if (data['productVariantId'] == null) {
        $("#rangeModalPopup").find('.rangeModalVariantId').parent().hide()
        $("#rangeModalPopup").find('.rangeModalVariantName').parent().hide()
    } else {
        $("#rangeModalPopup").find('.rangeModalVariantId').text(data['productVariantId'])
        $("#rangeModalPopup").find('.rangeModalVariantName').text(data['productVariantName'])
        $("#rangeModalPopup").find('.rangeModalVariantId').parent().show()
        $("#rangeModalPopup").find('.rangeModalVariantName').parent().show()
    }
    if (data['storeName'] == null) {
        $("#rangeModalPopup").find('.rangeModalStoreName').parent().hide()
    } else {
        $("#rangeModalPopup").find('.rangeModalStoreName').text(data['storeName'] + " (" + data['zone'] + ")")
        $("#rangeModalPopup").find('.rangeModalStoreName').parent().show()
    }


    inputValidate($('.expiry-start-limits-inp'))
    $('.modal').toggleClass('is-visible');
    generateResetBlocks(type)


}

/* Show the edit configuration modal */
function showEditModal(thisObj, type) {
    console.log("showEditModal()");
    console.log($(thisObj).data('row'));
    /* Initially hide all the extra fields */
    $('#editModalZone').parent().hide();
    $('#editModalWarehouse').parent().hide();

    var configValues = $(thisObj).data('row');
    var currentConfigType = $('ul.tabs').find('.current').data('config-type');
    /* Show and populate the modal */
    $('.modal').toggleClass('is-visible');
    $('#editModalBrand').text(configValues.brand);
    /* If Zone level config */
    if(currentConfigType == "Zone" || currentConfigType == "Custom") {
        $('#editModalZone').parent().show();
        $('#editModalZone').text(configValues.zone);
    }
    /* If Custom level config */
    if(currentConfigType == "Custom") {
        $('#editModalWarehouse').parent().show();
        $('#editModalWarehouse').text(configValues.warehouse);
    }
    $('#editModalConfigType').text(configValues.configType);
    $('#editModalProductVariantId').text(configValues.productVariantId);
    $('#editModalProductVariantName').text(configValues.productVariantName);
    /* If NA check the NA checkbox */
    if(configValues.minInventory == "NA") {
        console.log('--------------');
        $('#editModalNaCheckbox').prop('checked',true);
        $('#editModalMinInventory').attr('disabled','disabled');
        $('#editModalMinInventory').val(null);
    } else {
        console.log("++++++++++++++++++++");
        $('#editModalNaCheckbox').prop('checked',false);
        $('#editModalMinInventory').removeAttr('disabled');
        $('#editModalMinInventory').val(configValues.minInventory);
    }
    /* Populate the average sales alert box */
    $('#editModalNutId').text(configValues.productVariantId);
    $('#noOfMonthsConsideredForAverage').text(configValues.noOfMonthsConsideredForAverage);
    $('#editModalAverageSales').text(configValues.averageMonthlySales);
}

function generateResetBlocks(type) {
    var discounts_arr = []
    if (type == "brand-discounts")
        discounts_arr = ["global-config"]
    else if (type == "zone-config")
        discounts_arr = ["global-config", "brand-discounts"]
    else if (type == "custom-config")
        discounts_arr = ["global-config", "brand-discounts", "zone-config"]
    console.log(discounts_arr)
    for (item in discounts_arr) {
        //console.log("item=="+item)
        generateResetBlockContent(discounts_arr[item])
    }

}


function generateResetBlockContent(type) {
    var rowdata = {}
    var discounts = []
    var data = {}
    if (type == "global-config") {
        rowdata = $('#' + type).find('.modal-toggle[data-discount-type-id="1"]').data('row')
        discounts = rowdata["discounts"]
        console.log(rowdata["discounts"])
        buildResetBlock(type, discounts)
    } else if (type == "brand-discounts") {
        console.log("brand disc===")
        console.log($("#rangeModalPopup").data("row"))
        data = $("#rangeModalPopup").data("row")
        console.log("brand reset===")
        console.log(data)
        rowdata = $('#' + type).find('.modal-toggle[data-brand="' + data['brand'] + '"]').data('row')
        console.log("brand rowdata reset===")
        console.log(rowdata)
        //discounts=rowdata["discounts"]
        var jsondata = {}
        jsondata["brandTypes"] = []
        jsondata["brands"] = []
        jsondata["brands"].push(data['brand'])

        jsondata["discountTypeId"] = 2

        jsondata["variantIds"] = []

        jsondata["warehouseIds"] = []
        $.ajax({
                url: "http://localhost:5050/rest/api/ajax/fetchMinimumInventoryConfig",
                dataType: 'json',
                contentType: 'application/json',
                method: "POST",
                data: JSON.stringify(jsondata),
            })
            .done(function(data) {
                console.log(data["data"][0]["discounts"])
                discounts = data["data"][0]["discounts"]
                buildResetBlock(type, discounts)
                //$('.modal-toggle').trigger('click')
            });
    } else if (type == "zone-config") {
        data = $("#rangeModalPopup").data("row")
        rowdata = $('#' + type).find('.modal-toggle[data-variant-id="' + data['productVariantId'] + '"]').data('row')
        console.log("var reset===")
        console.log(data)
        console.log("var rowdata reset===")
        console.log(rowdata)
        var jsondata = {}
        jsondata["brandTypes"] = []
        jsondata["brands"] = []
        jsondata["brands"].push(data['brand'])

        jsondata["discountTypeId"] = 2

        jsondata["variantIds"] = []
        jsondata["variantIds"].push(data['productVariantId'])

        jsondata["warehouseIds"] = []
        jsondata["warehouseIds"].push(data['warehouseId'])
        $.ajax({
                url: "http://localhost:5050/rest/api/ajax/fetchMinimumInventoryConfig",
                dataType: 'json',
                contentType: 'application/json',
                method: "POST",
                data: JSON.stringify(jsondata),
            })
            .done(function(data) {
                console.log(data["data"][0]["discounts"])
                discounts = data["data"][0]["discounts"]
                buildResetBlock(type, discounts)
                //$('.modal-toggle').trigger('click')
            });
        // discounts=rowdata["discounts"]
        // buildResetBlock(type,discounts)
    }



}


function buildResetBlock(type, discounts) {
    var html = ''
    for (var k = 0; k < discounts.length; k++) {
        var endval = discounts[k].end
        if (endval == null)
            endval = 'Max'
        var checkedAttr = ''
        if (discounts[k].hkOfferApplied == true)
            checkedAttr = 'checked'
        html += '<p class="pl-0"> ' + discounts[k].start + '- ' + endval + ' months | ' + discounts[k].discountPercent + '% | <input type="checkbox" readonly ' + checkedAttr + '/></p>'
    }

    $('#' + type + '-reset-block').html(html)
}



function resetFilters(type, tableName) {
    $('#' + type).find('.filter-filelds').val('')
    $('#' + type).find('.ms-clear').trigger('click')
    $('#' + type).find('.ms-options .ms-search input[type="text"]').val('')
    var tabelem = $('#' + type)
    tabelem.find('.filter-zone').multiselect('reset', true);
    $('#' + tableName).DataTable().ajax.reload();
}

function applyFilters(tableName) {
    console.log("apply filters - table name: " + tableName);
    $('#' + tableName).DataTable().ajax.reload();
}

function adjustExpiryRange(thisObj) {
    var parentDiv = $(thisObj).parent().parent().prev()
    var nextParentDiv = $(thisObj).parent().parent().next()
    var currDiv = $(thisObj).parent().parent().find('.expiry-end-lbl')
    var endval = currDiv.val()
    if (currDiv.hasClass('expiry-end-limits-inp')) {
        parentDiv.find('.expiry-end-lbl').addClass('expiry-end-limits-inp')
        parentDiv.find('.expiry-end-lbl').removeAttr('disabled')
    }
    if (currDiv.hasClass('expiry-first-record')) {
        $(thisObj).parent().parent().next().find('.expiry-start-lbl').text(1)
    }
    if ($('.expiry-end-lbl').length == 3) {
        console.log("remove-exp-cls")
        $('.expiry-first-record').parent().parent().find('.remove-exp-cls').show()
    }
    console.log("endval==" + endval)
    console.log(parentDiv.find('.expiry-end-lbl'))
    parentDiv.find('.expiry-end-lbl').val(endval)
    $(thisObj).parent().parent().remove()
    //inputValidate(nextParentDiv.find('.expiry-end-lbl'))
    inputValidate($('.expiry-start-limits-inp'))

}

function saveRangeOptions(thisObj) {
    var saveData = true
    var confirmFlag = false
    console.log("set===" + $('input[name="reset_discount_radio"]:checked').val())
    if ($(thisObj).data('confirm') == true) {
        saveData = false
        confirmFlag = true
        var r = confirm("Do you want to apply this discount setting to other selected records as well?");
        if (r == true) {
            saveData = true
        } else {
            saveData = false

        }
        //console.log(txt)
    }

    var discounts = []
    $(".rangeTable tbody tr").each(function() {
        console.log($(this))
        var discountList = {}
        if ($(this).find('.hk-offer-lbl').is(':checked'))
            discountList['hkOfferApplied'] = true
        else
            discountList['hkOfferApplied'] = false

        discountList['start'] = $(this).find('.expiry-start-lbl').text()
        var endval = ""
        if ($(this).find('.expiry-end-lbl').val() == "")
            endval = null
        else
            endval = $(this).find('.expiry-end-lbl').val()
        discountList['end'] = endval
        discountList['discountPercent'] = $(this).find('.discount-percent-lbl').val()
        discounts.push(discountList)
    });
    console.log(discounts)
    console.log($("#rangeModalPopup").data('row'))
    var popupData = $("#rangeModalPopup").data('row')
    var type = $("#rangeModalPopup").data('type')
    var data = {}
    data['discounts'] = discounts
    data['discountTypeId'] = discounts_id_list[type]
    data['rows'] = []
    data['resetTo'] = {}
    var row_arr = []
    var resetDiscount = $('input[name="reset_discount_radio"]:checked').val()
    if (resetDiscount != undefined) {
        data['resetTo'] = {
            "discountTypeId": resetDiscount,
            "brand": popupData.brand,
            "variantId": popupData.productVariantId
        }
    }
    var selectedRows = $($('#' + type + '-table').DataTable().$('input[type="checkbox"]').map(function() {
        if ($(this).is(":checked")) {
            row_arr.push({
                "brand": $(this).data("brand"),
                "variantId": $(this).data("variant-id"),
                "warehouseId": $(this).data("warehouse-id")
            })
        }
        return row_arr
    }));
    var singleRow = true
    if (row_arr.length > 0) {
        if (saveData == false && confirmFlag == true) {
            singleRow = true
        } else {
            data['rows'] = row_arr
            singleRow = false
        }

    }
    if (singleRow == true) {
        data['rows'].push({
            "warehouseId": popupData.warehouseId,
            "variantId": popupData.productVariantId,
            "brand": popupData.brand
        })
    }
    console.log(data)
    $.ajax({
            url: "https://demo8727571.mockable.io/editDiscounts",
            dataType: 'json',
            contentType: 'application/json',
            method: "POST",
            data: JSON.stringify(data)
        })
        .done(function(data) {
            $('#' + type + '-table').DataTable().ajax.reload();
            console.log("fild===" + '#' + type + '-select-all')
            console.log("v===" + $('#' + type + '-select-all').is(':checked'))
            $('#' + type + '-select-all').prop('checked', false)
            $('.modal').removeClass('is-visible');
            $('.reset-block').hide()
            $('.reset-select-radio').data('checked', false)
            //$('.modal-toggle').trigger('click')
        });
}

function saveConfig(thisObj) {
    console.log("saveConfig()");
    var currentTab = $('ul.tabs').find('.current').data('tab')
    var data = {};
    data['configurations'] = [];
    if($('#' + currentTab + '-table').DataTable().$('input:checked[type="checkbox"]').length == 0) {
        console.log("This is a single row");
        data['configurations'].push({
            "productVariantId": $('#editModalProductVariantId').text(),
            "productVariantName": $('#editModalProductVariantName').text(),
            "brand": $('#editModalBrand').text(),
            "zone": $('#editModalZone').text() == "NA" ? "" : $('#editModalZone').text(),
            "warehouse": $('#editModalWarehouse').text() == "NA" ? "" : $('#editModalWarehouse').text()
        });
    } else {
    console.log("This is a multiple rows");
        $('#' + currentTab + '-table').DataTable().$('input:checked[type="checkbox"]').map(function() {
//            if ($(this).is(":checked")) {
                var rowDataValues = $(this).data('row');
                data['configurations'].push({
                    "productVariantId": rowDataValues['productVariantId'],
                    "productVariantName": rowDataValues['productVariantName'],
                    "brand": rowDataValues['brand'],
                    "zone": rowDataValues['zone'],
                    "warehouse": rowDataValues['warehouse']
                })
//            }
        });
    }
//    var data = {};
//    data['configurations'] = [];
//    data['configurations'].push({
//        "productVariantId": $('#editModalProductVariantId').text(),
//        "productVariantName": $('#editModalProductVariantName').text(),
//        "brand": $('#editModalBrand').text(),
//        "zone": $('#editModalZone').text() == "NA" ? "" : $('#editModalZone').text(),
//        "warehouse": $('#editModalWarehouse').text() == "NA" ? "" : $('#editModalWarehouse').text()
//    });
    if($('#editModalMinInventory').val() == "") {
        data['minInventory'] = null;
    } else {
        data['minInventory'] = $('#editModalMinInventory').val();
    }
    data['configType'] = $('ul.tabs').find('.current').data('config-type');
    console.log(data);
    console.log(JSON.stringify(data));

    /* Save the configurations */
    $.ajax({
        url: "http://localhost:5050/rest/api/ajax/saveMinimumInventoryConfig",
        dataType: 'json',
        contentType: 'application/json',
        method: "POST",
        data: JSON.stringify(data)
    }).done(function(data) {
//        var currentTab = $('ul.tabs').find('.current').data('tab')
        $('#' + currentTab + '-table').DataTable().ajax.reload();
        $('.modal').removeClass('is-visible');
    });
}

function getVariantFilterDetails(tabelem) {
    var selectedBrands = tabelem.find('.filter-brand-name').val()
    if (selectedBrands.length > 0) {
        $.ajax({
                url: "http://localhost:5050/rest/api/ajax/getVariantsByBrands",
                dataType: 'json',
                contentType: 'application/json',
                method: "POST",
                data: JSON.stringify({
                    brands: selectedBrands
                }),
            })
            .done(function(data) {
                var options = []
                for (var j = 0; j < data['data'].length; j++) {
                    options.push({
                        name: data['data'][j],
                        value: data['data'][j],
                        checked: false
                    });
                }
                console.log(options)
                if (options.length > 0) {
                    tabelem.find('.filter-variant-id').removeAttr('disabled');
                    tabelem.find('.filter-variant-id').multiselect('disable', false);
                } else {
                    tabelem.find('.filter-variant-id').attr('disabled', 'disabled');
                    tabelem.find('.filter-variant-id').multiselect('disable', true);
                }
                tabelem.find('.filter-variant-id').multiselect('loadOptions', options);
            });
    } else {
        tabelem.find('.filter-variant-id').attr('disabled', 'disabled');
        tabelem.find('.filter-variant-id').multiselect('disable', true);
        tabelem.find('.filter-variant-id').multiselect('loadOptions', []);
    }
}

function loadZonesFilter() {
    var options = []
    for (var j = 0; j < zones.length; j++) {
        options.push({
            name: zones[j],
            value: zones[j],
            checked: false
        });
    }
    Object.keys(zones).forEach(function(zid) {
        options.push({
            name: zones[zid],
            value: zid,
            checked: false
        });
    });
    console.log(options)
    $('.filter-zone').multiselect('loadOptions', options);
}


function updateNextExpiryLimit(thisObj) {
    var val = $(thisObj).val()
    $('.expiry-start-limits-inp').text(parseInt(val) + 1)


}

function CustomFilterValidate(tabelem) {
    var selectedBrands = tabelem.find('.filter-brand-name').val()
    var selectedStores = tabelem.find('.filter-store').val()
    console.log(selectedBrands.length + "====" + selectedStores.length)
    if (selectedBrands.length > 0 && selectedStores.length > 0) {
        tabelem.find('.apply-filter').removeClass('disabled')
        tabelem.find('.apply-filter').removeAttr('disabled');
        tabelem.find('.clear-filter').removeClass('disabled');
        tabelem.find('.clear-filter').removeAttr('disabled');
    } else {
        if (tabelem.find('.apply-filter').hasClass('disabled') == false)
            tabelem.find('.apply-filter').addClass('disabled');
        if (tabelem.find('.clear-filter').hasClass('disabled') == false)
            tabelem.find('.clear-filter').addClass('disabled');
        tabelem.find('.apply-filter').attr('disabled', 'disabled');
        tabelem.find('.clear-filter').attr('disabled', 'disabled');
    }

}


function inputValidate(thisObj) {
    // if($(this).hasClass('expiry-end-lbl')){
    // 	console.log()

    // }
    console.log("in inputValidate")
    var enableSubmitBtn = true
    var enableSubmitCheck = true
    var startval = parseInt($(thisObj).parent().parent().find('.expiry-start-lbl').text())
    console.log(startval + "==>" + parseInt($(thisObj).parent().parent().find('.expiry-end-lbl').val()))
    if (startval > parseInt($(thisObj).parent().parent().find('.expiry-end-lbl').val())) {
        console.log("error")
        enableSubmitBtn = false
        if ($(thisObj).parent().parent().find('.expiry-end-lbl').hasClass('error') == false) {

            $(thisObj).parent().parent().find('.expiry-end-lbl').addClass('error')

        }
    } else {
        $(thisObj).parent().parent().find('.expiry-end-lbl').removeClass('error')

    }

    $dErrorFields = []
    var prevDiscVal = 0
    $('#rangeModalPopup .discount-percent-lbl').each(function(index, element) {
        console.log("val==" + $(this).val())
        var hasErr = false
        if ((parseInt($(this).val()) > 100) || (parseInt($(this).val()) < 0)) {
            $dErrorFields.push($(this).val())
            hasErr = true
            if ($(this).hasClass('error') == false)
                $(this).addClass('error')
        } else if (index != 0) {
            if (parseInt($(this).val()) >= parseInt(prevDiscVal)) {
                $dErrorFields.push($(this).val())
                hasErr = true
                if ($(this).hasClass('error') == false)
                    $(this).addClass('error')
            }
        }
        if (hasErr == false) {
            $(this).removeClass('error')
        }
        prevDiscVal = $(this).val()
    });
    if ($dErrorFields.length) {
        enableSubmitBtn = false
    }
    console.log("dlem=" + $dErrorFields.length)
    $emptyFields = []
    //var $emptyFields = $('#rangeModalPopup .input_field').filter(function() {
    $('#rangeModalPopup .input_field').each(function(index, element) {
        //return $.trim(thisObj.value) === "";
        if ($(this).val().trim() == "")
            $emptyFields.push($(this).val())
    });
    console.log("len-=====" + $emptyFields.length)
    if ($emptyFields.length) {
        enableSubmitCheck = false
    }
    console.log("enableSubmitBtn=" + enableSubmitBtn + "===" + enableSubmitCheck)
    if (enableSubmitBtn == true && enableSubmitCheck == true) {
        $('.submitBtn').removeAttr('disabled')
        $('.submitBtn').removeClass('disabled')
        $('.addExpiryRange').removeAttr('disabled')
        $('.addExpiryRange').removeClass('disabled')
    } else {
        $('.submitBtn').attr('disabled', 'disabled')
        if ($('.submitBtn').hasClass('disabled') == false)
            $('.submitBtn').addClass('disabled')
        $('.addExpiryRange').attr('disabled', 'disabled')
        if ($('.addExpiryRange').hasClass('disabled') == false)
            $('.addExpiryRange').addClass('disabled')
    }

}

$(document).ready(function() {
//        var zones_list = ["north", "south"]
//        zones = zones_list

        /* Tab clicking */
        $('ul.tabs li').click(function() {
            var tab_id = $(this).attr('data-tab');

            $('ul.tabs li').removeClass('current');
            $('.tab-content').removeClass('current');

            $(this).addClass('current');
            $("#" + tab_id).addClass('current');

            //if(jQuery.inArray(tab_id,list_initialized_arr) == -1){
            $('#' + tab_id + '-select-all').prop('checked', false)
            $('#' + tab_id).find('.filter-filelds').val('')
            $('#' + tab_id).find('.ms-clear').trigger('click')
            $('#' + tab_id).find('.ms-options .ms-search input[type="text"]').val('')
            console.log(">>>>>>>>>> tab id " + tab_id)
            var tabelem = $('#' + tab_id)
            tabelem.find('.filter-zone').multiselect('reset', true);
            var discounts = new listDiscounts({
                url: "http://localhost:5050/rest/api/ajax/fetchMinimumInventoryConfig",
                tablename: tab_id + '-table',
                type: tab_id,
                configType: discounts_id_list[tab_id]
            });
            discounts.generateIPList();
        });

        /* Modal */
        $('.modal-toggle').click(function() {
            // e.preventDefault();
            $('.modal').toggleClass('is-visible');
            console.log("enters toggle")
            $('.reset-block').hide()
            $('.reset-select-radio').data('checked', false)
        });

        $('.reset-select-radio').click(function() {
            var divId = $(this).data('block')
            $('.reset-block:not(#' + divId + ')').hide('fast');
            $('#' + divId).show('fast');
            if ($('#rangeModalPopup').find('.table-cover').hasClass('disabled') == false) {
                $('#rangeModalPopup').find('.table-cover').addClass('disabled')
            }

        });

    $.fn.dataTable.ext.errMode = 'none';
    for (ditem in discounts_id_list) {
        console.log("item==" + ditem)
        global_discounts = new listDiscounts({
            url: "http://localhost:5050/rest/api/ajax/fetchMinimumInventoryConfig",
            tablename: ditem + '-table',
            type: ditem,
            discountTypeId: discounts_id_list[ditem]
        });
        global_discounts.generateIPList()

        console.log(ditem + "-brand-name")
//        $("#" + ditem + "-brand-name").attr("disabled", "disabled")
        $("#" + ditem + "-variant-id").attr("disabled", "disabled")
        $("#" + ditem + "-store").attr("disabled", "disabled")
    }



    $("body").tooltip({
        selector: '[rel=tooltip]',
        position: {
            my: "left top",
            at: "left bottom"
        },
        content: function() {
            return $(this).attr('title');
        }
    })

    var totalFilterOptions = {
        "brand-discounts": [],
        "zone-config": [],
        "custom-config": [],
    }
//    $('.filter-brand-type').multiselect({
//        columns: 1,
//        placeholder: 'Select',
//        clear: true,
//        minHeight: 90,
//        onOptionClick: function(element, option) {
//            var thisOpt = $(option);
//            var tabelem = $(element).parent().parent().parent().parent()
//            console.log(tabelem.attr('id'))
//            var options = []
//            if (thisOpt.prop('checked')) {
//                if (jQuery.inArray(thisOpt.val(), totalFilterOptions[tabelem.attr('id')]) == -1)
//                    totalFilterOptions[tabelem.attr('id')].push(thisOpt.val())
//
//            } else {
//                totalFilterOptions[tabelem.attr('id')].splice(totalFilterOptions[tabelem.attr('id')].indexOf(thisOpt.val()), 1);
//            }
//
//            console.log(totalFilterOptions)
//            for (var i = 0; i < totalFilterOptions[tabelem.attr('id')].length; i++) {
//                $.each(brands_mapping, function(key, value) {
//
//                    if (value == totalFilterOptions[tabelem.attr('id')][i]) {
//                        options.push({
//                            name: key,
//                            value: key,
//                            checked: false
//                        });
//                    }
//                });
//            }
//
//            console.log("OPTIONS===")
//            console.log(options)
//
//            if (options.length > 0) {
//                tabelem.find('.filter-brand-name').removeAttr('disabled');
//                tabelem.find('.filter-brand-name').multiselect('disable', false);
//            } else {
//                tabelem.find('.filter-brand-name').attr('disabled', 'disabled');
//                tabelem.find('.filter-brand-name').multiselect('disable', true);
//            }
//            if (tabelem.attr('id') == "brand-discounts") {
//                if (totalFilterOptions[tabelem.attr('id')].length > 0) {
//
//                    tabelem.find('.apply-filter').removeClass('disabled')
//                    tabelem.find('.apply-filter').removeAttr('disabled');
//                    tabelem.find('.clear-filter').removeClass('disabled');
//                    tabelem.find('.clear-filter').removeAttr('disabled');
//                } else {
//                    if (tabelem.find('.apply-filter').hasClass('disabled') == false)
//                        tabelem.find('.apply-filter').addClass('disabled');
//                    if (tabelem.find('.clear-filter').hasClass('disabled') == false)
//                        tabelem.find('.clear-filter').addClass('disabled');
//                    tabelem.find('.apply-filter').attr('disabled', 'disabled');
//                    tabelem.find('.clear-filter').attr('disabled', 'disabled');
//                }
//                console.log(tabelem.find('.filter-brand-name').val())
//
//
//            }
//            tabelem.find('.filter-brand-name').multiselect('loadOptions', options);
//        },
//        onClear: function(element) {
//
//            var tabelem = $(element).parent().parent().parent().parent()
//            tabelem.find('.filter-brand-name').attr('disabled', 'disabled');
//            tabelem.find('.filter-brand-name').multiselect('disable', true);
//            totalFilterOptions[tabelem.attr('id')] = []
//            if (tabelem.attr('id') == "brand-discounts") {
//                if (tabelem.find('.apply-filter').hasClass('disabled') == false)
//                    tabelem.find('.apply-filter').addClass('disabled');
//                if (tabelem.find('.clear-filter').hasClass('disabled') == false)
//                    tabelem.find('.clear-filter').addClass('disabled');
//                tabelem.find('.apply-filter').attr('disabled', 'disabled');
//                tabelem.find('.clear-filter').attr('disabled', 'disabled');
//
//            }
////            tabelem.find('.filter-brand-name').multiselect('loadOptions', []);
//        }
//    });


    var totalBrandFilterOptions = {
        "global-config": [],
        "brand-discounts": [],
        "zone-config": [],
        "custom-config": [],
    }
    $('.filter-brand-name').multiselect({
        columns: 1,
        placeholder: 'Select',
        search: true,
        selectAll: true,
        clear: true,
        minHeight: 90,
        onOptionClick: function(element, option) {
            var thisOpt = $(option);
            var tabelem = $(element).parent().parent().parent().parent()
            console.log($(element).parent().parent().parent().parent())

            if (thisOpt.prop('checked')) {
                if (jQuery.inArray(thisOpt.val(), totalBrandFilterOptions[tabelem.attr('id')]) == -1)
                    totalBrandFilterOptions[tabelem.attr('id')].push(thisOpt.val())

            } else {
                totalBrandFilterOptions[tabelem.attr('id')].splice(totalBrandFilterOptions[tabelem.attr('id')].indexOf(thisOpt.val()), 1);
            }

            if (tabelem.attr('id') == "zone-config") {
                if (totalBrandFilterOptions[tabelem.attr('id')].length > 0) {

                    tabelem.find('.apply-filter').removeClass('disabled')
                    tabelem.find('.apply-filter').removeAttr('disabled');
                    tabelem.find('.clear-filter').removeClass('disabled');
                    tabelem.find('.clear-filter').removeAttr('disabled');
                } else {
                    if (tabelem.find('.apply-filter').hasClass('disabled') == false)
                        tabelem.find('.apply-filter').addClass('disabled');
                    if (tabelem.find('.clear-filter').hasClass('disabled') == false)
                        tabelem.find('.clear-filter').addClass('disabled');
                    tabelem.find('.apply-filter').attr('disabled', 'disabled');
                    tabelem.find('.clear-filter').attr('disabled', 'disabled');
                }
                console.log(tabelem.find('.filter-brand-name').val())

            }
            if (tabelem.attr('id') != "brand-discounts") {
                getVariantFilterDetails(tabelem)
            }
            if (tabelem.attr('id') == "custom-config") {
                CustomFilterValidate(tabelem)
            }


        },
        onSelectAll: function(element, selected) {
            var tabelem = $(element).parent().parent().parent().parent()
            if (tabelem.attr('id') == "zone-config") {
                if (selected > 0) {
                    tabelem.find('.apply-filter').removeClass('disabled')
                    tabelem.find('.apply-filter').removeAttr('disabled');
                    tabelem.find('.clear-filter').removeClass('disabled');
                    tabelem.find('.clear-filter').removeAttr('disabled');
                } else {
                    totalBrandFilterOptions[tabelem.attr('id')] = []
                    if (tabelem.find('.apply-filter').hasClass('disabled') == false)
                        tabelem.find('.apply-filter').addClass('disabled');
                    if (tabelem.find('.clear-filter').hasClass('disabled') == false)
                        tabelem.find('.clear-filter').addClass('disabled');
                    tabelem.find('.apply-filter').attr('disabled', 'disabled');
                    tabelem.find('.clear-filter').attr('disabled', 'disabled');
                }

                console.log(tabelem.find('.filter-brand-name').val())
            }
            if (tabelem.attr('id') != "brand-discounts") {
                getVariantFilterDetails(tabelem)
            }
            if (tabelem.attr('id') == "custom-config") {
                CustomFilterValidate(tabelem)
            }
        },
        onClear: function(element) {
            var tabelem = $(element).parent().parent().parent().parent()
            totalBrandFilterOptions[tabelem.attr('id')] = []
            if (tabelem.attr('id') == "zone-config") {
                if (tabelem.find('.apply-filter').hasClass('disabled') == false)
                    tabelem.find('.apply-filter').addClass('disabled');
                if (tabelem.find('.clear-filter').hasClass('disabled') == false)
                    tabelem.find('.clear-filter').addClass('disabled');
                tabelem.find('.apply-filter').attr('disabled', 'disabled');
                tabelem.find('.clear-filter').attr('disabled', 'disabled');

            }
            if (tabelem.attr('id') != "brand-discounts") {
                tabelem.find('.filter-variant-id').attr('disabled', 'disabled');
                tabelem.find('.filter-variant-id').multiselect('disable', true);
                tabelem.find('.filter-variant-id').multiselect('loadOptions', []);
            }
            if (tabelem.attr('id') == "custom-config") {
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
        minHeight: 90,

    });

    $('.filter-store').multiselect({
        columns: 1,
        placeholder: 'Select',
        search: true,
        selectAll: true,
        clear: true,
        minHeight: 90,
        onOptionClick: function(element, option) {
            var thisOpt = $(option);
            var options = []
            var tabelem = $(element).parent().parent().parent().parent()
            CustomFilterValidate(tabelem)

        },
        onSelectAll: function(element, selected) {
            var tabelem = $(element).parent().parent().parent().parent()
            CustomFilterValidate(tabelem)

        },
        onClear: function(element) {
            var tabelem = $(element).parent().parent().parent().parent()
            CustomFilterValidate(tabelem)

        }
    });

    var totalStoreFilterOptions = []
    $('.filter-zone').multiselect({
        columns: 1,
        placeholder: 'Select',
        search: true,
        selectAll: true,
        clear: true,
        minHeight: 90,
        onOptionClick: function(element, option) {
            if($('ul.tabs').find('.current').data('tab') == 'custom-config') {
                var thisOpt = $(option);
                var options = []
                var tabelem = $(element).parent().parent().parent().parent()
                console.log($(element).parent().parent().parent().parent())

                if (thisOpt.prop('checked')) {
                    if (jQuery.inArray(thisOpt.val(), totalStoreFilterOptions) == -1)
                        totalStoreFilterOptions.push(thisOpt.val())

                } else {
                    totalStoreFilterOptions.splice(totalStoreFilterOptions.indexOf(thisOpt.val()), 1);
                }

                console.log(totalStoreFilterOptions);

                for (var i = 0; i < totalStoreFilterOptions.length; i++) {
                    for (store_item in store_mapping) {
                        console.log(store_mapping[store_item])
                        console.log(store_mapping[store_item].zone + '==' + totalStoreFilterOptions[i])
                        if (store_mapping[store_item].zone == totalStoreFilterOptions[i]) {
                            options.push({
                                name: store_mapping[store_item].name,
                                value: store_mapping[store_item].id,
                                checked: false
                            });
                        }
                    }

                }
                console.log(options)
                if (options.length > 0) {
                    tabelem.find('.filter-store').removeAttr('disabled');
                    tabelem.find('.filter-store').multiselect('disable', false);
                } else {
                    tabelem.find('.filter-store').attr('disabled', 'disabled');
                    tabelem.find('.filter-store').multiselect('disable', true);
                }
                tabelem.find('.filter-store').multiselect('loadOptions', options);
                CustomFilterValidate(tabelem)
            }

        },
        onSelectAll: function(element, selected) {
            var tabelem = $(element).parent().parent().parent().parent()
            var options = []

            if (selected > 0) {
                for (store_item in store_mapping) {
                    options.push({
                        name: store_mapping[store_item].name,
                        value: store_mapping[store_item].id,
                        checked: false
                    });
                    totalStoreFilterOptions.push(store_mapping[store_item].id)
                }
            }
            if (options.length > 0) {
                tabelem.find('.filter-store').removeAttr('disabled');
                tabelem.find('.filter-store').multiselect('disable', false);
            } else {
                tabelem.find('.filter-store').attr('disabled', 'disabled');
                tabelem.find('.filter-store').multiselect('disable', true);
            }
            tabelem.find('.filter-store').multiselect('loadOptions', options);
            if(element.id != "zone-config-zone") {
                CustomFilterValidate(tabelem);
            }
        },
        onClear: function(element) {
            var tabelem = $(element).parent().parent().parent().parent()
            totalStoreFilterOptions = []
            tabelem.find('.apply-filter').attr('disabled', 'disabled');
            tabelem.find('.clear-filter').attr('disabled', 'disabled');
            tabelem.find('.filter-store').attr('disabled', 'disabled');
            tabelem.find('.filter-store').multiselect('disable', true);
            tabelem.find('.filter-store').multiselect('loadOptions', []);
            CustomFilterValidate(tabelem)

        }

    });

    loadZonesFilter()

    // Handle click on "Select all" control
    $('#global-config-select-all').on('click', function() {
        // Get all rows with search applied
        console.log("checked==" + this.checked)
        var rows = $('#global-config-table').DataTable().rows({
            'search': 'applied'
        }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        for(var i = 0; i < rows.length; i++) {
            var row = $(rows[i]);
            if(row.hasClass('tr-disabled')) {
                continue;
            } else {
                row.find('input[type="checkbox"]').prop('checked',this.checked);
            }
        }
    });

    $('#zone-config-select-all').on('click', function() {
        // Get all rows with search applied
        console.log("checked==" + this.checked)
        var rows = $('#zone-config-table').DataTable().rows({
            'search': 'applied'
        }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        for(var i = 0; i < rows.length; i++) {
            var row = $(rows[i]);
            if(row.hasClass('tr-disabled')) {
                continue;
            } else {
                row.find('input[type="checkbox"]').prop('checked',this.checked);
            }
        }
    });

    $('#custom-config-select-all').on('click', function() {
        // Get all rows with search applied
        console.log("checked==" + this.checked)
        var rows = $('#custom-config-table').DataTable().rows({
            'search': 'applied'
        }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        for(var i = 0; i < rows.length; i++) {
            var row = $(rows[i]);
            if(row.hasClass('tr-disabled')) {
                continue;
            } else {
                row.find('input[type="checkbox"]').prop('checked',this.checked);
            }
        }
    });


    $('.addExpiryRange').on('click', function() {
        if ($('.expiry-end-lbl').length == 2) {
            $('.expiry-first-record').parent().parent().find('.remove-exp-cls').hide()
        }


        var rowHtml = '<tr><td class="text-center">' +
            '<span class="expiry-start-lbl "></span></td>' +
            ' <td>-</td><td><input type="number" min="0" class="input_field expiry-end-lbl expiry-first-record expiry-end-limits-inp" oninput="updateNextExpiryLimit(this)" ></td>' +
            ' <td><input type="number" min="0" max="100" class="input_field discount-percent-lbl" ></td>' +
            '<td class="text-center"><input class="hk-offer-lbl" type="checkbox"></td>' +
            '<td class="text-center"><span style="color: red;cursor:pointer;" class="fosz14 remove-exp-cls" onclick="adjustExpiryRange(this)">✖</span></td></tr>'


        var parentObj = $('#rangeModalPopup .expiry-end-limits-inp').parent().parent()
        // var parentObj=$('#rangeModalPopup .expiry-start-limits-inp').parent().parent()

        // var cloneObj=parentObj.clone()
        var endval = 0
        var cloneObj = $(rowHtml)
        if (parentObj.length > 0) {
            parentObj.find('.expiry-end-limits-inp').attr("disabled", "disabled")
            endval = parentObj.find('.expiry-end-limits-inp').val()
            parentObj.find('.expiry-end-limits-inp').removeClass('expiry-end-limits-inp')
        }

        cloneObj.find('.input_field').val('')
        cloneObj.find('.expiry-end-limits-inp').val(parseInt(endval) + defaultSlab)
        cloneObj.find('.expiry-end-limits-inp').attr('min', parseInt(endval) + 1)
        cloneObj.find('.expiry-start-lbl').text(parseInt(endval) + 1)
        cloneObj.find('.remove-exp-cls').show()
        cloneObj.find('.expiry-first-record').removeClass('expiry-first-record')
        $('#rangeModalPopup .expiry-start-limits-inp').text(parseInt(endval) + defaultSlab + 1)
        //parentObj.after(cloneObj)
        var pObj = $('#rangeModalPopup .expiry-start-limits-inp').parent().parent()
        pObj.before(cloneObj)
        $('.addExpiryRange').attr('disabled', 'disabled')
        if ($('.addExpiryRange').hasClass('disabled') == false)
            $('.addExpiryRange').addClass('disabled')
        if ($('.submitBtn').hasClass('disabled') == false)
            $('.submitBtn').addClass('disabled')
        $('.submitBtn').attr('disabled', 'disabled')

    });

    $('body').on('input', '#rangeModalPopup .input_field', function(e) {
        inputValidate(this)

    });

    $('.reset-select-radio').click(function(e) {

        if ($(this).data("checked")) {
            $(this).prop('checked', false);
            $(this).data('checked', false)
            $('#' + $(this).data('block')).hide()
            $('#rangeModalPopup').find('.table-cover').removeClass('disabled')
            $('.addExpiryRange').removeAttr('disabled')
            $('.addExpiryRange').removeClass('disabled')
        } else {
            //$(this).prop('checked', true);
            $('.reset-select-radio').data('checked', false)

            $('.addExpiryRange').attr('disabled', 'disabled')
            if ($('.addExpiryRange').hasClass('disabled') == false)
                $('.addExpiryRange').addClass('disabled')
            $(this).data('checked', true)

        }
        var dbloc = $(this).data('block')
        $('.modal-content').animate({
            scrollTop: $("#" + dbloc).position().top
        }, 2000);

    });

    /* Populate the brands */
    var brandOptions = [];
    $.each(brands, function(index, key) {
        brandOptions.push({
            name: key,
            value: key,
            checked: false
        });
    });
    console.log(brandOptions);
    $('.filter-brand-name').multiselect('loadOptions', brandOptions);

    /* NA click event */
    $('#editModalNaCheckbox').click(function() {
        console.log("na >>>>>>>>>>>>>>> " + $('#editModalNaCheckbox').prop('checked'));
        if($('#editModalNaCheckbox').prop('checked') == true) {
            $('#editModalMinInventory').attr('disabled','disabled');
            $('#editModalMinInventory').val(null);
        } else {
            $('#editModalMinInventory').removeAttr('disabled');
            $('#editModalMinInventory').val(0);
        }
    });
});
