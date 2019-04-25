/*global location*/
sap.ui.define([
	"ui/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ui/model/formatter"
], function(
	BaseController,
	JSONModel,
	History,
	formatter
) {
	"use strict";

	return BaseController.extend("ui.controller.Crew", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("crew").attachPatternMatched(this.clearAll, this);
			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},
		
		clearAll: function()
		{
			var crewDetails = this.byId("crewDetails");
			var noDetails = crewDetails.getItems().length;
			var noMembers = crewDetails.getItems()[0].getItems().length;

			for(var j=0; j<noDetails; j++)
			{
				var vBox = crewDetails.getItems()[j];
			for(var i=1; i<noMembers-1; i++)
			{
				vBox.getItems()[i].destroy();
			}
			}
	
		},

			// collectData : function (oEvent) {
			// 	this.data =  oEvent.getParameter("arguments").data;
			// },
		

		onAddCrew: function() {
			// var name = this.byId("name").getValue();
			// var iNo = this.byId("iNo").getValue();
			// var address = this.byId("address").getValue();
			// var mobileNo = this.byId("mobileNo").getValue();
			if (this.byId("transport").getSelected()) {
				var transport = "Yes";
			} else {
				var transport = "No";
			}

			var index = this.byId("nameVB").indexOfItem(this.byId("name"));
			var that = this;

			var crewDetails = this.byId("crewDetails");
			var noDetails = crewDetails.getItems().length;

			var empty = false;
			for (var i = 0; i < noDetails; i++) {
				var detailVB = crewDetails.getItems()[i];
				if (i < noDetails - 2) {
					var detailText = detailVB.getItems()[index].getValue();
					if (detailText === "") {
						empty = true;
						break;
					}
				}
			}
			if (empty) {
				sap.m.MessageToast.show("Please enter all details");
			}

			// if (name === "" || iNo === "" || address === "" || mobileNo === "") {
			// 	sap.m.MessageToast.show("Please Enter all details");
			// }
			else {
				// var editButton = new sap.ui.core.Icon({
				// 	src: "sap-icon://edit",
				// 	color: "Blue",
				// 	press: this.onEditPress
				// });
				
				var deleteButton = new sap.ui.core.Icon({
					src: "sap-icon://sys-cancel",
					color: "Blue",
					press: this.onDeletePress
				});

				// var crewDetails = this.byId("crewDetails");
				// var noDetails = crewDetails.getItems().length;
				for (var i = 0; i < noDetails; i++) {
					var detailVB = crewDetails.getItems()[i];
					if (i < noDetails - 2) {

						var detailText = detailVB.getItems()[index].getValue();
						detailVB.insertItem(new sap.m.Label({
							text: detailText,
							tooltip: detailText,
							width: "10rem"
						}), index);
						detailVB.getItems()[index + 1].setValue("");
					} else if (i === noDetails - 2) {
						detailVB.insertItem(new sap.m.Label({
							text: transport,
							tooltip: transport,
							width: "10rem"
						}), index);
						detailVB.getItems()[index + 1].setSelected(false);
					} else {
						detailVB.insertItem(deleteButton, index);
					}
				}
				// this.byId("nameVB").insertItem( new sap.m.Label({text:name, tooltip:name, width:"10rem"}), index);
				// this.byId("iNoVB").insertItem( new sap.m.Label({text:iNo, tooltip:iNo, width:"10rem"}), index);
				// this.byId("addressVB").insertItem( new sap.m.Label({text:address, tooltip:address, width:"10rem"}), index);
				// this.byId("mobileNoVB").insertItem( new sap.m.Label({text:mobileNo, tooltip:mobileNo, width:"10rem"}), index);
				// this.byId("transportVB").insertItem( new sap.m.Label({text:transport, tooltip:transport, width:"10rem"}), index);
				// this.byId("actionVB").insertItem( editButton, index);

				// this.byId("name").setValue("");
				// this.byId("iNo").setValue("");
				// this.byId("address").setValue("");
				// this.byId("mobileNo").setValue("");

			}
		},

		onDeletePress: function(oEvent)
		{
			var vBox = oEvent.getSource().getParent();
			var hBox = oEvent.getSource().getParent().getParent();
			var noVBoxes = hBox.getItems().length;
			var deleteIcon = sap.ui.getCore().byId(oEvent.getSource().getId());
			var editIndex = vBox.indexOfItem(deleteIcon);

			for (var i = 0; i < noVBoxes; i++) {
				var itemVB = hBox.getItems()[i];
				var editItem = itemVB.getItems()[editIndex];
				editItem.destroy();
			}			
		},

		onEditPress: function(oEvent) {
			var that = this;
			this.vBox = oEvent.getSource().getParent();
			this.hBox = oEvent.getSource().getParent().getParent();
			this.noVBoxes = this.hBox.getItems().length;
			this.editIndex = this.vBox.indexOfItem(sap.ui.getCore().byId(oEvent.getSource().getId()));
			for (var i = 0; i < this.noVBoxes; i++) {
				var itemVB = this.hBox.getItems()[i];
				var editItem = itemVB.getItems()[this.editIndex];
				if (i !== this.noVBoxes - 1) {
					var editItemValue = editItem.getText();
					editItem.destroy();
					var itemInput = new sap.m.Input({
						width: "75%",
						value: editItemValue
					});
					itemVB.insertItem(itemInput, this.editIndex);
				} else {
					editItem.destroy();
					var saveInput = new sap.m.Button({
						icon: "sap-icon://accept",
						type: "Transparent",
						press: function(oEvent) {
							for (var i = 0; i < that.noVBoxes; i++) {
								var itemVB = that.hBox.getItems()[i];
								var editItem = itemVB.getItems()[that.editIndex];
								if (i !== that.noVBoxes - 1) {
									var editItemValue = editItem.getValue();
									editItem.destroy();
									var itemInput = new sap.m.Label({
										width: "75%",
										text: editItemValue
									});
									itemVB.insertItem(itemInput, that.editIndex);
								}
								else
								{
									var editInput = new sap.ui.core.Icon({
									src: "sap-icon://edit"});
									editItem.destroy();
									itemVB.insertItem(editInput, that.editIndex);
								}
							}

						}
					});
						itemVB.insertItem(saveInput, that.editIndex);

				}

			}
		},

		onSavePress: function(oEvent) {
			sap.m.MessageToast.show("onSavePress");
		},

		// onNext:function(){
		// 	this.getRouter().navTo("devices");
		// },

		onNext: function() {
			
			if (this.byId("projectName").getValue() === "") {
				sap.m.MessageToast.show("Please Enter the Project Name");
			} else {
				var that = this;
				var oHL = new sap.m.HBox({
					width: "100%"
				});

				var text = new sap.m.Text({
					text: " Do You Want to Confirm your Crew members ?"
				});
				oHL.addItem(text);

				var yesButton = new sap.m.Button({

					text: "Yes",
					press: function(oEvent) {
						that.oDialog.close();
						that.oDialog.destroyContent();
						that.oDialog.destroyButtons();
						that.oDialog.destroy();
						that.formTeamData();
						that.getRouter().navTo("devices");
					}

				});
				var noButton = new sap.m.Button({

					text: "No",
					press: function(oEvent) {
						that.oDialog.close();
						that.oDialog.destroyContent();
						that.oDialog.destroyButtons();
						that.oDialog.destroy();

					}
				});

				this.oDialog = new sap.m.Dialog({

					title: "Confirm",
					modal: true,
					contentWidth: "1em",
					buttons: [yesButton, noButton],
					content: [oHL]
				});

				this.oDialog.open();
			}
		},
		
		formTeamData: function()
		{	
			var projectName = this.getView().byId("projectName").getValue();
			var nameVB = this.getView().byId("nameVB");
			var iNoVB = this.getView().byId("iNoVB");
			var genderVB = this.getView().byId("genderVB");			//
			var shirtSizeVB = this.getView().byId("shirtSizeVB");		//
			var addressVB = this.getView().byId("addressVB");			//spell check
			var mobileNoVB = this.getView().byId("mobileNoVB");
			var transportVB = this.getView().byId("transportVB");
			
			var teamData = sap.ui.getCore().getModel("teamData");
			var noOfMembers = nameVB.getItems().length-1;

			teamData.PROJECT_TITLE = projectName;
			for(var i=1; i<noOfMembers; i++)
			{	
				teamData.FIRSTNAME[i] = nameVB.getItems()[i].getText();
				teamData.LASTNAME[i] = nameVB.getItems()[i].getText();
				teamData.EMPLOYEE_TYPE[i] = "Team Member";
			}
			for(var i=1; i<noOfMembers; i++)
			{	
				teamData.EMPLOYEEID[i] = iNoVB.getItems()[i].getText();
			}
			for(var i=1; i<noOfMembers; i++)
			{	
				teamData.RESIDENTIAL_ADDRESS[i] = addressVB.getItems()[i].getText();
			}
			for(var i=1; i<noOfMembers; i++)
			{	
				teamData.MOBILE_NUMBER[i] = mobileNoVB.getItems()[i].getText();
			}
			for(var i=1; i<noOfMembers; i++)
			{	
				teamData.TSHIRT_SIZE[i] = shirtSizeVB.getItems()[i].getText();
			}
			for(var i=1; i<noOfMembers; i++)
			{	
				teamData.GENDER[i] = genderVB.getItems()[i].getText();
			}
			for(var i=1; i<noOfMembers; i++)
			{	
				if(transportVB.getItems()[i].getText()==="Yes")
				{
					teamData.TRANSPORT_REQUIREMENT[i] = "1";
				}
				else
				{
					teamData.TRANSPORT_REQUIREMENT[i] = "0";
				}
			}

			
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		/**
		 * Event handler  for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("Alphabetical_list_of_products", {
					CategoryName: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.CategoryName,
				sObjectName = oObject.CategoryID;

			// Everything went fine.
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		}

	});

});