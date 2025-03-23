import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { updateKeyboardState } from 'src/redux/slices/keyboardSlice';

const useKeyboard = () => {
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

  return {
    updateKeyboardStatus,
    keyboardVisible,
  };
};

export default useKeyboard;
