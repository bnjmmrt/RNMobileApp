import React, { useRef, forwardRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import QRGenerator from 'react-native-qr-code-styling';

import BottomSheetComponent from './BottomSheet';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import { dateFormat, fontFamily } from '../../utils/functions';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import IMAGES from '@images/index';
import AvatarInitials from '../AvatarInitials';
import TooltipComponent from '../TooltipComponent/TooltipComponent';

interface QRCodeBottomsheetProps {
  title: string;
  subTitle: string;
  imageURL: string;
  name: string;
  isQRShown: boolean;
}
const QRCodeBottomsheet = forwardRef((props: QRCodeBottomsheetProps, ref) => {
  const cancelClick = () => {
    ref.current?.close();
  };

  const [showProfileToolitip, setShowProfileToolitip] = useState(false);
  const [showVIPToolitip, setShowVIPToolitip] = useState(false);
  const [vipTooltipShown, setVipTooltipShown] = useState(false);

  const showTooltip = () => {
    console.log('showTooltipshowTooltipshowTooltip');
    setShowProfileToolitip(true)
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[props.isQRShown ? '75%' : '65%']}
      onClose={() => console.log(ref)}>
      <ScrollView>
        <View style={styles.container}>
          <Text numberOfLines={2} style={styles.title}>
            {props.title}
          </Text>

          <Text style={[styles.subTitle]}>
            {dateFormat(props?.subTitle, 'dddd, MMMM Do, hh:mm:A')}
          </Text>
          <View style={styles.pic_Container}>
            <AvatarInitials name={props.name} size={32} />
            <Text style={styles.name}>{props.name}</Text>
            <TouchableOpacity
              onPress={() => setShowProfileToolitip(!showProfileToolitip)}>
              <Image source={IMAGES.info_filled} />
            </TouchableOpacity>
          </View>
          {/* <Image
            source={{ uri: props.imageURL }}
            style={{
              width: horizontalMarginScale(220),
              height: verticalMarginScale(220),
            }}
          /> */}
          <ImageBackground
            source={props.isQRShown ? IMAGES.ticketBg : IMAGES.ticketBgSm}
            style={{
              width: props.isQRShown ? Wp(85) : 340,
              height: props.isQRShown ? Hp(55) : 340,
              marginTop: props.isQRShown ? 10 : 0,
              alignItems: 'center'
            }}
          >

            {props.isQRShown ? (
              <View style={{ height: verticalScale(290), paddingTop: verticalMarginScale(40) }}>
                <QRGenerator
                  width={horizontalScale(232)}
                  height={verticalScale(232)}
                  type={'svg'}
                  value={props.imageURL}
                  margin={0}
                  qrOptions={{
                    typeNumber: '20',
                    mode: "Byte",
                    errorCorrectionLevel: 'Q',
                  }}
                  dotOptions={{
                    type: "dots",
                    color: COLORS.black,
                  }}
                  cornerSquareOptions={{
                    type: "extra-rounded",

                  }}
                  cornerDotOptions={{
                    type: "extra-rounded",
                    color: COLORS.black,
                  }}
                  backgroundOptions={{
                    round: 0,
                    color: '#ffffff',
                  }}
                  image={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAAD+CAYAAADPoTs1AAAMQGlDQ1BJQ0MgUHJvZmlsZQAASImVVwdYU8kWnluSkEBogVCkhN4EESkBpITQQu8INkISIJQYA0HFXhYVXAsqImBDV0UUOyAWFLGzKPa+WFBR1sWCXXmTArruK9873zf3/vefM/85c+7cMgBoHOeKxbmoJgB5ogJJXEgAY0xKKoPUAxCgA1SBCaBzefliVkxMBIA2eP67vbsOvaFdcZRp/bP/v5oWX5DPAwCJgTidn8/Lg/gAAHg1TywpAIAo4y2mFIhlGDagI4EJQrxIhjMVuFqG0xV4j9wnIY4NcRsAKmpcriQTAPVLkGcU8jKhhnofxM4ivlAEgAYDYt+8vEl8iNMgtoU+Yohl+sz0H3Qy/6aZPqTJ5WYOYcVc5KYSKMwX53Kn/Z/l+N+WlysdjGENm1qWJDRONmdYt5s5k8JlWA3iXlF6VDTE2hB/EPLl/hCjlCxpaKLCHzXi5bNhzQAdYmc+NzAcYiOIg0W5URFKPj1DGMyBGK4QdKqwgJMAsT7EiwT5QfFKn42SSXHKWGhDhoTNUvJnuRJ5XFms+9KcRJZS/3WWgKPUx9SLshKSIaZAbFkoTIqCWB1ip/yc+HClz+iiLHbUoI9EGifL3xLiOIEoJEChjxVmSILjlP4lefmD88U2Zgk5UUq8ryArIVRRH6yNx5XnD+eCXRKIWImDOoL8MRGDc+ELAoMUc8eeCUSJ8UqdD+KCgDjFWJwizo1R+uPmgtwQGW8OsWt+YbxyLJ5UABekQh/PEBfEJCjyxIuyuWExinzw5SACsEEgYAApbOlgEsgGwo7exl54pegJBlwgAZlAAByVzOCIZHmPCB7jQRH4EyIByB8aFyDvFYBCyH8dYhVHR5Ah7y2Uj8gBTyDOA+EgF15L5aNEQ9GSwGPICP8RnQsbD+abC5us/9/zg+x3hgWZCCUjHYzI0Bj0JAYRA4mhxGCiHW6I++LeeAQ8+sPmgjNxz8F5fPcnPCF0Eh4SrhG6CLcmCudJfsoyEnRB/WBlLdJ/rAVuDTXd8ADcB6pDZZyOGwJH3BXGYeF+MLIbZNnKvGVVYfyk/bcZ/HA3lH5kZzJK1iP7k21/Hqlur+42pCKr9Y/1UeSaPlRv9lDPz/HZP1SfD8/hP3tii7D92BnsBHYOO4I1AgbWgjVh7dhRGR5aXY/lq2swWpw8nxyoI/xHvME7K6tkvnOdc4/zF0VfgWCq7B0N2JPE0yTCzKwCBgt+EQQMjojnNJzh4uziBoDs+6J4fb2JlX83EHr7d27+HwD4tAwMDBz+zoW1ALDXAz7+h75ztkz46VAF4OwhnlRSqOBw2YEA3xIa8EkzgN8uC2AL5+MC3IE38AdBIAxEgwSQAibA7LPgOpeAKWAGmAuKQSlYDlaDSrABbAbbwS6wDzSCI+AEOA0ugEvgGrgDV083eAH6wDvwGUEQEkJFaIgBYopYIQ6IC8JEfJEgJAKJQ1KQNCQTESFSZAYyHylFypBKZBNSi+xFDiEnkHNIJ3ILeYD0IK+RTyiGqqE6qDFqjY5AmSgLDUcT0PFoJjoZLUIXoEvRCrQG3Yk2oCfQC+g1tAt9gfZjAFPF6JgZ5ogxMTYWjaViGZgEm4WVYOVYDVaPNcP7fAXrwnqxjzgRp+EM3BGu4FA8Eefhk/FZ+BK8Et+ON+Bt+BX8Ad6HfyNQCUYEB4IXgUMYQ8gkTCEUE8oJWwkHCafgs9RNeEckEulEG6IHfBZTiNnE6cQlxHXE3cTjxE7iI2I/iUQyIDmQfEjRJC6pgFRMWkvaSWohXSZ1kz6oqKqYqrioBKukqohU5qmUq+xQOaZyWeWpymeyJtmK7EWOJvPJ08jLyFvIzeSL5G7yZ4oWxYbiQ0mgZFPmUioo9ZRTlLuUN6qqquaqnqqxqkLVOaoVqntUz6o+UP2opq1mr8ZWG6cmVVuqtk3tuNottTdUKtWa6k9NpRZQl1JrqSep96kf1GnqTuocdb76bPUq9Qb1y+ovNcgaVhosjQkaRRrlGvs1Lmr0apI1rTXZmlzNWZpVmoc0b2j2a9G0RmpFa+VpLdHaoXVO65k2SdtaO0ibr71Ae7P2Se1HNIxmQWPTeLT5tC20U7RuHaKOjQ5HJ1unVGeXTodOn662rqtuku5U3Srdo7pddIxuTefQc+nL6Pvo1+mf9Iz1WHoCvcV69XqX9d7rD9P31xfol+jv1r+m/8mAYRBkkGOwwqDR4J4hbmhvGGs4xXC94SnD3mE6w7yH8YaVDNs37LYRamRvFGc03WizUbtRv7GJcYix2Hit8UnjXhO6ib9Jtskqk2MmPaY0U19Toekq0xbT5wxdBouRy6hgtDH6zIzMQs2kZpvMOsw+m9uYJ5rPM99tfs+CYsG0yLBYZdFq0WdpahlpOcOyzvK2FdmKaZVltcbqjNV7axvrZOuF1o3Wz2z0bTg2RTZ1NndtqbZ+tpNta2yv2hHtmHY5duvsLtmj9m72WfZV9hcdUAd3B6HDOofO4YThnsNFw2uG33BUc2Q5FjrWOT5wojtFOM1zanR6OcJyROqIFSPOjPjm7Oac67zF+c5I7ZFhI+eNbB752sXehedS5XJ1FHVU8KjZo5pGvXJ1cBW4rne96UZzi3Rb6Nbq9tXdw13iXu/e42HpkeZR7XGDqcOMYS5hnvUkeAZ4zvY84vnRy92rwGuf11/ejt453ju8n422GS0YvWX0Ix9zH67PJp8uX4Zvmu9G3y4/Mz+uX43fQ38Lf77/Vv+nLDtWNmsn62WAc4Ak4GDAe7YXeyb7eCAWGBJYEtgRpB2UGFQZdD/YPDgzuC64L8QtZHrI8VBCaHjoitAbHGMOj1PL6QvzCJsZ1hauFh4fXhn+MMI+QhLRHIlGhkWujLwbZRUlimqMBtGc6JXR92JsYibHHI4lxsbEVsU+iRsZNyPuTDwtfmL8jvh3CQEJyxLuJNomShNbkzSSxiXVJr1PDkwuS+4aM2LMzDEXUgxThClNqaTUpNStqf1jg8auHts9zm1c8bjr423GTx1/boLhhNwJRydqTORO3J9GSEtO25H2hRvNreH2p3PSq9P7eGzeGt4Lvj9/Fb9H4CMoEzzN8Mkoy3iW6ZO5MrMnyy+rPKtXyBZWCl9lh2ZvyH6fE52zLWcgNzl3d55KXlreIZG2KEfUNslk0tRJnWIHcbG4a7LX5NWT+yThkq35SP74/KYCHfgj3y61lf4ifVDoW1hV+GFK0pT9U7Wmiqa2T7Oftnja06Lgot+m49N501tnmM2YO+PBTNbMTbOQWemzWmdbzF4wu3tOyJztcylzc+b+Ps95Xtm8t/OT5zcvMF4wZ8GjX0J+qStWL5YU31jovXDDInyRcFHH4lGL1y7+VsIvOV/qXFpe+mUJb8n5X0f+WvHrwNKMpR3L3JetX05cLlp+fYXfiu1lWmVFZY9WRq5sWMVYVbLq7eqJq8+Vu5ZvWENZI13TVRFR0bTWcu3ytV8qsyqvVQVU7a42ql5c/X4df93l9f7r6zcYbyjd8GmjcOPNTSGbGmqsa8o3EzcXbn6yJWnLmd+Yv9VuNdxauvXrNtG2ru1x29tqPWprdxjtWFaH1knrenaO23lpV+CupnrH+k276btL94A90j3P96btvb4vfF/rfub++gNWB6oP0g6WNCAN0xr6GrMau5pSmjoPhR1qbfZuPnjY6fC2I2ZHqo7qHl12jHJswbGBlqKW/uPi470nMk88ap3YeufkmJNX22LbOk6Fnzp7Ovj0yTOsMy1nfc4eOed17tB55vnGC+4XGtrd2g/+7vb7wQ73joaLHhebLnleau4c3Xnsst/lE1cCr5y+yrl64VrUtc7riddv3hh3o+sm/+azW7m3Xt0uvP35zpy7hLsl9zTvld83ul/zh90fu7vcu44+CHzQ/jD+4Z1HvEcvHuc//tK94An1SflT06e1z1yeHekJ7rn0fOzz7hfiF597i//U+rP6pe3LA3/5/9XeN6av+5Xk1cDrJW8M3mx76/q2tT+m//67vHef35d8MPiw/SPz45lPyZ+efp7yhfSl4qvd1+Zv4d/uDuQNDIi5Eq78VwCDDc3IAOD1NgCoKQDQ4P6MMlax/5MbotizyhH4T1ixR5SbOwD18P89thf+3dwAYM8WuP2C+hrjAIihApDgCdBRo4ba4F5Nvq+UGRHuAzaGfk3PSwf/xhR7zh/y/vkMZKqu4OfzvwDDyXxakbuGcQAAAIplWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOShgAHAAAAEgAAAHigAgAEAAAAAQAAAQygAwAEAAAAAQAAAP4AAAAAQVNDSUkAAABTY3JlZW5zaG906ntuWAAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAdZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MjU0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI2ODwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlVzZXJDb21tZW50PlNjcmVlbnNob3Q8L2V4aWY6VXNlckNvbW1lbnQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqybDkFAAAAHGlET1QAAAACAAAAAAAAAH8AAAAoAAAAfwAAAH8AAAuSMFYaCgAAC15JREFUeAHsnVlIVdsbwL/7csMeCqMZKlB8CAujgaKBsBIyKJqNCCOkkSbEbDS1NK1ojjQo6yF7aCQqFHppIKJ6KOqhpHxosMBUwiKpl/tvrcv937gcz177eE7nrLV/ByQ7+9t7r+/3rX7tYe21//jr50f4QAACEDAg8AfCMKBECAQgoAkgDDoCBCBgTABhGKMiEAIQQBj0AQhAwJgAwjBGRSAEIIAw6AMQgIAxAYRhjIpACEAAYdAHIAABYwIIwxgVgRCAAMKgD0AAAsYEEIYxKgIhAAGEQR+AAASMCSAMY1QEQgACCIM+AAEIGBNAGMaoCIQABBAGfQACEDAmgDCMUREIAQggDPoABCBgTABhGKMiEAIQQBj0AQhAwJgAwjBGRSAEIIAw6AMQgIAxAYRhjIpACEAAYdAHIAABYwIIwxgVgRCAAMKgD0AAAsYEEIYxKgIhAAGEQR+AAASMCSAMY1QEQgACCIM+AAEIGBNAGMaoCIQABBAGfQACEDAmgDCMUREIAQggDPoABCBgTABhGKMiEAIQQBj0AQhAwJgAwjBGRSAEIIAw6AMQgIAxAYRhjIpACEAAYdAHIAABYwLOCOPjx4/S0NBgnDiB8SfQrVs36devnwwYMECSkpLi3yBa4EnACWF8/fpVqqqqpLCw0DNhAhKTQJ8+fSQlJUUGDx4sY8eOlXHjxsnQoUOlV69eidnggLYKYQS08DakrSQyYsQIycrKkrlz50pqaqoNzXa6jQjD6fK6k1yPHj0kIyNDlixZIvPnz+fII06ldUIYP378kPfv38vbt2/jhDF+u/3+/bt8/vxZmpubRV3HeffunTQ2Nuo/FRMXP4MGDdLiyMvL46jjNxfYCWH8ZmZW7E6JRMnj3r17UldXJw8ePNBStaLxho1U4lDSWL58uQwcONBwLcK6QgBhdIWeRet++fJFnj17JrW1tXLhwgVpbW21qPXhm5qeni4bNmyQefPmcaoSHlWXlyKMLiO0bwNNTU1y/fp1OXv2rDx8+NC+BEK0WF3jUBdHlTgmTZoUIoKvokEAYUSDoqXbaG9vl/r6ejl48KAz4uBoI7adEWHElq8VW29paZGTJ09qcbS1tVnR5nCNVEcby5Yt0+NyuLYRjpT/ZQjDPzNn11CnJ6WlpfoiqQtJZmZm6nw4RYleNRFG9Fg6sSV1mnL69GkpKysTF442xo8fLyUlJfr6hhMFinMSCCPOBUjE3atbsuqi6O7du/WdlURso582IQ0/tMLHIozwfAK9VJ2iqP+d1YVR2z9IIzoVRBjR4ejsVlySRnZ2tuzatUtGjx7tbL1inRjCiDVhB7bvkjSWLl0qe/bsYWRohP0SYUQILmiruSKNnj17yqpVq2Tz5s2SnJwctDJ2OV+E0WWEwdnArVu3ZMeOHfLo0SOrk1bPoGzbtk2Lw+pE4tB4hBEH6LbuUt09qamp0dKw/ZbrlClT9BiNiRMn2lqOuLQbYcQFu707VeM0jh8/rsdpdHR0WJuImh5QnZoUFxdzauKjigjDByxC/ybw5MkTPUbj6tWrViPh1MR/+RCGf2as8ZPA5cuXZcuWLfL69WureeTk5Oi7Jmo+UT7eBBCGNyMiQhBQs3nt3btXn56EWGzNV+ooY/v27bJy5Upr2hzPhiKMeNK3fN+uHGUsWrRIysvL9azllpck5s1HGDFH7O4OPn36JPv379c/NmfJUYZ59RCGOSsiQxBw5Shj/fr1UllZyQuVQtT4168Qxq80+N03AVeuZUyYMEE/aDdt2jTfDIK0AsIIUrVjlOuZM2ekoKDA6vkz1JBxdddH/fDpnADC6JwNSwwJqOdMXJipiwfTvAuOMLwZEeFBwJXTEoaLexT652KE4c2ICAMC1dXVkp+fLzYPF+duiXehEYY3IyIMCLjwJKt6vkQ99q5Or/iEJoAwQnPhW58Enj59qp8vuXLlis81EytcjfisqKjggbROyoIwOgHD1/4IuDKIa8aMGXoav1GjRvkDEJBohBGQQsc6TTVXxqFDh2Tr1q2x3lVMt894jPB4EUZ4Piz1QcCFC5/Dhg2ToqIiWbhwoY/MgxOKMIJT65hn6sIArrS0ND2jWG5ubsx52bgDhGFj1RK0zS48V8Kt1fCdC2GE58NSHwQQhg9YloYiDEsLl4jNRhiJWJXotglhRJdnoLeGMNwvP8Jwv8a/LUOE8dtQx21HCCNu6N3b8fnz56WwsFCampqsTY67JOFLhzDC82GpDwIujMNQL2reuXOnzJw500fmwQlFGMGpdUwzZaRnTPEmzMYRRsKUwu6GuDInxpw5c/RDdOnp6XYXJEatRxgxAhu0zbrytCqzboXvuQgjPB+WGhK4ceOGfiP68+fPDddIvDDmw/CuCcLwZkSEAQEXniNhWLh3oRGGNyMiPAi4MhcGc3p6FPrnYoThzYgIDwJ3797VtyLv3LnjEZnYi5lty7s+CMObEREeBFw4Henbt6+e/Gfjxo0e2QZ7McIIdv27nL0rt1Ozs7P11Hxq4BafzgkgjM7ZsMSAgAvPj6g0OR0xKPbPEIRhxomoEATa29vlwIED+n/mEIut+Ypp+cxLhTDMWRH5HwIuvItEpcTRxX8KG+avCCMMHBZ1TsCVaxccXXRe41BLEEYoKnznScCFOyMqyRUrVkhlZSUvLvKs+N8BCMMQFGH/EnDlbe0cXfxbU9PfEIYpKeI0AVcudPbs2VNWrVql36WanJxMdQ0JIAxDUISJKFmcOnVKysvLpa2tzWokjLuIrHwIIzJugVzr5s2b+onUZ8+eWZ0/pyKRlw9hRM4uUGu6ct2CU5GudVuE0TV+gVjbFVmo+S7UdYvi4mLuikTYcxFGhOCCsporslD1mj17tpSVlQnT70XeexFG5OycX/PevXv6sfXbt29bn2tmZqaUlpbKpEmTrM8lngkgjHjST9B9qxnAL126pP+BvXr1KkFbad6s8ePHS0lJiWRlZZmvRGRIAggjJJbgfqleQlRVVaV/bL91qqo4ffp0PQs4j61Hp08jjOhwtH4r6qhCzZhVUVEhLpyCqAucixYtkqKiIklNTbW+PomSAMJIlErEsR2uHVX06NFDVq9erV/b2KtXrziSdW/XCMO9mhpnpERRW1urR2+6cK1CJT5y5Eg93Fu96jApKcmYBYFmBBCGGSenolwUhTqqWLx4sRQUFHAKEsPeijBiCDeRNq0koa5NqCn16uvrpaOjI5Ga16W2cFTRJXy+VkYYvnDZE/zlyxdRz3w8ePBA1HiK+/fvS2trqz0JGLRUvXhozZo1ek4LrlUYAItCiNPC+Pr1qzQ0NEhjY6N8+/YtCrgScxM/fvyQ5uZm+fDhg7x7905evHihf3fpKOIf8urux/DhwyUnJ0fUi5O5A/IPmd/zp3PCUP94Hj9+LEeOHBH1dKXLovg9XSQx9qKOJiZPniwLFizQA7C4oBmfujgljDdv3sjRo0eluroaUcSnP0Vtr+pIYvDgwTJ27FiZNWuWTJ06VTjtiBreiDfkjDCePHmihzJfu3YtYhisGB8C6g7HgAEDtCBGjBghGRkZov5MSUnh1mh8StLpXp0QxsePH+Xw4cOyb9++/yf6559/ypgxY/S5rup86pCWT+IRULLgyCHx6tJZi5wQxsWLF/XV8paWFp1nWlqa5OfnS25urnTv3r2z3PkeAhDwScB6YagRimqa+JqaGp16//79tSw2bdrkEwXhEICAFwHrhVFXV6cF8fLlS52ruop+4sQJ6d27t1fuLIcABHwSsF4Y586d06+6U7dP1bnwunXr9NwHPjkQDgEIGBCwXhjqVCQvL0+nOmTIEP0swdq1aw1SJwQCEPBLAGH4JUY8BAJMwHph/HqHRN1KVe/KPHbsWIBLSuoQiB2B/wEAAP//yE5+VQAACTZJREFU7Z1LqE1tGMcfEyIhcZyIAUmiDCgOSomJUMotA0rJ4JRLHQfJ/X4QIiMyUGRAMiEnA7eExIiBo5TbgAxQYvJ93/t2rPp2++yz9177edd6n/XbdbIvaz3v+/z+q5+111577T7//HeTiG9PnjyRnTt3Smdnp+9i+vTpcuDAAZk3b17EXTF1COSTQJ/YhfH582c5deqUdHR0eMJ9+/aVVatWybFjx2TYsGH5pM6sIBApgeiF4bjfvXtXtmzZIi9evPAxOGnMnTvX73nMnDkz0miYNgTyR8CEMP78+SNXrlyRtrY2+fr1a0J54MCBMmHCBBk3bpwMGDAgeZ472RPo16+fDBkyxP+NGDFCmpubZcyYMTJ27Fjp379/9hNkBmUJmBCG6+znz59y6dIl2bVr1/+kUbZrnswtgeHDh8vEiRNlypQpMmfOHJkxY4aMGjUqt/Mt2sTMCMMF5/Y0Hj16JIcPH04OghYtUGv9Dho0yMtj8eLFsmTJEr+3aK3HmPoxJYy/4N3exvPnz+XGjRvy8OFDeffuHXsdf+FE/K+Th/v0a+3atdLS0iJDhw6NuJs4p25SGHFGkW7WP3788GL89OmTvH//Xp4+fSqPHz+Wt2/fyq9fv9IVz+HakyZNkg0bNsjSpUsRR8B8EEZA2FkM5Q4Cu3NV7ty5I7du3ZI3b95kMQ21MRGHGtqyhRFGWSw2n3R7Ic+ePfMHh2/evCnfvn0z0ah7q7Jw4ULZvHmzTJs2zURPeW0CYeQ1GeV5vX79Ws6cOSNXr141I47Ro0dLa2urrFu3jrcpStsPwlACG0tZa+Jgb0N3y0MYunyjqe6Oc+zdu9cf54hm0hUm6s7w3bNnj8yfP7/CUrxUKwGEUSsxw8t///5dLly44L+8Z+H4hjsg2t7eLsuWLePs0QZttwijQSAtlXF7G+5/59u3b0ffVlNTkz8YunHjRqTRgDQRRgMgWizx8uVL2b9/v1y/fj369pBG4yJEGI1jaa7Sly9f/Ccpx48fj/7kLyeN7du3y6ZNm8zlFLIhhBGSdoRjueMa58+fl4MHD0b/8evkyZP9JQ+WL18eYRL5mDLCyEcOuZ6FpT0NPj1Jt6khjHT8CrP2hw8f/FXN3Mlesd9WrFjh95jcdVK41UYAYdTGq9BLWzkQOnjwYH8sY+vWrXxyUuMWjTBqBFb0xR88eOCPA9y7dy9qFOPHj5cdO3bImjVrou4j9OQRRmjikY/3+/dvf3KXu1J77Cd3ubcmhw4d8pcFjDyWYNNHGMFQ2xnIHc84evSonD17Nuqm3FuTbdu2+b+oGwk4eYQRELaloe7fv++vnxr7W5NZs2b5s1r5HZvqtk6EUR0nlioh4N6anDt3zh8HiPmKXu7q5e5krt27d3MAtCTjcg8RRjkqPFcVASvfcHW/YeO+qTt79uyq+i7yQgijyOmn7N3KXganjVe/ISCM6lmxZBkCVvYyVq5c6U/mcj+kxK1nAgijZza8UgUBt5dx8uRJ/8WuKhbP7SJ8z6S6aBBGdZxYqgKBa9eu+Y8mu7q6KiyV75c4+FldPgijOk4sVYGAlVPGeVtSIeTulxBG74xYohcCVt6WuJ8ocL/Nu2jRol46Lu7LCKO42Te088uXL/vrZ378+LGhdUMW49OS3mkjjN4ZsUQVBKyc+el+fvHIkSOcxNVD5gijBzA8XRuBV69e+Y8l3Z5GzDf37VX3hbSRI0fG3Iba3BGGGtpiFXaX8jtx4oTs27cv6sYXLFjge5g6dWrUfWhNHmFokS1g3dOnT0d/kV0OfFbecBFGZT68WgOBixcvSltbW9TXyeAErsqBI4zKfHi1BgIWPilxP+jsrsS1fv36GjovzqIIozhZq3dq4YxPhFF5M0EYlfnwag0EEEYNsCJdFGFEGlwep40w8phKY+eEMBrLs9DVEIb9+BGG/YyDdYgwgqHObCCEkRl6ewMjDHuZlnaEMEqJ8LhuAgijbnTRrIgwookq/xNFGPnPKO0MEUZagqyfEEAYCQqzdxCG2WjDN4YwwjMPPSLCCE3c8HgIw3C43a0hDPsZB+sQYQRDndlACCMz9PYGRhj2Mi3tCGGUEuFx3QQQRt3oolkRYUQTVf4nijDyn1HaGSKMtARZPyGAMBIUZu8gDLPRhm8MYYRnHnpEhBGauOHxEIbhcLtbQxj2Mw7WIcIIhjqzgRBGZujtDYww7GVa2hHCKCXC47oJIIy60UWzIsKIJqr8TxRh5D+jtDNEGGkJsn5CAGEkKMzeQRhmow3fGMIIzzz0iAgjNHHD4yEMw+F2t4Yw7GccrEOEEQx1ZgMhjMzQ2xsYYdjLtLQjhFFKhMd1E0AYdaOLZkWEEU1U+Z8owsh/RmlniDDSEmT9hADCSFCYvYMwzEYbvjGEEZ556BERRmjihsdDGIbD7W4NYdjPOFiHCCMY6swGQhiZobc3MMKwl2lpRwijlAiP6yaAMOpGF82KCCOaqPI/UYSR/4zSzhBhpCXI+gkBhJGgMHsHYZiNNnxjCCM889AjIozQxA2PhzAMh9vdGsKwn3GwDhFGMNSZDYQwMkNvb+DOzk7p6OiQrq6uaJtramqS1tZWWb16dbQ9aE4cYWjSpTYEjBFAGMYCpR0IaBJAGJp0qQ0BYwQQhrFAaQcCmgQQhiZdakPAGAGEYSxQ2oGAJgGEoUmX2hAwRgBhGAuUdiCgSQBhaNKlNgSMEUAYxgKlHQhoEkAYmnSpDQFjBBCGsUBpBwKaBBCGJl1qQ8AYAYRhLFDagYAmAYShSZfaEDBGAGEYC5R2IKBJAGFo0qU2BIwRQBjGAqUdCGgSQBiadKkNAWMEEIaxQGkHApoEEIYmXWpDwBgBhGEsUNqBgCYBhKFJl9oQMEYAYRgLlHYgoEkAYWjSpTYEjBFAGMYCpR0IaBJAGJp0qQ0BYwQQhrFAaQcCmgQQhiZdakPAGAGEYSxQ2oGAJgGEoUmX2hAwRgBhGAuUdiCgSQBhaNKlNgSMEUAYxgKlHQhoEkAYmnSpDQFjBBCGsUBpBwKaBBCGJl1qQ8AYAYRhLFDagYAmAYShSZfaEDBGAGEYC5R2IKBJAGFo0qU2BIwRQBjGAqUdCGgSQBiadKkNAWMEEIaxQGkHApoEEIYmXWpDwBgBhGEsUNqBgCaBfwE9uZGdVqdRxAAAAABJRU5ErkJggg=="}
                  imageOptions={{
                    saveAsBlob: true,
                    hideBackgroundDots: true,
                    imageSize: 0.4,
                    margin: 0,
                  }}
                />
              </View>
            ) : (
              <ImageBackground
                resizeMode='contain'
                source={IMAGES.ticket}
                style={styles.cardTicketBg}
              >
                <Text style={styles.cardName}>{props.name}</Text>
              </ImageBackground>
            )}
            <View style={[styles.vipContainer, {marginTop: props.isQRShown ? 25: 50}]}>
              <Text style={styles.vipText}>VIP</Text>
              <TouchableOpacity onPress={showTooltip}>
                <Image source={IMAGES.info_filled} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.infoText}>{props.isQRShown ? LABLE.SHOW_QR_CHECKIN_MESSAGE : 'Show this Ticket Confirmation at event check-in'}</Text>

          </ImageBackground>

          {/* <View style={styles.card}>
            <View style={styles.ticket}>
              {props.isQRShown ? (
                <Image
                  source={{ uri: props.imageURL }}
                  style={{
                    width: horizontalMarginScale(232),
                    height: verticalMarginScale(232),
                  }}
                />
              ) : (
                <Image
                  source={IMAGES.ticket}
                  style={{
                    marginTop: verticalMarginScale(12),
                  }}
                />
              )}

              <View style={{ flexDirection: 'row' }}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <View key={index} style={styles.divider} />
                ))}
              </View>
              <View style={styles.vipContainer}>
                <Text style={styles.vipText}>VIP</Text>
                <TouchableOpacity onPress={showTooltip}>
                  <Image source={IMAGES.info_filled} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
            <Image source={IMAGES.half_circle} style={styles.cardBottom} />
          </View> */}
          {/* <Text style={styles.infoText}>{LABLE.SHOW_QR_CHECKIN_MESSAGE}</Text> */}
        </View>
      </ScrollView>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(20),
    // paddingVertical: verticalMarginScale(16),
    gap: 8,
    // justifyContent:"center",
    alignItems: 'center',
  },
  btnStyle: {
    borderRadius: fontScale(100),
  },
  clearButton: {
    borderWidth: horizontalScale(1),
    backgroundColor: COLORS.tabBorderColor,
    // borderColor: COLORS.black,
  },
  title: {
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center',
  },
  subTitle: {
    color: COLORS.black,
    fontSize: fontScale(18),
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginTop: verticalMarginScale(2),
    marginBottom: verticalMarginScale(12),
    textAlign: 'center',
  },
  pic_Container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 50,
  },
  name: {
    fontSize: fontScale(14),
    fontWeight: '500',
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
    paddingHorizontal: verticalMarginScale(6),
  },
  cardTicketBg: {
    marginTop: 40,
    width: 232,
    height: 148,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 20
  },
  cardName: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: fontFamily.ABCDiatype_Bold,
  },
  card: {
    width: horizontalScale(272),
    borderTopLeftRadius: radiusScale(10),
    borderTopEndRadius: radiusScale(10),
    shadowColor: COLORS.black,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 2, height: 4 },
    elevation: 10,
    backgroundColor: COLORS.white,
  },
  cardBottom: {
    width: horizontalScale(272),
    height: Platform.OS === 'android' ? 10 : 20,
    top: 10,
    resizeMode: Platform.OS === 'ios' ? 'contain' : 'cover',
  },
  ticket: {
    paddingTop: verticalMarginScale(6),
    backgroundColor: COLORS.white,
    width: horizontalScale(272),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: radiusScale(10),
    borderTopEndRadius: radiusScale(10),
  },
  image: {},
  divider: {
    width: horizontalScale(40),
    height: verticalScale(4),
    backgroundColor: COLORS.borderGray,
    borderRadius: radiusScale(50),
    marginHorizontal: Platform.OS === 'android' ? 3.5 : 3.2,
    marginVertical: verticalMarginScale(20),
  },
  vipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 25
  },
  vipText: {
    fontSize: fontScale(20),
    marginRight: verticalMarginScale(10),
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  infoText: {
    fontSize: fontScale(14),
    color: 'gray',
    marginTop: verticalMarginScale(50),
    zIndex: 10,
  },
});

export default QRCodeBottomsheet;
