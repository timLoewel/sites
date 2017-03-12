/**
 * Created by tim on 25/11/16.
 */
import I18n from 'react-native-i18n'

import ReactNativeI18n from 'react-native-i18n'

const deviceLocale = ReactNativeI18n.locale
I18n.fallbacks = true
I18n.defaultLocale = "en";
I18n.translations = {
	en: {
		profile: {
			title: 'Profile',
			name: 'Name',
			userNameValidationErrorMissing: 'Please provide a name, so that your photos can be attributed.',
			userNameValidationErrorShort: 'Name is too short. Please provide at least two names. (e.g. John Doe)',
			email: 'Email'
		},
		tasks: {
			title: 'Chats',
			filterSelectAll: 'All Sites',
			noTasks: 'No Tasks yet.. Start by taking a photo.',
		},
		allSites: {
			siteNameValidationErrorMissing: 'Site name is too short.',
			noSiteFound: 'No Site found.'
		},
		newPhoto: {
			pleaseAddInformation: 'Please add photo context information',
			createdAt: 'Created at ',
			createdBy: ' by ',
			creatorPlaceholder: 'please enter your name',
			siteName: 'Site',
			noSiteFound: 'Was this photo taken on a site? Please add.',
			newSite: 'Create a NEW site',
			noSite: 'NO site',
			tags: 'Tags',
			description: 'Description',
			descriptionPlaceholder:'What is this photo about?',
		},
		MessagesView: {
			title: 'Album',
		},
		SiteEditorView: {
			description: 'Description',
			siteCreatedByOn: 'Site was created by {{creatorName}} on {{creationDate}}.',
			developer: 'Developer',
			siteManager: 'Site Manager',
			clickToAddPhoto: 'Change Cover Photo',
			location: 'Location',
			chooseSiteImageTitle: 'Image Source:',
			chooseFromLibraryButtonTitle: 'Gallery',
			takePhotoButtonTitle: 'Camera',
			cancelButtonTitle: 'Cancel',
		},

	},
	de: {
		profile: {
			title: 'Profil',
			name: 'Name',
			userNameValidationErrorMissing: 'Bitte gib deinen Namen an, damit die Fotos zugeordnet werden können.',
			userNameValidationErrorShort: 'Der Name ist zu kurz. Bitte gib Vor- und Nachname ein. (z.B. Hans Müller)',
			email: 'Email'
		},
		tasks: {
			title: 'Chats',
			filterSelectAll: 'Alle Orte',
			noTasks: 'Es gibt noch keine Aufgaben. Starte mit einem Foto.',
		},
		allSites: {
			siteNameValidationErrorMissing: 'Bitte wähle einen eindeutigen Namen für die Baustelle.',
			noSiteFound: 'Keine Baustelle gefunden.',
		},
		newPhoto: {
			pleaseAddInformation: 'Bitte füge Bildinformationen zu',
			createdAt: 'Aufgenommen am',
			creatorName: 'Fotograph',
			siteName: 'Baustelle',
			newSite: 'NEUE Baustelle erstellen',
			noSite: 'OHNE Baustelle',
			noSiteFound: 'Ist dieses Foto auf einer Baustelle? Bitte zufügen.',
			tags: 'Tags',
			description: 'Beschreibung',
			descriptionPlaceholder:'Was zeigt dieses Foto?',
		},
		SiteEditorView: {
			description: 'Beschreibung',
			developer: 'Bauherr',
			siteManager: 'Bauleiter',
			siteCreatedByOn: 'Baustelle wurde von {{creatorName}} am {{creationDate}} erstellt.',
			clickToAddPhoto: 'Bild ändern',
			location: 'Ort',
			chooseSiteImageTitle: 'Quelle für Bild:',
			chooseFromLibraryButtonTitle: 'Gallerie',
			takePhotoButtonTitle: 'Kamera',
			cancelButtonTitle: 'Abbrechen',

		},
		MessagesView: {
			title: 'Aufgabe',
		}
	},
}

export default I18n;