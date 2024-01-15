import React from 'react';
import {Avatar, Link, Tooltip} from "@mui/material";
import './style.css';
import velogIcon from '../../../Images/velog.svg';
import githubIcon from '../../../Images/github.svg';
import gmailIcon from '../../../Images/gmail.svg';


export interface IProfileLinkProps {
    blog?: string;
    github?: string;
    email?: string;
}

export interface IProfileProps {
    imageUrl?: string;
    name: string;
    job?: string;
    link?: IProfileLinkProps
}

const Profile = (props: IProfileProps) => {
    return (
        <div className="profile-container">
            <div className="logo-area">
                <div className="logo-wrapper">
                    <Avatar className="logo-avatar" src={props.imageUrl} alt="프로필 이미지"/>
                </div>
            </div>
            <div className="info-area">
                <div className="name">{props.name}</div>
                <div className="job">{props.job}</div>
            </div>
            <div className="link-area">
                {props.link && props.link.blog ? (
                    <Link href={props.link.blog} target="_blank">
                        <Tooltip title="블로그(velog) 페이지 열기" arrow={true}>
                            <img src={velogIcon} alt="velog 아이콘"/>
                        </Tooltip>
                    </Link>
                    ) : <></>}
                {props.link && props.link.github ? (
                    <Link href={props.link.github} target="_blank">
                        <Tooltip title="깃허브(GitHub) 페이지 열기" arrow={true}>
                            <img src={githubIcon} alt="github 아이콘"/>
                        </Tooltip>
                    </Link>
                ) : <></>}
                {props.link && props.link.email ? (
                    <Link href='#' onClick={() => {
                        if (props.link) {
                            if (props.link.email) {
                                // @ts-ignore
                                window.location = 'mailto:' + props.link.email;
                            }
                        }
                    }}>
                        <Tooltip title="메일 보내기" arrow={true}>
                            <img src={gmailIcon} alt="Gmail 아이콘"/>
                        </Tooltip>
                    </Link>
                ) : <></>}
            </div>
        </div>
    );
};

export default Profile;
