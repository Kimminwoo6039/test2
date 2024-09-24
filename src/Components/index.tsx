import React, {Fragment, useEffect, useRef, useState} from 'react';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro'
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer
} from "@mui/material";

import CameraView from "Components/view/camera";
import ScreenView from "Components/view/screen";

import Profile from "Components/element/profile";
import {DateUtil} from "./utils/date";

export class MenuItem {
    index: number;
    name: string;
    icon: React.ReactNode;
    view: React.ReactNode;

    constructor(index: number, name: string, icon?: React.ReactNode, view?: React.ReactNode) {
        this.index = index;
        this.name = name;
        if (icon) {
            this.icon = icon
        }
        this.view = view;
    }
}

export const MainContentType = {
    CAMERA: new MenuItem(0, '카메라', <FontAwesomeIcon icon={icon({name: 'camera'})}/>, (<CameraView/>)),
    SCREEN: new MenuItem(1, '스크린', <FontAwesomeIcon icon={icon({name: 'desktop'})}/>, (<ScreenView/>))
}

export interface IMainProps {
    title: string,
    type?: number
}

const MainView = (props: IMainProps) => {
    const [menuIndex, setMenuIndex] = useState<number>(props.type ? props.type : 0)
     const [menuInfo, setMenuInfo] = useState<MenuItem>(MainContentType.CAMERA)
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [currentTime, setCurrentTime] = useState(DateUtil.getDateToStr({returnType: 'timeonly'}))
    const timer = useRef<NodeJS.Timer>();

    const clickSidebar = (index: number) => {
        return (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            setMenuIndex(index);
        };
    };

    const toggleDrawer = (open: boolean) => {
        return (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event &&
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setDrawerOpened(open)
        }
    }

    const menuList = (disablePadding: boolean) => {
        return (
            <div className="menu-list">

                <List>
                    {Object.values(MainContentType).map((menu, index) => (
                        <ListItem key={'menu-' + menu.index} disablePadding={disablePadding}>
                            <ListItemButton onClick={clickSidebar(menu.index)} selected={menuIndex === menu.index}>
                                <ListItemIcon children={menu.icon}/>
                                <ListItemText primary={menu.name}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }

    useEffect(() => {
        timer.current = setInterval(() => {
            setCurrentTime(DateUtil.getDateToStr({returnType: 'timeonly'}))
        }, 1000);
    }, []);
    // 메뉴 변경시
    useEffect(function () {
        Object.values(MainContentType).forEach(type => {
            if (type.index === menuIndex) {
                setMenuInfo(type);
            }
        })
    }, [menuIndex]);

    return (
        <>
            <nav className="sidebar">
                <ul>
                    <li className="logo">
                        <div className="logo-img">
                            <img src="logo-transparent.png" alt="logo 이미지"/>
                        </div>
                        <div className="logo-text">{props.title}</div>
                        <>
                            <IconButton className="menu-toggler" onClick={toggleDrawer(true)}>
                                <FontAwesomeIcon icon={icon({name: 'bars'})}/>
                            </IconButton>
                            <SwipeableDrawer
                                className="drawer"
                                anchor="right"
                                open={drawerOpened}
                                onClose={toggleDrawer(false)}
                                onOpen={toggleDrawer(true)}
                            >
                                <Box
                                    sx={{width: 300}}
                                    role="presentation"
                                    onClick={toggleDrawer(false)}>
                                    {menuList(false)}
                                </Box>
                            </SwipeableDrawer>
                        </>
                    </li>
                    {menuList(true)}
                </ul>
            </nav>
            <div className="content">
                <header className="header">
                    <div>{menuInfo.name} 메뉴</div><div>{currentTime}</div>
                </header>
                <section>
                    {menuInfo.view}
                </section>
            </div>
        </>
    );
};

export default MainView;
