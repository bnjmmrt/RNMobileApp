import React, {Dispatch, SetStateAction, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {LABLE} from '../../utils/constants';

type Props = {
  date: Date;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDate: (date: any) => void;
};

const DatePickerComponent: React.FC<Props> = ({date, setOpen, setDate}) => {
  return (
    <>
      <DatePicker
        title={LABLE.BIRTHDAY}
        modal
        open={true}
        date={date}
        onConfirm={(date: any) => {
          setDate(date);
          setOpen(false);
          console.log('Date', date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default DatePickerComponent;
