import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import StatusButton from 'src/component/StatusButton/StatusButton';
import { COLORS } from 'src/utils/constants';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

interface ReferralRequestItemProps {
    name: string;
    message: string;
    image: string;
    onApproveApi: () => Promise<void>;
    onDeclineApi: () => Promise<void>;
    loading?: boolean
}

const ReferralRequestItem: React.FC<ReferralRequestItemProps> = ({ name, image, message, onApproveApi, onDeclineApi, loading }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [status, setStatus] = useState<'approve' | 'reject' | null>(null);
    const [approveLoader, setApproveLoader] = useState(false);
    const [declineLoader, setdeclineLoader] = useState(false);

    const handleApprove = async () => {
        setApproveLoader(true)
        try {
            await onApproveApi();
            setStatus('approve');
            setIsSubmitted(true);
            setApproveLoader(false)
        } catch (error) {
            console.error('Error during approve:', error);
            setApproveLoader(false)
        }
    };

    const handleDecline = async () => {
        setdeclineLoader(true)
        try {
            await onDeclineApi();
            setStatus('reject');
            setIsSubmitted(true);
            setdeclineLoader(false)
        } catch (error) {
            setdeclineLoader(false)
            console.error('Error during decline:', error);
        }
    };

    return (
        <View style={[styles.container, isSubmitted && styles.row]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {!image && <AvatarInitials name={name} size={radiusScale(48)} />}
                {image && <Image source={{ uri: image }} width={48} height={48} style={{ borderRadius: radiusScale(100) }} />}
                {!isSubmitted && <View style={{ width: '85%' }}><Text style={styles.messageText}>{name} {message}</Text></View>}
            </View>
            <View style={[styles.content, isSubmitted && styles.contentRow]}>
                {isSubmitted && <View>
                    <Text style={styles.messageText}>{name}</Text>
                    <Text style={styles.requestText}>{status == "approve" ? "Request Accepted!" : "Request Denied!"}</Text>
                </View>}
                {!isSubmitted ? (
                    <View style={styles.actions}>
                        <StatusButton declineLoading={declineLoader} text="Decline" type="stripe" onPress={handleDecline} />
                        <StatusButton loading={approveLoader} text="Approve" type="solid" onPress={handleApprove} />
                    </View>
                ) : (
                    <StatusButton
                        type="circular"
                        status={status}
                        onPress={() => console.log(status === 'approve' ? 'Accepted' : 'Denied')}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 16,
        borderColor: COLORS.borderGray,
        borderWidth: 1,
        paddingHorizontal: horizontalMarginScale(16),
        paddingVertical: verticalMarginScale(16),
        flexDirection: 'column',
        gap: 12,
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    content: {
        flex: 1,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 2,
    },
    messageText: {
        fontSize: fontScale(14),
        color: COLORS.black,
        fontFamily: fontFamily.ABCDiatype_Medium
    },
    requestText: {
        fontSize: fontScale(12),
        color: COLORS.light_gray,
        flexWrap: 'wrap',
        marginTop: verticalMarginScale(4),
        fontFamily: fontFamily.ABCDiatype_Medium

    },
});

export default ReferralRequestItem;
