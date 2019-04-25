sap.ui.define([
		"ui/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ui.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);