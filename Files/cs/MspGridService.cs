using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using Terrasoft.Web.Common;

namespace Terrasoft.Configuration
{

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class MspGridService : BaseService
	{

		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
		public MspProfileData GetCustomProfiles(string key)
		{
			MspGridHelper helper = new MspGridHelper(UserConnection);
			return helper.GetCustomProfiles(key);
		}

		[OperationContract]
		[WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
		public void SaveCustomProfiles(MspProfileData profileData)
		{
			MspGridHelper helper = new MspGridHelper(UserConnection);
			helper.SaveCustomProfiles(profileData);
		}

	}
	
}
