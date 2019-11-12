define("BaseGridDetailV2", [], function () {
	return {
		mixins: {},
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		attributes: {

			"MspProfileDataId": {
			    dataValueType: Terrasoft.DataValueType.TEXT,
			    type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},

			"SavedGridProfile": {
			    dataValueType: Terrasoft.DataValueType.COLLECTION,
			    type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			},

			"ProfileCollection": {
				dataValueType: Terrasoft.DataValueType.CUSTOM_OBJECT,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN
			}

		},
		messages: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		diff: /**SCHEMA_DIFF*/[], /**SCHEMA_DIFF*/
		methods: {

			init: function(callback, scope) {
				window.cts = this;
				//this.$ProfileCollection = [];
				const parentMethod = this.getParentMethod();
				var parentArguments = arguments;
				this.getCustomProfileRecord(function(){
					parentMethod.call(this, callback, scope);
				}, this);
			},

			initSortActionItems: function() {
				this.callParent(arguments);
				this.initSavedProfileItems();
			},

			getCustomProfileRecord: function(callback, scope) {
				var profile = this.$Profile;
				if (profile && profile.key) {
					var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
						rootSchemaName: "MspCustomProfile"
					});
					esq.addColumn("MspName");
					esq.addColumn("MspProfileData.Id");
					esq.filters.addItem(this.Terrasoft.createColumnFilterWithParameter(
					    this.Terrasoft.ComparisonType.EQUAL,
					    "MspProfileData.MspName", profile.key));
					esq.getEntityCollection(function (result) {
						if (result.success && result.collection.getCount() > 0) {
							var entities = result.collection.getItems();
							this.$MspProfileDataId = entities[0].values["MspProfileData.Id"];
							this.$ProfileCollection = [];
							Terrasoft.each(entities, function(item) {
								var config = {
									caption: item.$MspName,
									tag: item.$Id
								};
								this.$ProfileCollection.push(config);
							}, this);
						}
						if (callback) callback.call(scope);
					}, this);
				}
			},

			_initSavedProfile: function() {
				var savedProfile = this.get("SavedGridProfile");
				if (!savedProfile) {
					this.set("SavedGridProfile", Ext.create("Terrasoft.BaseViewModelCollection"));
				}
			},

			switchProfileButtonConfig: function(config) {
				return {
					Caption: config.caption,
					Tag: config.tag,
					Click: {bindTo: "switchProfileData"}
				};
			},

			initSavedProfileItems: function() {
				this._initSavedProfile();
				var savedProfile = this.get("SavedGridProfile");
				savedProfile.clear();
				Terrasoft.each(this.$ProfileCollection, function(profile) {
					savedProfile.addItem(this.getButtonMenuItem(this.switchProfileButtonConfig(profile)));
				}, this);
			},

			getCustomProfileMenuItem: function() {
				return this.getButtonMenuItem({
					Caption: {"bindTo": "Resources.Strings.SetupProGridMenuCaption"},
					Click: {"bindTo": "onCustomGridSettingsClick"},
					"ImageConfig": this.get("Resources.Images.GridSettingsProIcon")
				});
			},

			getSwitchProfileMenuItem: function() {
				return this.getButtonMenuItem({
					Caption: {"bindTo": "Resources.Strings.SwitchProGridMenuCaption"},
					Items: this.get("SavedGridProfile"),
					"ImageConfig": this.get("Resources.Images.SwitchGridSettingsProIcon"),
					Visible: {
					    bindTo: "ProfileCollection",
					    bindConfig: {
					        converter: function(value) {
					            return this.$ProfileCollection && this.$ProfileCollection.length > 0;
					        }
					    }
					}
				});
			},

			addGridOperationsMenuItems: function(toolsButtonMenu) {
				this.callParent(arguments);
				toolsButtonMenu.addItem(this.getButtonMenuSeparator());
				toolsButtonMenu.addItem(this.getSwitchProfileMenuItem());
				toolsButtonMenu.addItem(this.getCustomProfileMenuItem());
			},

			getNewProfileData: function(profileKey, callback, scope) {
				this.Terrasoft.require(["profile!" + "MspCustomProfile_" + profileKey], callback, scope);
			},

			_clearProfileCache: function(profileKey) {
				var cache = Terrasoft.ClientPageSessionCache;
				if (cache) {
					var cacheKeys = Terrasoft.keys(cache.storage);
					Terrasoft.each(cacheKeys, function(key) {
						if (key.indexOf(profileKey) !== -1) {
							cache.removeItem(key);
						}
					});
				}
			},

			switchProfileData: function(tag) {
				this.getNewProfileData(tag, function(profile) {
					if (profile) {
						profile.key = this.$Profile.key;
						profile.DataGrid.key = this.$Profile.key;
						this._clearProfileCache(this.$Profile.key);
						Terrasoft.utils.saveUserProfile(this.$Profile.key, profile, false);
						this.set("Profile", profile);
						var gridData = this.getGridData();
						gridData.clear();
						if (profile) {
							this.setColumnsProfile(profile, true);
						}
						this.set("GridSettingsChanged", true);
						//this.initSortActionItems();
						this.reloadGridData();
					}
				}, this);
			},

			getCustomGridSettingsValues: function() {
				var profile = this.$Profile;
				var defaultValues = [{
					name: ["MspSchemaName"],
					value: [this.entitySchemaName]
				}];
				if (profile) {
					defaultValues.push({
						name: ["MspName"],
						value: [profile.key]
					});
				}
				return defaultValues;
			},

			onCustomGridSettingsClick: function() {
				var config = {
					"schemaName": "MspProfileDataPage",
					"operation": (this.$MspProfileDataId) ?
						this.Terrasoft.ConfigurationEnums.CardOperation.EDIT :
						this.Terrasoft.ConfigurationEnums.CardOperation.ADD,
					"moduleId": this.sandbox.id + "MspProfileDataPage",
					"renderTo": "centerPanel"
				};
				if (this.$MspProfileDataId) {
					config.id = this.$MspProfileDataId;
				}
				else {
					config.defaultValues = this.getCustomGridSettingsValues();
				}
				this.openCardInChain(config);
			}



		},
		rules: {}
	};
});