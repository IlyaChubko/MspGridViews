using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using Terrasoft.Core;
using Terrasoft.Core.Entities;

namespace Terrasoft.Configuration
{
	public class MspGridHelper
	{
		private readonly UserConnection _userConnection;

		public MspGridHelper(UserConnection userConnection)
		{
			_userConnection = userConnection;
		}

		private string ParseListedProfile(string profileValue)
		{
			List<string> list = new List<string>();
			MspProfileSettings settings = JsonConvert.DeserializeObject<MspProfileSettings>(profileValue);
			foreach (var item in settings.Items)
			{
				list.Add(item.Caption);
			}
			return String.Join(";", list);
		}

		private string ParseTiledProfile(string profileValue)
		{
			throw new NotImplementedException();
		}


		public MspProfileData GetCustomProfiles(string key)
		{
			MspProfileData profileData = new MspProfileData() { ProfileItems = new List<MspProfileItem>() } ;
			EntitySchema schema = _userConnection.EntitySchemaManager.GetInstanceByName("MspCustomProfile");
			EntitySchemaQuery esq = new EntitySchemaQuery(schema);
			esq.PrimaryQueryColumn.IsAlwaysSelect = true;
			esq.IgnoreDisplayValues = true;
			var nameColumn = esq.AddColumn("MspName");
			var profileIdColumn = esq.AddColumn("MspProfileData.Id");
			esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "MspProfileData.MspName", key));
			esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "MspIsActive", true));
			esq.Filters.Add(esq.CreateIsNotNullFilter("MspValue"));
			EntityCollection entityCollection = esq.GetEntityCollection(_userConnection);
			if (entityCollection.Count > 0) profileData.ProfileId = entityCollection[0].GetTypedColumnValue<Guid>(profileIdColumn.Name);
			foreach (Entity entity in entityCollection)
			{
				profileData.ProfileItems.Add(new MspProfileItem() {
					Caption = entity.GetTypedColumnValue<string>(nameColumn.Name),
					Tag = entity.PrimaryColumnValue
				});
			}
			return profileData;
		}

		public void SaveCustomProfiles(MspProfileData profileData)
		{
			string profileValue = (profileData.IsTiled) ? ParseTiledProfile(profileData.ProfileValue) : ParseListedProfile(profileData.ProfileValue);
			EntitySchema contactEmailSchema = _userConnection.EntitySchemaManager.GetInstanceByName("MspCustomProfile");
			var entity = contactEmailSchema.CreateEntity(_userConnection);
			entity.FetchFromDB(profileData.ProfileSettingsId);
			entity.SetColumnValue("MspIsTiled", profileData.IsTiled);
			entity.SetColumnValue("MspValue", profileValue);
			entity.Save(false);
		}

	}
}
