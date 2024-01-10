import React, {useState} from 'react';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import CameraView from "./view/camera";
import ScreenView from "./view/screen";

export enum MainContentType {
    CAMERA,
    SCREEN
}

export interface IMainProps {
    title: string,
    type?: MainContentType
}

const MainView = (props: IMainProps) => {
    const [type, setType] = useState<MainContentType>(props.type ? props.type : MainContentType.CAMERA)

    const clickSidebar = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const button: HTMLButtonElement = event.currentTarget;
        const type = button.dataset.type as unknown as MainContentType;
        setType(type);
    };

    return (
        <>
            <nav className="sidebar">
                <ul>
                    <li className="logo">
                        <div className="logo-img">
                            <img src="logo-transparent.png" alt="logo 이미지"/>
                        </div>
                        <div className="logo-text">{props.title}</div>
                    </li>
                    <li className="title">
                        메뉴 목록
                    </li>
                    <li>
                        <button type="button" className={type == MainContentType.CAMERA ? 'active' : ''}
                                onClick={clickSidebar} data-type={MainContentType.CAMERA}>
                            <FontAwesomeIcon icon={icon({name: 'camera'})}/> 카메라
                        </button>
                    </li>
                    <li>
                        <button type="button" className={type == MainContentType.SCREEN ? 'active' : ''}
                                onClick={clickSidebar} data-type={MainContentType.SCREEN}>
                            <FontAwesomeIcon icon={icon({name: 'desktop'})}/> 스크린
                        </button>
                    </li>
                </ul>
            </nav>
            <div className="content">
                <header className="header">
                </header>
                <section className="section">
                    {type == MainContentType.CAMERA ? <CameraView /> : null}
                    {type == MainContentType.SCREEN ? <ScreenView /> : null}
                </section>
            </div>
        </>
    );
};

export default MainView;
