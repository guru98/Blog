
import {Stack,PrimaryButton,Image,IImageStyles} from '@fluentui/react';
import {VideoCameraEmphasisIcon} from '@fluentui/react-northstar';

import heroSvg from '../assets/hero.svg';

import { 
    imgStyle,        
    headerStyle,
    upperStackTokens,
    videoCameraIconStyle,
    buttonStyle,
       upperStackStyle} from './styles/HomeScreen.styles'

    export interface HomeScreenProps{
        startCallHandler():void,
        screenWidth:number
    };

    const imageStyleProps: IImageStyles={
        image:{
            height: '100%',
            width:'100%'
        },
        root:{}
    };

    export default(props:HomeScreenProps): JSX.Element => {
        
        const headerTitle = "Passy Communication Services";
        const imageProps = {src:heroSvg.toString()};
        const startCallButtonText = "Testo di prova";
        return (
            <Stack horizontal horizontalAlign = "center" verticalAlign ="center" >
                <Stack className = {upperStackStyle} tokens={upperStackTokens}>
                    <div className= {headerStyle} >{headerTitle}</div>
                    <PrimaryButton className={buttonStyle} onClick={props.startCallHandler}>
                        <VideoCameraEmphasisIcon  className={videoCameraIconStyle} size="medium"/>
                        {startCallButtonText}
                    </PrimaryButton>
                </Stack>
                <Image
                    alt = "Welcome to the Passy CommunicationServices"
                    className = {imgStyle}
                    styles = {imageStyleProps}
                    {...imageProps}
                />
            </Stack>
        );
    };
