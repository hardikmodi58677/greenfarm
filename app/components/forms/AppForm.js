import React from "react";
import { StyleSheet } from "react-native";
import { Formik } from "formik";

export default function AppForm(props) {
  const { initialValues, onSubmit, validationSchema, children } = props;
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {() => (<>{children}</>)}
    </Formik>
  );
}

const styles = StyleSheet.create({});
