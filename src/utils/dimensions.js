import ExtraDimensions from 'react-native-extra-dimensions-android';
import { Dimensions, Platform} from 'react-native';


export default get = () => {
	var {width, height} = Dimensions.get('window');
	if (Platform.OS === 'android') {
		const windowHeight = ExtraDimensions.get('REAL_WINDOW_HEIGHT');
		const statusBarHeight = ExtraDimensions.get('STATUS_BAR_HEIGHT');
		const softMenuHeight = ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT');
		height = windowHeight - (statusBarHeight + softMenuHeight);
	}
	return {width: width, height: height};
}