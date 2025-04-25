import {ToastAndroid} from 'react-native';

export default function toastMessage(message: string) {
  ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
}
