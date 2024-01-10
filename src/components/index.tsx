import React, {useState} from 'react';
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
            <header className="header">
                <img src={"logo.png"} alt={"logo 이미지"} height={"80%"}/>
                {props.title}
            </header>
            <main>
            <div className="content">
                    <aside className="sidebar">
                        <div className="title">메뉴 목록</div>
                        <ul>
                            <li>
                                <button type="button" className={type == MainContentType.CAMERA ? 'active' : ''}
                                        onClick={clickSidebar} data-type={MainContentType.CAMERA}>카메라
                                </button>
                            </li>
                            <li>
                                <button type="button" className={type == MainContentType.SCREEN ? 'active' : ''}
                                        onClick={clickSidebar} data-type={MainContentType.SCREEN}>스크린
                                </button>
                            </li>
                        </ul>
                    </aside>
                    <section className="section">
                        {type == MainContentType.CAMERA ? <CameraView /> : null}
                        {type == MainContentType.SCREEN ? <ScreenView /> : null}
                    </section>
                </div>
            </main>
        </>
    );
};

export default MainView;
