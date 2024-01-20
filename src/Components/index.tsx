import React, {Fragment, useEffect, useState} from 'react';

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
                <Profile
                    imageUrl="https://github.com/hjkim1004.png"
                    name="Heejeong Kim"
                    job="Full Stack Developer"
                    link={{
                        blog: 'https://velog.io/@developer_khj',
                        github: 'https://github.com/hjkim1004',
                        email: 'developer.heejeong@gmail.com'
                    }}
                />
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
                    {menuInfo.name} 메뉴
                </header>
                <section>
                    {menuInfo.view}
                </section>
            </div>
        </>
    );
};

export default MainView;
