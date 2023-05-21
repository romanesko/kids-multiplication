import {BaseToast, ErrorToast} from "react-native-toast-message";
import React from "react";

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
      <BaseToast
          {...props}
          style={{
            borderLeftWidth: 0,
            backgroundColor: '#69C779',
            width:100
      }}
          text1Style={{
            fontSize: 40,
            textAlign: 'center',
          }}
      />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
      <ErrorToast
          {...props}
          style={{
            borderLeftWidth: 0,
            backgroundColor: '#FE6301',
            width:100 }}
          text1Style={{
            fontSize: 40,
            textAlign: 'center',
          }}
      />
  ),
}

export const toastSettings = {
  visibilityTime: 900,
  topOffset: 50
}