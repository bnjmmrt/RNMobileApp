import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { View } from 'react-native';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { COLORS } from 'src/utils/constants';
import { verticalScale } from 'src/utils/dimensions';
import { styles } from './style';

export type TicketType = {
  capacity: number;
  description: string;
  enabled: boolean;
  id: string;
  name: string;
};

export interface TicketTypeBottomSheetInterface {
  ticketTypes: TicketType[];
  selectedTicketType: TicketType | undefined;
  setSelectedTicketType: React.Dispatch<
    React.SetStateAction<TicketType | undefined>
  >;
}

const TicketTypeBottomSheet = forwardRef<
  BottomSheetMethods,
  TicketTypeBottomSheetInterface
>(({ selectedTicketType, setSelectedTicketType, ticketTypes }, ref) => {
  const sheetRef = useRef<BottomSheetMethods>(null);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
  }));

  const closeSheet = () => {
    sheetRef?.current?.close();
  };

  const renderListRow = useCallback(
    ({ item, index }: { item: TicketType; index: number }) => {
      const isSelected = item.id === selectedTicketType?.id;
      return (
        <Button
          title={item.name}
          style={[
            styles.actionButton,
            isSelected && { borderColor: COLORS.black },
          ]}
          onPress={() => {
            setSelectedTicketType(item);
            closeSheet();
          }}
        />
      );
    },
    [selectedTicketType],
  );
  const snapPoint =
    ticketTypes.length == 1
      ? `12%`
      : ticketTypes.length > 8
      ? '50%'
      : `${ticketTypes.length * 10}%`;
  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={[snapPoint]}
      enableDynamicSizing={false}
      onClose={closeSheet}>
      <BottomSheetFlatList
        data={ticketTypes}
        renderItem={renderListRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ gap: verticalScale(8) }}
        ListFooterComponent={<View style={{ height: verticalScale(30) }} />}
        ListHeaderComponent={<></>}
      />
    </BottomSheetComponent>
  );
});

export default TicketTypeBottomSheet;
