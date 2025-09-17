
#if NET9_0
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;

namespace Our.Umbraco.SimpleTreeMenu
{

	[DataEditor("SimpleTreeMenu",
	ValueType = ValueTypes.Json,
	ValueEditorIsReusable = true)]
	public class SimpleTreeMenuPropertyEditor : DataEditor
	{
		private readonly IIOHelper _ioHelper;
		private readonly IConfigurationEditorJsonSerializer _configurationEditorJsonSerializer;

		/// <summary>
		///     The constructor will setup the property editor based on the attribute if one is found
		/// </summary>
		public SimpleTreeMenuPropertyEditor(IDataValueEditorFactory dataValueEditorFactory, IIOHelper ioHelper, IConfigurationEditorJsonSerializer configurationEditorJsonSerializer)
			: base(dataValueEditorFactory)
		{
			_ioHelper = ioHelper;
			_configurationEditorJsonSerializer = configurationEditorJsonSerializer;
		}

		/// <summary>
		///     Return a custom pre-value editor
		/// </summary>
		/// <returns></returns>
		protected override IConfigurationEditor CreateConfigurationEditor() =>
			new ValueListConfigurationEditor(_ioHelper, _configurationEditorJsonSerializer);
	}
}
#endif