import React from "react";
import { StyleSheet } from "react-native";
import AppTextInput from "../AppTextInput";
import ErrorMessage from "../forms/ErrorMessage";
import { useFormikContext } from "formik";

export default function AppFormField(props) {
  const { name, ...otherProps } = props;
  const { setFieldTouched, touched, setFieldValue, values, errors } = useFormikContext();
  return (
    <>
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={text => setFieldValue(name, text)}
        value={values[name]}
        {...otherProps}
      />
      {touched[name] && (
        <ErrorMessage style={styles.errorText} error={errors[name]} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 15,
  },
});
