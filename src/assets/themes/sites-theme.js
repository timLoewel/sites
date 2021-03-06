import Color from 'color';
import {Platform, PixelRatio} from 'react-native';
import getDimensions from '../../utils/dimensions';

const {width: deviceWidth, height: deviceHeight} = getDimensions();

const platform = Platform.OS;
const platformStyle = undefined;

export default {

	platformStyle,
	platform,
	// AndroidRipple
	androidRipple: true,
	androidRippleColor: 'rgba(256, 256, 256, 0.3)',
	androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',

	// Badge
	badgeBg: '#ED1727',
	badgeColor: '#fff',

	// New Variable
	badgePadding: (platform === 'ios') ? 3 : 0,

	defaultMargin: 5,
	// Button
	btnFontFamily: (platform === 'ios') ? 'System' : 'Roboto_medium',
	btnDisabledBg: '#b5b5b5',
	btnDisabledClr: '#f1f1f1',
	btnHeight: 55,
	// CheckBox
	CheckboxRadius: (platform === 'ios') ? 13 : 0,
	CheckboxBorderWidth: (platform === 'ios') ? 1 : 2,
	CheckboxPaddingLeft: (platform === 'ios') ? 4 : 2,
	CheckboxPaddingBottom: (platform === 'ios') ? 0 : 5,
	CheckboxIconSize: (platform === 'ios') ? 21 : 14,
	CheckboxIconMarginTop: (platform === 'ios') ? undefined : 1,
	CheckboxFontSize: (platform === 'ios') ? (23 / 0.9) : 18,
	DefaultFontSize: 17,

	// New Variable
	get defaultTextColor() {
		return this.textColor;
	},

	get btnPrimaryBg() {
		return this.brandPrimary;
	},
	get btnPrimaryColor() {
		return this.inverseTextColor;
	},
	get btnInfoBg() {
		return this.brandInfo;
	},
	get btnInfoColor() {
		return this.inverseTextColor;
	},
	get btnSuccessBg() {
		return this.brandSuccess;
	},
	get btnSuccessColor() {
		return this.inverseTextColor;
	},
	get btnDangerBg() {
		return this.brandDanger;
	},
	get btnDangerColor() {
		return this.inverseTextColor;
	},
	get btnWarningBg() {
		return this.brandWarning;
	},
	get btnWarningColor() {
		return this.inverseTextColor;
	},
	get btnTextSize() {
		return (platform === 'ios') ? this.fontSizeBase * 1.1 :
		this.fontSizeBase - 1;
	},
	get btnTextSizeLarge() {
		return this.fontSizeBase * 1.5;
	},
	get btnTextSizeSmall() {
		return this.fontSizeBase * 0.8;
	},
	get borderRadiusLarge() {
		return this.fontSizeBase * 3.8;
	},

	buttonPadding: 6,

	get iconSizeLarge() {
		return this.iconFontSize * 1.5;
	},
	get iconSizeSmall() {
		return this.iconFontSize * 0.6;
	},


	// Card
	cardDefaultBg: '#fff',


	// Check Box
	checkboxBgColor: '#039BE5',
	checkboxSize: 23,
	checkboxTickColor: '#fff',


	// Color
	brandPrimary: '#FDBE00',
	brandPrimaryTransparent: '#FDC600f0',
	brandSecondary: '#FDDB63',
	brandSecondaryTransparent: '#FDDB63Af',
	brandInfo: '#5bc0de',
	brandSuccess: '#5cb85c',
	brandDanger: '#d9534f',
	brandWarning: '#f0ad4e',
	brandSidebar: '#252932',


	// Font
	fontFamily: (platform === 'ios') ? 'System' : 'Roboto',
	fontSizeBase: 15,

	get fontSizeSmall() {
		return this.fontSizeBase * 0.75;
	},

	get fontSizeH1() {
		return this.fontSizeBase * 1.8;
	},
	get fontSizeH2() {
		return this.fontSizeBase * 1.6;
	},
	get fontSizeH3() {
		return this.fontSizeBase * 1.4;
	},

	// Footer
	footerHeight: 55,
	footerDefaultBg: '#4179F7',


	// FooterTab
	tabBarTextColor: '#8bb3f4',
	tabBarTextSize: (platform === 'ios') ? 14 : 11,
	activeTab: (platform === 'ios') ? '#007aff' : '#fff',
	sTabBarActiveTextColor: '#007aff',
	tabBarActiveTextColor: '#fff',
	tabActiveBgColor: (platform === 'ios') ? '#1569f4' : undefined,

	// Tab
	tabDefaultBg: '#2874F0',
	topTabBarTextColor: '#b3c7f9',
	topTabBarActiveTextColor: '#fff',
	topTabActiveBgColor: (platform === 'ios') ? '#1569f4' : undefined,
	topTabBarBorderColor: '#fff',
	topTabBarActiveBorderColor: '#fff',


	// Header
	toolbarBtnColor: '#fff',
	toolbarDefaultBg: '#2874F0',
	toolbarHeight: (platform === 'ios') ? 64 : 56,
	toolbarIconSize: (platform === 'ios') ? 20 : 22,
	toolbarSearchIconSize: (platform === 'ios') ? 20 : 23,
	toolbarInputColor: (platform === 'ios') ? '#CECDD2' : '#fff',
	searchBarHeight: (platform === 'ios') ? 30 : 40,
	toolbarInverseBg: '#222',
	toolbarTextColor: '#fff',
	iosStatusbar: 'light-content',
	toolbarDefaultBorder: '#2874F0',
	get statusBarColor() {
		return Color(this.toolbarDefaultBg).darken(0.2).string();
	},


	// Icon
	iconFamily: 'FontAwesome',
	iconFontSize: (platform === 'ios') ? 30 : 28,
	iconMargin: 7,
	iconHeaderSize: (platform === 'ios') ? 33 : 28,


	// InputGroup
	inputFontSize: 17,
	inputBorderColor: '#D9D5DC',
	inputSuccessBorderColor: '#2b8339',
	inputErrorBorderColor: '#ed2f2f',

	get inputColor() {
		return this.textColor;
	},
	get inputColorPlaceholder() {
		return '#575757';
	},
	get inputBGColor() {
		return this.backgroundColor;
	},
	get inputBGColorFocused() {
		return Color(this.backgroundColor).lighten(0.2).string();
	},

	inputGroupMarginBottom: 10,
	inputHeightBase: 40,
	inputPaddingLeft: 5,
	inputHeightSmall: 30,
	get inputPaddingLeftIcon() {
		return this.inputPaddingLeft * 8;
	},


	// Line Height
	btnLineHeight: 19,
	lineHeightH1: 32,
	lineHeightH2: 27,
	lineHeightH3: 22,
	iconLineHeight: (platform === 'ios') ? 37 : 30,
	lineHeight: (platform === 'ios') ? 20 : 24,


	// List
	listBorderColor: '#ACAAAB',
	listDividerBg: '#ddd',
	listItemHeight: 45,

	listNoteColor: '#808080',
	listNoteSize: 13,


	// Changed Variable
	listItemPadding: (platform === 'ios') ? 10 : 12,

	// Card
	cardBorderColor: '#ccc',

	// Progress Bar
	defaultProgressColor: '#E4202D',
	inverseProgressColor: '#1A191B',


	// Radio Button
	radioBtnSize: (platform === 'ios') ? 25 : 23,
	radioSelectedColorAndroid: '#5067FF',

	// New Variable
	radioBtnLineHeight: (platform === 'ios') ? 29 : 24,
	radioColor: '#7e7e7e',

	get radioSelectedColor() {
		return Color(this.radioColor).darken(0.2).string();
	},


	// Spinner
	defaultSpinnerColor: '#45D56E',
	inverseSpinnerColor: '#1A191B',


	// Tabs
	tabBgColor: '#F8F8F8',
	tabFontSize: 15,
	tabTextColor: '#fff',


	// Text
	textColor: '#000',
	inverseTextColor: '#fff',
	noteFontSize: 14,


	// Title
	titleFontfamily: (platform === 'ios') ? 'System' : 'Roboto_medium',
	titleFontSize: (platform === 'ios') ? 17 : 19,
	subTitleFontSize: (platform === 'ios') ? 12 : 14,
	subtitleColor: '#8e8e93',

	// New Variable
	titleFontColor: '#FFF',


	// Other
	borderRadiusBase: (platform === 'ios') ? 5 : 2,
	borderWidth: (1 / PixelRatio.getPixelSizeForLayoutSize(1)),
	contentPadding: 10,

	get darkenHeader() {
		return Color(this.tabBgColor).darken(0.03).string();
	},

	dropdownBg: '#000',
	dropdownLinkColor: '#414142',
	inputLineHeight: 24,
	jumbotronBg: '#C9C9CE',
	jumbotronPadding: 30,
	deviceWidth,
	deviceHeight,


	backgroundColor: '#E9E9EF',
	inputGroupRoundedBorderRadius: 30,

};
