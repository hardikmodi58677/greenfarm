import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";

export default function AppFormImagePicker(props) {
  const { name } = props;
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const imageUris=values[name]
  
  const handleAdd=(uri)=>{
    setFieldValue(name, [...imageUris, uri])
  }
  const handleRemove=(uri)=>{
    setFieldValue(name, imageUris.filter(imageUri=>uri!==imageUri))
  }

  return (
    <View>
     
      <ErrorMessage style={styles.errorText} error={errors[name]} visible={touched[name]} />
    </View>
  );
}

const styles = StyleSheet.create({
  errorText : {
    fontSize  :15
  }
});
