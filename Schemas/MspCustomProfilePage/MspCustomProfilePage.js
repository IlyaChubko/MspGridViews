define("MspCustomProfilePage", [], function() {
	return {
		entitySchemaName: "MspCustomProfile",
		attributes: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
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
				"name": "MspContactd5dec058-0ad9-42c5-8706-3461cd82ccca",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "MspContact"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "MspCulturee508d37d-f35d-4ee2-b1d0-e230b9a9f50b",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "MspCulture"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
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
