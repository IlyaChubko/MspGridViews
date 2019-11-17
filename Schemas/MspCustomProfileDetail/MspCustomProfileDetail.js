define("MspCustomProfileDetail", ["ConfigurationEnums"], function(ConfigurationEnums) {
	return {
		entitySchemaName: "MspCustomProfile",
		attributes: {
			"ProfileSchema": {
				dataValueType: Terrasoft.DataValueType.CUSTOM_OBJECT,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			}
		},
		messages: {
			"GetGridSettingsInfo": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
			},
			"GridSettingsChanged": {
				mode: this.Terrasoft.MessageMode.PTP,
				direction: this.Terrasoft.MessageDirectionType.SUBSCRIBE
			}
		},
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/,
		methods: {

			getSwitchGridModeMenuItem: this.Terrasoft.emptyFn,

			getCustomProfileKey: function() {
				return "MspCustomProfile_" + this.$ActiveRow;
			},

			openCustomGrid: function() {
				const columnValues = this.sandbox.publish("GetColumnsValues", ["MspSchemaName"], [this.sandbox.id]);
				if (columnValues && columnValues.MspSchemaName) {
					this.getEntitySchemaByName(columnValues.MspSchemaName, function(entitySchema) {
						this.$ProfileSchema = entitySchema;
						this.openCustomGridSettings();
					}, this);
				}
			},

			addRecord: function(editPageUId) {
				this.openCustomGrid();
			},

			editRecord: function(record) {
				this.openCustomGrid();
			},

			copyRecord: function() {
				debugger;
			},

			getCustomGridSettingsInfo: function() {
				const entitySchema = this.$ProfileSchema;
				var moduleName = this.sandbox.moduleName;
				var workAreaMode = this.getHistoryStateInfo().workAreaMode;
				var isEditable = this.getIsEditable();
				//var entitySchema = this.getGridEntitySchema();
				var isSingleTypeMode =
					((moduleName !== "DetailModuleV2" && workAreaMode === ConfigurationEnums.WorkAreaMode.COMBINED) ||
						isEditable);
				return {
					baseGridType: isEditable ? this.Terrasoft.GridType.LISTED : this.Terrasoft.GridType.TILED,
					isSingleTypeMode: isSingleTypeMode,
					entitySchemaName: entitySchema.name,
					entitySchema: entitySchema,
					profileKey: this.getCustomProfileKey(),
					propertyName: this.getDataGridName(),
					notFoundColumns: this.notFoundColumns,
					entityColumns: entitySchema.columns
				};
			},

			getGridSettingsModuleConfig: function(gridSettingsId) {
				return {
					renderTo: "centerPanel",
					id: gridSettingsId,
					keepAlive: true,
					instanceConfig: {
						schemaName: "MspGridSettingsPage",
						isSchemaConfigInitialized: true
					}
				};
			},

			openCustomGridSettings: function(schemaName) {
				var gridSettingsId = this.sandbox.id + "_CardModuleV2_MspGridSettingsPage";
				this.sandbox.subscribe("GetGridSettingsInfo", this.getCustomGridSettingsInfo, this, [gridSettingsId]);
				var params = this.sandbox.publish("GetHistoryState");
				this.sandbox.publish("PushHistoryState", {
					hash: params.hash.historyState,
					silent: true
				});
				this.sandbox.loadModule("CardModuleV2", this.getGridSettingsModuleConfig(gridSettingsId));
				this.sandbox.subscribe("GridSettingsChanged", function(args) {
					// var gridData = this.getGridData();
					// gridData.clear();
					// if (args && args.newProfileData) {
					// 	this.setColumnsProfile(args.newProfileData, true);
					// }
					// this.set("GridSettingsChanged", true);
					// this.initSortActionItems();
				}, this, [gridSettingsId]);
			}

		}
	};
});
