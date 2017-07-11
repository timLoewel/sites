/**
 * Created by tim on 06/03/17.
 */
import theme from "./sites-theme";

export default {
  Button: {
    backgroundColor: "#4286dd",
    color: theme.brandPrimary,
    fontSize: theme.fontSizeBase,
    // fontWeight: 700,
    // height: theme.
    padding: theme.btnPadding
  },
  ErrorMessage: {
    color: "red"
  },
  Fieldset: {
    borderBottomColor: "#ddd",
    labelColor: "#909090",
    labelSize: 9,
    labelWeight: 700,
    labelHeight: 25,
    padding: "12 8"
  },
  FormGroup: {
    borderColor: "#ebebeb",
    borderRadius: 3,
    borderStyle: "solid",
    borderWidth: 1,
    errorBorderColor: "red",
    height: 35,
    marginBottom: 10,
    padding: "0 10"
  },
  BaseInput: {
    placeholderColor: "#c9c9c9",
    fontSize: 12
  },
  Input: {
    color: "#313131"
  },
  Label: {
    color: "#bfc2c9",
    fontSize: 12,
    stackedHeight: 20
  },
  Select: {}
};
