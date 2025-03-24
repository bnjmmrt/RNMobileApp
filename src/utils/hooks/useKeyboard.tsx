import { useEffect } from 'react';
import { Keyboard, TextInput } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { updateKeyboardState } from 'src/redux/slices/keyboardSlice';

const useKeyboard = (inputRef?: React.RefObject<TextInput>) => {
  const dispatch = useDispatch();

  const { keyboardVisible } = useSelector(
    (state: RootState) => ({
      keyboardVisible: state.keyboard.keyboardVisible,
    }),
    shallowEqual,
  );

  const updateKeyboardStatus = (visible: boolean) => {
    dispatch(updateKeyboardState({ keyboardVisible: visible }));
  };

  const keyboardDidHide = () => {
    inputRef?.current?.isFocused() && inputRef?.current?.blur();
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        keyboardDidHide();
      },
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  return {
    updateKeyboardStatus,
    keyboardVisible,
  };
};

export default useKeyboard;
