angular.module("EmmetBlue")

.controller('accountsBillingBillingTypeController', function($scope, utils){
	var functions = {
		actionMarkups: {
			billingTypeActionMarkup: function (data, type, full, meta){
				var editButtonAction = "manageBillingType('edit', "+data.BillingTypeID+")";
				var deleteButtonAction = "manageBillingType('delete', "+data.BillingTypeID+")";
				var itemManagementButtonAction = "manageBillingType('item-management', "+data.BillingTypeID+")";

				var dataOpt = "data-option-id='"+data.BillingTypeID+"' data-option-name='"+data.BillingTypeName+"' data-option-description='"+data.BillingTypeDescription+"'";

				// var editButton = "<button class='btn btn-default billing-type-btn' ng-click=\""+editButtonAction+"\" "+dataOpt+"><i class='icon-pencil5'></i> </button>";
				// var deleteButton = "<button class='btn btn-default billing-type-btn' ng-click=\""+deleteButtonAction+"\" "+dataOpt+"><i class='icon-bin'></i> </button>";
				// var viewButton = "<button class='btn btn-default'><i class='icon-eye'> </i> View</button>";
				// var itemManagementButton = "<button class='btn btn-default billing-type-btn' ng-click=\""+itemManagementButtonAction+"\" "+dataOpt+"><i class='icon-equalizer'></i> Manage Items</button>";

				var group = "<div class='btn-group'>"+
								"<button type='button' class='btn bg-teal-400 btn-info btn-labeled' ng-click=\""+itemManagementButtonAction+"\" "+dataOpt+"><b><i class='icon-menu7'></i></b> Manage </button>"+
		                    	"<button type='button' class='btn bg-teal-400 dropdown-toggle' data-toggle='dropdown'><span class='caret'></span></button>"+
		                    	"<ul class='dropdown-menu dropdown-menu-right'>"+
									"<li><a href='#' class='billing-type-btn' ng-click=\""+editButtonAction+"\" "+dataOpt+"><i class='icon-pencil5'></i> Edit Category</a></li>"+
									"<li><a href='#' class='billing-type-btn' ng-click=\""+deleteButtonAction+"\" "+dataOpt+"><i class='icon-cross text-danger'></i> Delete Category</a></li>"+
									"<li class='divider'></li>"+
									"<li><a href='#' class='billing-type-btn' ng-click=\""+itemManagementButtonAction+"\" "+dataOpt+"><i class='icon-law'></i> Manage Items In This Category</a></li>"+
								"</ul>"+
							"</div>";
				// var buttons = "<div class='btn-group'>"+editButton+deleteButton+itemManagementButton+"</button>";
				return group;
			},
			checkAll: {
				title: '<input ng-model="billingTypeSelector.selectAll" ng-click="billingTypeSelector.toggleAll(billingTypeSelector.selectAll, billingTypeSelector.selected)" type="checkbox">',
				body: function(data, type, full, meta){
					$scope.billingTypeSelector.selected[full.BillingTypeID] = false;
					return '<input ng-model="billingTypeSelector.selected[' + data.BillingTypeID + ']" ng-click="billingTypeSelector.toggleOne(billingTypeSelector.selected)" type="checkbox">';
				}
			}
		},
		toggleAllCheckboxes: function(selectAll, selectedItems){
			for (var id in selectedItems) {
	            if (selectedItems.hasOwnProperty(id)) {
	                selectedItems[id] = selectAll;
	            }
	        }
		},
		toggleOneCheckbox: function(selectedItems){
	       for (var id in selectedItems) {
	            if (selectedItems.hasOwnProperty(id)) {
	                if(!selectedItems[id]) {
	                    $scope.billingTypeSelector.selectAll = false;
	                    return;
	                }
	            }
	        }
	        $scope.billingTypeSelector.selectAll = true;
		},
		newBillingTypeCreated: function(){
			utils.alert("Operation Successful", "You have successfully created a new billingType", "success", "notify");
			$scope.newBillingType = {};
			$("#new_billingType").modal("hide");

			$scope.reloadBillingTypeTable();
		},
		billingTypeEdited: function(){
			utils.alert("Operation Successful", "Your changes have been saved successfully", "success", "notify");
			$scope.tempHolder = {};
			$("#edit_billingType").modal("hide");

			$scope.reloadBillingTypeTable();
		},
		billingTypeDeleted: function(){
			utils.alert("Operation Successful", "The selected billingType has been deleted successfully", "success", "notify");
			$scope.tempHolder = {};
			delete  $scope._id;

			$scope.reloadBillingTypeTable();
		},
		manageBillingType: {
			newBillingType: function(){
				$("#new_billingType").modal("show");
				$("#new_billingType").modal({"backdrop":"static"});
			},
			editBillingType: function(id){
				$scope.tempHolder.billingTypeName = $(".billing-type-btn[data-option-id='"+id+"']").attr('data-option-name');
				$scope.tempHolder.billingTypeDescription = $(".billing-type-btn[data-option-id='"+id+"']").attr('data-option-description');
				$scope.tempHolder.resourceId = id;

				$("#edit_billingType").modal("show");
			},
			deleteBillingType: function(id){
				var title = "Delete Prompt";
				var text = "You are about to delete the billingType named "+$(".billing-type-btn[data-option-id='"+id+"']").attr('data-option-name')+". Do you want to continue? Please note that this action cannot be undone";
				var close = true;
				$scope._id = id;
				var callback = function(){
					var deleteRequest = utils.serverRequest('/accounts-biller/billing-type/delete?'+utils.serializeParams({
						'resourceId': $scope._id
					}), 'DELETE');

					deleteRequest.then(function(response){
						functions.billingTypeDeleted();
					}, function(responseObject){
						utils.errorHandler(responseObject);
					})
				}
				var type = "warning";
				var btnText = "Delete";

				utils.confirm(title, text, close, callback, type, btnText);
			},
			itemManagement: function(id){
				var data = {
					name: $(".billing-type-btn[data-option-id='"+id+"']").attr('data-option-name'),
					id: id
				}

				utils.storage.billingTypeItemsData = data;
				$("#billing_type_items").modal("show");
			},
			deleteAllSelectedBillingTypes: function(){
				var selectedGroups = $scope.billingTypeSelector.selected;
				angular.forEach(selectedGroups, function(val, key){
					if (val){
						functions.manageBillingType.deleteBillingType(key);
					}
				})
			},
			viewBillingType: function(groupId){

			}
		}
	}
	$scope.billingTypeSelector = {
		selectAll: false,
		toggleAll: functions.toggleAllCheckboxes,
		toggleOne: functions.toggleOneCheckbox,
		selected: {}
	};

	$scope.tempHolder = {};

	$scope.dtInstance = {};
	$scope.dtOptions = utils.DT.optionsBuilder
	.fromFnPromise(function(){
		var billingTypes = utils.serverRequest('/accounts-biller/billing-type/view', 'GET');
		return billingTypes;
	})
	.withPaginationType('full_numbers')
	.withDisplayLength(50)
	.withOption('createdRow', function(row, data, dataIndex){
		utils.compile(angular.element(row).contents())($scope);
	})
	.withOption('headerCallback', function(header) {
        if (!$scope.headerCompiled) {
            $scope.headerCompiled = true;
            utils.compile(angular.element(header).contents())($scope);
        }
    })
	.withButtons([
		{
			text: '<i class="icon-file-plus"></i> <u>N</u>ew billing type',
			action: function(){
				functions.manageBillingType.newBillingType();
			},
			key: {
        		key: 'n',
        		ctrlKey: false,
        		altKey: true
        	}
		},
        {
        	extend: 'print',
        	text: '<i class="icon-printer"></i> <u>P</u>rint this data page',
        	key: {
        		key: 'p',
        		ctrlKey: false,
        		altKey: true
        	},
        	exportOptions:{
        		columns: [0, 1, 2]
        	}
        },
        {
        	extend: 'copy',
        	text: '<i class="icon-copy"></i> <u>C</u>opy this data',
        	key: {
        		key: 'c',
        		ctrlKey: false,
        		altKey: true
        	},
        	exportOptions:{
        		columns: [0, 1, 2]
        	},
        	exportData: {
        		decodeEntities: true
        	}
        }
	]);	

	$scope.dtColumns = [
		utils.DT.columnBuilder.newColumn('BillingTypeID').withTitle("ID").withOption('width', '0.5%'),
		utils.DT.columnBuilder.newColumn('BillingTypeName').withTitle("Name"),
		utils.DT.columnBuilder.newColumn('BillingTypeDescription').withTitle("Description"),
		utils.DT.columnBuilder.newColumn(null).withTitle("Action").renderWith(functions.actionMarkups.billingTypeActionMarkup).withOption('width', '25%').notSortable()
	];

	$scope.reloadBillingTypeTable = function(){
		$scope.dtInstance.reloadData();
	}

	$scope.saveNewBillingType = function(){
		var newBillingType = $scope.newBillingType;
		$('.loader').addClass('show');
		var saveNewBillingType = utils.serverRequest('/accounts-biller/billing-type/new', 'POST', newBillingType);

		saveNewBillingType.then(function(response){
			$('.loader').removeClass('show');
			functions.newBillingTypeCreated();
		}, function(response){
			$('.loader').removeClass('show');
			utils.errorHandler(response);
		});
	}

	$scope.saveEditBillingType = function(){
		var edits = $scope.tempHolder;
			$('.loader').addClass('show');
		var saveEdits = utils.serverRequest('/accounts-biller/billing-type/edit', 'PUT', edits);
		saveEdits.then(function(response){
			$('.loader').removeClass('show');
			functions.billingTypeEdited();
		}, function(responseObject){
			$('.loader').removeClass('show');
			utils.errorHandler(responseObject);
		})

	}

	$scope.manageBillingType = function(manageGroup, id){
		switch(manageGroup.toLowerCase()){
			case "edit":{
				functions.manageBillingType.editBillingType(id);
				break;
			}
			case "delete":{
				functions.manageBillingType.deleteBillingType(id);
				break;
			}
			case "item-management":{
				functions.manageBillingType.itemManagement(id);
				break;
			}
		}
	}
});
