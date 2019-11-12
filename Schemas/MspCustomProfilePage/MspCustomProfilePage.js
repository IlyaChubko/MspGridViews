define("MspCustomProfilePage", ["ConfigurationEnums", "GridUtilitiesV2"], function(ConfigurationEnums) {
	return {
		entitySchemaName: "MspCustomProfile",
		attributes: {
			"MspProfileData": {
				dataValueType: this.Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					columns: ["MspName", "MspSchemaName"]
				}
			},
			"ProfileSchema": {
				dataValueType: Terrasoft.DataValueType.CUSTOM_OBJECT,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			}
		},
		mixins: {
			GridUtilities: "Terrasoft.GridUtilities"
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
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {

			getMspProfileData: function() {
				var profileData = this.$MspProfileData;
				if (profileData && profileData.value) {
					var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "MspProfileData"
					});
					esq.addColumn("MspSchemaName");
					esq.getEntity(profileData.value, function (result) {
						if (result.success) {
							var profileSchemaName = result.entity.$MspSchemaName;
							this.getEntitySchemaByName(profileSchemaName, function(entitySchema) {
								this.$ProfileSchema = entitySchema;
							}, this);
						}
					}, this);
				}
			},

			onEntityInitialized: function() {
				this.callParent(arguments);
				this.getMspProfileData();
			},

			getProfileKey: function() {
				return this.name + this.$Id;
			},

			getGridSettingsInfo: function() {
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
					profileKey: this.getProfileKey(),
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

			openGridSettings: function() {
				var gridSettingsId = this.sandbox.id + "_CardModuleV2_GridSettingsPage";
				this.sandbox.subscribe("GetGridSettingsInfo", this.getGridSettingsInfo, this, [gridSettingsId]);
				var params = this.sandbox.publish("GetHistoryState");
				this.sandbox.publish("PushHistoryState", {
					hash: params.hash.historyState,
					silent: true
				});
				this.sandbox.loadModule("CardModuleV2", this.getGridSettingsModuleConfig(gridSettingsId));
				this.sandbox.subscribe("GridSettingsChanged", function(args) {
					var gridData = this.getGridData();
					gridData.clear();
					if (args && args.newProfileData) {
						this.setColumnsProfile(args.newProfileData, true);
					}
					this.set("GridSettingsChanged", true);
					this.initSortActionItems();
				}, this, [gridSettingsId]);
			},

			onChangeProfileButtonClick: function() {
				var config = {
					isSilent: true,
					callback: this.openGridSettings.bind(this),
					callBaseSilentSavedActions: true,
					scope: this
				};
				this.save(config);
			}

		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "ChangeProfileButton",
				"values": {
					"itemType": 5,
					"style": "green",
					"caption": "Изменить колонки",
					"classes": {
						"textClass": "actions-button-margin-right"
					},
					"click": {
						"bindTo": "onChangeProfileButtonClick"
					}
				},
				"parentName": "LeftContainer",
				"propertyName": "items",
				"index": 6
			},
			{
				"operation": "insert",
				"name": "MspNamed90e6a78-3163-4c22-aae5-0016e5463379",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "MspName",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Tabcd5bb956TabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tabcd5bb956TabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Tabcd5bb956TabLabelGroupaf621771",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tabcd5bb956TabLabelGroupaf621771GroupCaption"
					},
					"itemType": 15,
					"markerValue": "added-group",
					"items": []
				},
				"parentName": "Tabcd5bb956TabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Tabcd5bb956TabLabelGridLayoute62825af",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "Tabcd5bb956TabLabelGroupaf621771",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "MspDynamic76aaad2b-d563-40cb-aea0-62d781b723cd",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Tabcd5bb956TabLabelGridLayoute62825af"
					},
					"bindTo": "MspDynamic"
				},
				"parentName": "Tabcd5bb956TabLabelGridLayoute62825af",
				"propertyName": "items",
				"index": 0
			}
		]/**SCHEMA_DIFF*/
	};
});
