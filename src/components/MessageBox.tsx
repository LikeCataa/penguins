import styled from "@emotion/styled";
import { Link } from 'react-router-dom';

import right_arrow from '../assets/right_arrow.png';

const ContentBox = styled.div`
    height: 112px;
    display: flex;
    justify-content: space-between;
    border: 2px solid rgb(20, 20, 20);
    padding: 8px 16px;
    position: relative;
    margin-bottom: 18px;
    background-color: #fff;
    cursor: pointer;
    transition: all linear 0.1s;
    top: 0px;
    left: 0px;

    .top {
        font-size: 18px;
        font-weight: 700;
        color: rgb(26, 26, 26);
        margin-bottom: 3px;
    }

    .bottom {
        font-size: 14px;
        color: rgb(108, 108, 108);
    }

    img {
        height: 18px;
        margin-top: 3px;
    }

    &.hidden {
        visibility: hidden;
    }

    &:hover {
        top: 6px;
        left: 8px;

        .contentBoxBg {
            top: 0px;
            left: 0px;
        }
    }

    .contentBoxBg {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: rgb(228, 231, 231);
        z-index: -1;
        top: 6px;
        left: 8px;
        transition: all linear 0.1s;

        &.rainbow {
            background: linear-gradient(90deg, #FF0000 0%, #FFA51F 23%, #E8FC00 35%, #70FF6D 43%, #21FEFE 56%, #7F84FF 65%, #AE01FF 77%, #E903E0 93%);
        }
        &.golden {
            background: rgb(249, 223, 117);;
        }
    }
`;

interface Props {
    title: string,
    description: string,
    to: string,
    bkType: string
}

function MessageBox(props: Props) {
    const { title, description, to, bkType } = props;

    return (
        <Link style={{ textDecoration: 'none' }} to={to}>
            <ContentBox>
                <div>
                    <div className="top">{title}</div>
                    <div className="bottom">{description}</div>
                </div>

                <img src={right_arrow} alt="" />
                <div className={`contentBoxBg ${bkType}`}></div>
            </ContentBox>
        </Link >
    );
}

export { MessageBox };
