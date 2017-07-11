/**
 * Created by tim on 25/11/16.
 */
import I18n from "react-native-i18n";

import ReactNativeI18n from "react-native-i18n";

const deviceLocale = ReactNativeI18n.locale;
I18n.fallbacks = true;
I18n.defaultLocale = "en";
I18n.translations = {
  en: {
    profile: {
      title: "Profile",
      firstNameTitle: "First Name",
      firstNamePlaceholder: "John",
      lastNameTitle: "Last Name",
      lastNamePlaceholder: "Smith",
      userNameValidationErrorMissing:
        "Please provide a name, so that your photos can be attributed.",
      userNameValidationErrorShort:
        "Name is too short. Please provide at least two names. (e.g. John Doe)",
      emailTitle: "Email",
      emailPlaceholder: "john@smith.com",
      phoneTitle: "Phone",
      phonePlaceholder: "+49 89 32 16 8",
      companyTitle: "Company",
      companyName: "Name",
      saveButtonTitle: "Update Profile",
      cancelButtonTitle: "Discard Changes"
    },
    share: {
      subject: "%{shareableUri}",
      message: "Find Photo at %{shareableUri}"
    },
    tasks: {
      title: "Chats",
      filterSelectAll: "All Sites",
      noTasks: "No Tasks yet.. Start by taking a photo."
    },
    allSites: {
      siteNameValidationErrorMissing: "Site name is too short.",
      noSiteFound: "No Site found."
    },
    camera: {
      thisIsAppendedToPhoto:
        "Information you enter here is appended to your photo.",
      descriptionTitle: "Description",
      descriptionPlaceholder: "Description",
      sitePlaceholder: "Please select a site",
      messagePhotoTaken: "Photo saved",
      photoCouldNotBeTaken: "Error taking Photo.",
      locationUnknown: "Location unknown",
      onSiteLocation: "on-site location",
      noSite: "No Site selected"
    },
    newPhoto: {
      pleaseAddInformation: "Please add photo context information",
      createdAt: "Created at ",
      createdBy: " by ",
      creatorPlaceholder: "please enter your name",
      siteName: "Site",
      noSiteFound: "Was this photo taken on a site? Please add.",
      newSite: "Create a NEW site",
      noSite: "NO site",
      tags: "Tags",
      description: "Description",
      descriptionPlaceholder: "What is this photo about?"
    },
    selectSite: {
      title: "Select Site",
      noSite: "No Site",
      createNew: "Create new Site"
    },
    renderImage: {
      gpsLocationUnknown: "GPS Location unknown",
      addressUnknown: "Address unknown.",
      site: "Site: {{siteName}}"
    },
    MessagesView: {
      title: "Album"
    },
    SiteEditorView: {
      description: "Description",
      siteCreatedByOn: "Site was created by {{creatorName}} on {{createdAt}}.",
      developer: "Developer",
      siteManager: "Site Manager",
      clickToAddPhoto: "Change Cover Photo",
      location: "Location",
      chooseSiteImageTitle: "Image Source:",
      chooseFromLibraryButtonTitle: "Gallery",
      takePhotoButtonTitle: "Camera",
      cancelButtonTitle: "Cancel"
    }
  },
  de: {
    profile: {
      title: "Profil",
      firstNameTitle: "Vorname",
      firstNamePlaceholder: "Hans",
      lastNameTitle: "Nachname",
      lastNamePlaceholder: "Schmidt",
      emailTitle: "Email",
      emailPlaceholder: "Hans@Schmidt.de",
      phoneTitle: "Telefon",
      phonePlaceholder: "+49 89 32 16 8",
      companyTitle: "Firma",
      companyName: "Name der Firma",
      saveButtonTitle: "Profil Speichern",
      cancelButtonTitle: "Änderungen verwerfen"
    },
    share: {
      subject: "%{shareableUri}",
      message: "Original Foto liegt unter: %{shareableUri}"
    },
    tasks: {
      title: "Chats",
      filterSelectAll: "Alle Orte",
      noTasks: "Es gibt noch keine Aufgaben. Starte mit einem Foto."
    },
    allSites: {
      siteNameValidationErrorMissing:
        "Bitte wähle einen eindeutigen Namen für die Baustelle.",
      noSiteFound: "Keine Baustelle gefunden."
    },
    camera: {
      thisIsAppendedToPhoto:
        "Klicke hier um Anmerkungen an das Foto zu hängen.",
      descriptionTitle: "Beschreibung",
      descriptionPlaceholder: "Beschreibung",
      sitePlaceholder: "Baustelle wählen",
      messagePhotoTaken: "Foto gespeichert",
      photoCouldNotBeTaken: "Foto konnte nicht gespeichert werden.",
      locationUnknown: "Ort unbekannt",
      onSiteLocation: "Position auf der Baustelle",
      noSite: "Keine Baustelle"
    },
    newPhoto: {
      pleaseAddInformation: "Bitte füge Bildinformationen zu",
      createdAt: "Aufgenommen am",
      creatorName: "Fotograph",
      siteName: "Baustelle",
      newSite: "NEUE Baustelle erstellen",
      noSite: "OHNE Baustelle",
      noSiteFound: "Ist dieses Foto auf einer Baustelle? Bitte zufügen.",
      tags: "Tags",
      description: "Beschreibung",
      descriptionPlaceholder: "Was zeigt dieses Foto?"
    },
    selectSite: {
      title: "Baustelle wählen",
      noSite: "Ohne Baustelle",
      createNew: "Neue Baustelle"
    },
    SiteEditorView: {
      description: "Beschreibung",
      developer: "Bauherr",
      siteManager: "Bauleiter",
      siteCreatedByOn:
        "Baustelle wurde von {{creatorName}} am {{createdAt}} erstellt.",
      clickToAddPhoto: "Bild ändern",
      location: "Ort",
      chooseSiteImageTitle: "Quelle für Bild:",
      chooseFromLibraryButtonTitle: "Gallerie",
      takePhotoButtonTitle: "Kamera",
      cancelButtonTitle: "Abbrechen"
    },
    renderImage: {
      gpsLocationUnknown: "GPS Koordinaten unbekannt",
      addressUnknown: "Adresse nicht bekannt",
      site: "Baustelle: {{siteName}}"
    },
    messagesView: {
      title: "Aufgabe"
    }
  }
};

export default I18n;
