import React from "react";
import { StyleSheet } from "react-native";
import { useFormikContext } from "formik";
import AppPicker from "../AppPicker";
import ErrorMessage from "../forms/ErrorMessage";

export default function AppFormPicker(props) {
  const {
    items,
    name,
    numberOfColumns,
    PickerItemComponent,
    placeholder,
  } = props;
  const { errors, setFieldValue, touched, values } = useFormikContext();
  return (
    <>
      <AppPicker
        items={items}
        numberOfColumns={numberOfColumns}
        onSelectItem={(item) => setFieldValue(name, item)}
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItem={values[name]}
      />
      <ErrorMessage  style={styles.errorText} error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({
  errorText : {
    fontSize : 15
  }
});